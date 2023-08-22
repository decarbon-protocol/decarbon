import axios, { AxiosResponse } from "axios";
import { url } from "../../aggregate/use_beaconchain_apis";
import { provider } from "../../aggregate/use_json_rpc/";
import { Queue } from "../../classes";
import { Epoch, exampleEpoch, Transaction, Account } from "../../interfaces";
import { calculate_emissions_of_transactions_in_epoch } from "../core";
import { setup_account_map } from "../core"
import { dim_account, dim_transaction } from "../../aggregate/database/";
import { Worker, isMainThread } from "worker_threads";
import { constants } from "../../01_constants";
import { log } from "../../utils";
import fs from "fs";

/**
 * @notice set the path of log file and clear the log file
 */
const logPath: string = "data/logs/main_thread.ts.log";
fs.writeFileSync(logPath, '');

/**
 * @notice These are the 4 crucial global variables for the main thread to run
 * queue: a queue of epochs pending to be finalized
 * worker: a worker thread that runs parallely along this main thread (its duty is to fetch the total Eth supply, avg. network consumption and emissions every of the newest epoch everytime it is created)
 * addressToAccount: a mapping from address to 'Account' object. See 'scripts/interfaces/Account.ts' for more details
 * transactionList: an array of that will be populated with Transaction objects as results from our calculation process. See 'scripts/interfaces/Transaction.ts' for more details
 */
const queue: Queue<Epoch> = new Queue<Epoch>();
const worker: Worker = new Worker("./build/estimate/execute/worker_thread.js");
let addressToAccount: Map<string, Account> = new Map<string, Account>();
let transactionList: Transaction[] = [];

/**
 * 
 * @notice This function checks if an epoch is finalized
 * @returns true if '_epoch' if finalized, false otherwise.
 */
async function confirm_finalization_of_epoch(_epoch: Epoch)
    : Promise<boolean> {
	const epochResponse: AxiosResponse = await axios.get(`${url}/epoch/${_epoch.epoch_number}`);
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
		const epoch: Epoch = { epoch_number: -1 };
		epoch.epoch_number = serializedEpoch.epoch_number as number;
		epoch.finalized = serializedEpoch.finalized as boolean;
        epoch.total_eth_supply = serializedEpoch.total_eth_supply as bigint;
        epoch.kgCO2e = serializedEpoch.kgCO2e as number;
        // epoch.kWh = serializedEpoch.kWh as number;
		return epoch;
	} catch (err: unknown) {
		throw new Error(`deserializeEpoch()^ Error: ${err}`);
	}
}

/**
 * @notice Setup listener to handle new epoch data sent from the worker thread
 */
worker.on("message", (serializedEpoch: Record<string, unknown>) => {
	queue.enqueue(deserializeEpoch(serializedEpoch));
	log(`Received epoch ${queue.front()?.epoch_number} from worker thread!`, logPath);
	log(`Front of queue: ${queue.front()?.epoch_number}`, logPath);
	log(`Back of queue: ${queue.back()?.epoch_number}`, logPath);
	log(`Length of queue: ${queue.size()}`, logPath);
	log(queue.size() < 4 ? `Good news: ${(4 - queue.size()) * constants.NUM_MINUTES_IN_EPOCH} minutes left until epoch ${queue.front()?.epoch_number} finalizes (〃￣︶￣)人(￣︶￣〃)` : "", logPath);
});

export default async function main()
    : Promise<void> {
	try {
		while (true) {
			if (queue.size() >= 4) {
                console.log("what the fuck");
				let finalizedEpoch: Epoch = queue.front()!;
				const confirmed: boolean = await confirm_finalization_of_epoch(finalizedEpoch);
				if (!confirmed) {
					log(`Epoch ${finalizedEpoch.epoch_number}'s finalization status isn't confirmed`, logPath);
					continue;
				}
				else {
                    log(`Epoch ${finalizedEpoch.epoch_number}'s finalization status is confirmed!`, logPath);
                    finalizedEpoch.finalized = true;
                    queue.dequeue();

                    // If we cannot fetch accounts from database, skip the epoch
                    let success: boolean = await setup_account_map(addressToAccount);
                    if (!success) {
                        console.log(`Failed to fetch accounts from database, skipping epoch ${finalizedEpoch.epoch_number}`);
                        continue;
                    }

                    success = await calculate_emissions_of_transactions_in_epoch(finalizedEpoch, transactionList, addressToAccount);
                    if (!success) {
                        // If unfortunately the provider's server is down, we have to skip thsi epoch
                        console.log(`Due to server error, skipping epoch ${finalizedEpoch.epoch_number}...`);
                        continue; 
                    }


                    else {
                        // If the calculation was successful, we save result to the database
                        await dim_account.updateAccounts(addressToAccount);
                    }
				}
			}
			else {
				// log("Not enough epochs in queue to determine the status of epochs! Waiting 1 block before trying again...", logPath);
				await new Promise<void>((resolve) => {
					provider.addListener("block", (blockNumber: number) => {
						// log(`New block created: ${blockNumber}`, logPath);
						provider.removeListener("block", () => {console.log("removed")});
						resolve();
					});
				});
			}
		}
	} catch (err) {
		throw new Error(`main(): ${err}`);
	}
    finally {
        provider.removeAllListeners("block");
    }
}

// Test
if (isMainThread) {
    main()
    .then(() => {})
    .catch(err => console.log(err))
}