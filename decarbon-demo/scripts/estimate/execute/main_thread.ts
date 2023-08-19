import axios, { AxiosResponse } from "axios";
import { url } from "../../aggregate/use_beaconchain_apis";
import { ethers } from "hardhat";
import { Queue } from "../../classes";
import { Epoch, exampleEpoch, IndividualEnergyStats } from "../../interfaces";
import { get_blocks_of_epoch } from "../../aggregate/use_beaconchain_apis";
import { calculate_x_y_factors_of_epoch } from "../core";
import { get_tx_fee_paid_and_balance_change_of_addresses_in_epoch } from "../../aggregate/use_json_rpc/";
import { Worker, isMainThread } from "worker_threads";
import { constants } from "../../01_constants";
import { log } from "../../utils";
import fs from "fs";

/**
 * @notice set the path of log file and clear the log file
 */
const logPath: string = "data/logs/main_thread.ts.log";
fs.writeFileSync(logPath, "");

/**
 * @notice These are the 4 crucial global variables for the main thread to run
 * queue: a queue of epochs pending to be finalized
 * worker: a worker thread that runs parallely along this main thread (its duty is to fetch the total Eth supply, avg. network consumption and emissions every of the newest epoch everytime it is created)
 * stats: a map that has address/public key as key and IndividualEnergyStats as value
 * isLocked: false if open to receiving input, true otherwise
 */
const queue: Queue<Epoch> = new Queue<Epoch>();
const worker: Worker = new Worker("./scripts/estimate/execute/worker_thread.ts");
let stats: Map<string, IndividualEnergyStats> = new Map<string, IndividualEnergyStats>();
let isLocked: boolean = false;

/**
 * 
 * @notice This function checks if an epoch is finalized
 * @returns true if '_epoch' if finalized, false otherwise.
 */
async function confirm_finalization_of_epoch(_epoch: Epoch)
    : Promise<boolean> {
	const epochResponse: AxiosResponse = await axios.get(`${url}/epoch/${_epoch.epochNum}`);
	const epochStatus: boolean = epochResponse.data.data.finalized;
	return epochStatus;
}

/**
 * 
 * @param serializedEpoch an object.
 * @returns an 'Epoch' object. See 'scripts/interfaces/Epoch.ts' for more details.
 */
function deserializeEpoch(serializedEpoch: Record<string, unknown>): Epoch {
	try {
		const epoch: Epoch = { epochNum: -1n };
		// for (const [key, value] of Object.entries(serializedEpoch)) {
		//     if (value === undefined) {
		//         throw new Error(`serializedEpoch.${key} is undefined`);
		//     }
		//     epoch[] = value;
		// }
		epoch.epochNum = serializedEpoch.epochNum as bigint;
		epoch.finalized = serializedEpoch.finalized as boolean;
        epoch.totalEthSupply = serializedEpoch.totalEthSupply as bigint;
        epoch.kWh = serializedEpoch.kWh as number;
        epoch.kgCO2e = serializedEpoch.kgCO2e as number;
		return epoch;
	} catch (err: unknown) {
		throw new Error(`deserializeEpoch()^ Error: ${err}`);
	}
}

/**
 * @notice Setup listener to handle epoch data sent from the worker thread
 */
worker.on("message", (serializedEpoch: Record<string, unknown>) => {
	queue.enqueue(deserializeEpoch(serializedEpoch));
	log(`Received epoch ${queue.front()?.epochNum} from worker thread!`, logPath);
	log(`Front of queue: ${queue.front()?.epochNum}`, logPath);
	log(`Back of queue: ${queue.back()?.epochNum}`, logPath);
	log(`Length of queue: ${queue.size()}`, logPath);
	log(queue.size() < 4 ? `Good news: ${(4 - queue.size()) * constants.NUM_MINUTES_IN_EPOCH} minutes left until epoch ${queue.front()?.epochNum} finalizes (〃￣︶￣)人(￣︶￣〃)` : "", logPath);
});

// /**
//  * @notice This function handle input data sent to this process (web app will send an address list to this process in order to invoke main() function).
//  * @dev This function will invoke main() with {param: 'data'} if data's type is Array<string>
//  */
// process.stdin.on("data", async (rawBuffer: unknown) => {
// 	try {
// 		if (!isLocked) {
// 			const dataString: string = rawBuffer!.toString().trim();
// 			const dataArray: string[] = dataString.split("\n");
// 			console.log(`Thanks for giving me data :>, please confirm if this is what you sent me:\n${dataString}`);
// 			isLocked = true;
// 			console.log("Wait a minute let me calculate consumption/GHG emission for you...");
// 			console.log(`You can see what I'm internally doing at ${logPath}.`);
// 			console.log("I also asked my friend to help me keep track of the latest epoch, come check his work at data/logs/worker_thread.ts.log");
// 			await main(dataArray).catch((err: any) => console.log(err));
// 			console.log(`We're done! Come check the result at ${logPath}`);
// 			isLocked = false;
// 		}
// 		else {
// 			console.log("Thanks for the data but I'm busy right now, please come back soon!(^_^)");
// 		}
// 	} catch (err: unknown) {
// 		console.error(`Process encountered error on receiving input data: ${err}`);
// 	}
// });

/**
 * 
 * @notice estimate individual energy consumption/GHG emissions for each entry in 'stats' map
 * @returns 'stats' map but with updated 'kWh' and 'kgCO2e' values for each entry
 */
async function estimate()
    : Promise<Map<string, IndividualEnergyStats>> {
	try {
		while (true) {
			if (queue.size() >= 4) {
				let finalizedEpoch: Epoch = queue.front()!;
				const confirmation: boolean = await confirm_finalization_of_epoch(finalizedEpoch);
				if (!confirmation) {
					log(`Epoch ${finalizedEpoch.epochNum}'s finalization status isn't confirmed`, logPath);
					continue;
				}
				else {
					// This will takes a long time to run, we can optimize it with multi-threading later
					log(`Epoch ${finalizedEpoch.epochNum}'s finalization status is confirmed!`, logPath);
					finalizedEpoch.finalized = true;
					finalizedEpoch = await get_blocks_of_epoch(finalizedEpoch);
					finalizedEpoch = await calculate_x_y_factors_of_epoch(finalizedEpoch);
					stats = await get_tx_fee_paid_and_balance_change_of_addresses_in_epoch(finalizedEpoch, stats);

					// Start calculating
					log("Start calculating consumption/emissions for individual addresses...", logPath);
					for (const [address, stat] of stats) {
						// This loop will be slow as well, we should optimize it later
						const individual__ethBalanceChange: number = parseFloat(ethers.formatEther(stat.ethBalanceChange));
                        console.log(individual__ethBalanceChange);
						const network__totalEthSupply: number = parseFloat(ethers.formatEther(finalizedEpoch.totalEthSupply!));
                        console.log(network__totalEthSupply);
						const weightedFactor1: number = finalizedEpoch.xFactor! * ((individual__ethBalanceChange > 0 ? individual__ethBalanceChange : 0) / network__totalEthSupply);
                        console.log(weightedFactor1);

						const individual__txFeePaidInEpoch: number = parseFloat(ethers.formatEther(stat.txFeePaidInEpoch));
                        console.log(individual__txFeePaidInEpoch);
						const network__totalTxFee: number = parseFloat(ethers.formatEther(finalizedEpoch.totalTxFee!));
                        console.log(network__totalTxFee);
						const weightedFactor2: number = finalizedEpoch.yFactor! * (individual__txFeePaidInEpoch / network__totalTxFee);
                        console.log(weightedFactor2)

						const proportion: number = weightedFactor1 + weightedFactor2;
                        console.log(proportion);
						const individualConsumption: number = finalizedEpoch.kWh! * proportion;
                        console.log(individualConsumption);
						const individualEmission: number = finalizedEpoch.kgCO2e! * proportion;
                        console.log(individualEmission);

						// Save results
						stat.kWh = individualConsumption;
						stat.kgCO2e = individualEmission;
					}
					log("Done!", logPath);
					queue.dequeue();
					break;
				}
			}
			else {
				// log("Not enough epochs in queue to determine the status of epochs! Waiting 1 block before trying again...", logPath);
				await new Promise<void>((resolve) => {
					ethers.provider.addListener("block", async (blockNumber: number | bigint) => {
						log(`New block created: ${blockNumber}`, logPath);
						await ethers.provider.removeAllListeners();
						resolve();
					});
				});
			}
		}
		// Finally
		return stats;
	} catch (err: unknown) {
		throw new Error(`estimate()^ Error: ${err}`);
	}
}

/**
 * 
 * @param addressList list of public keys/addresses to calculate energy consumption/carbon emisison for. *Note: all public keys should be lowercase
 */
export default async function main(addressList: string[])
    : Promise<void> {
	try {
		if (isMainThread) {
			// Estimate individual consumption and emissions for each entry in 'stats'.
			//Note: all keys of 'stats' map must be lowercase.
			addressList.forEach((address) => {
				stats.set(address, {
					ethBalanceChange: 0n,
					epochNum: 0n,
					address: address.toLowerCase(),
					txFeePaidInEpoch: 0n,
					kWh: 0,
					kgCO2e: 0,
					txMadeInEpoch: 0
				});
			});
			stats = await estimate();

			// Finally
			log("Printing Results...\n----------------------------------------------------------------", logPath);
			for (const [address, stat] of stats) {
				log(`Address: ${stat.address}`, logPath);
				log(`Tx made in epoch: ${stat.txMadeInEpoch}`, logPath);
				log(`Tx fee paid in epoch: ${ethers.formatEther(stat.txFeePaidInEpoch.toString())} (ETH)`, logPath);
				log(`Balance change in epoch: ${ethers.formatEther(stat.ethBalanceChange.toString())} (ETH)`, logPath);
				log(`consumption: ${stat.kWh} (kWh)`, logPath);
				log(`Emission: ${stat.kgCO2e} (kgCO2e)`, logPath);
				log("\n----------------------------------------------------------------", logPath);
			}
		}
		else { }

	} catch (err: unknown) {
		throw new Error(`main()^ Error: ${err}`);
	}
}

// Test
// const mocks: string[] = [
// 	// These are transaction senders
// 	"0x28c6c06298d514db089934071355e5743bf21d60",
// 	"0x56eddb7aa87536c09ccc2793473599fd21a8b17f",
// 	"0xae2fc483527b8ef99eb5d9b44875f005ba1fae13",
// 	"0x21a31ee1afc51d94c2efccaa2092ad1028285549",
// 	"0xe0deeccda3befa93aea667c2c13195ffdead01ab",
// 	"0x327fe6f58fd07672e2b53be25598a0e43f23dd1c",
// 	"0x276e6c50ddc7aa6e19e106b4f90bc8c99bddad73",
// 	"0x5f06750bbf23b655016b0ec2fb2d82a33ae714ae",
// 	"0x2f9a399c0d6234a3228e31483c61c4b509ef1cd3",
// 	"0x8b89d0f0db08d938e58f134c7776eb108be5ba15",
// 	"0x46340b20830761efd32832a74d7169b29feb9758",
// 	"0x046961948080b224a2ab6a9d52b25937e75bb9ea",
// 	"0x8ec8a01de404327923db6335a8e4b422524b6c92",
// 	"0x3570b3604ff4b48296a357bdad8e986c373c560f",
// 	"0xf06ebe3dc1ce76b7a320fcf402965d3eecd362a9",
// 	"0x4c5132a45ac21d9a6a31bd4bd68fdaf4eefe9291",
// 	"0xe6b7c477383428156f4e1afaaff72569ea04f5d6",
// 	"0x974caa59e49682cda0ad2bbe82983419a2ecc400",
// 	"0xea1c9b9799cf4ff42738f62a226da590354a3f1e",
// 	"0x8328b7cb149e949969ea8e4e65c1e71dc2e4e8b3",
// 	"0xb6f5160f76ad081c68ead03f2e59f007f42a7e78",

// 	// These are transaction receivers
// 	"0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
// 	"0xdf401bbc478093d6dc1688c949ec08f9356851c3",
// 	"0xb31c1fff14cbd7cfa3836b1663d2bb82727e6606",
// 	"0x8ab9cced71a92cd5ee11feac8d9f67017372c5ea",
// 	"0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
// 	"0x188a99ea8764aa1838ab11dc5ababd7706ddfdd0"
// ];

// Test
// main(mocks).catch((err: unknown) => {
//     console.log(err);
// })