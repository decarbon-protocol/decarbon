import axios, { AxiosResponse } from "axios";
import { url, apiKey } from "../../aggregate/use_beaconchain_apis";
import { parentPort } from "worker_threads";
import { ethers } from "hardhat";
import { Epoch } from "../../interfaces";
import { get_total_eth_supply_of_epoch } from "../../aggregate/use_etherscan_apis";
import { get_avg_consumption_and_emission_of_epoch } from "../../aggregate/use_ccri_apis";
import { constants } from "../../01_constants";
import { log } from "../../utils";
import fs from "fs";

const logPath: string = "data/logs/worker_thread.ts.log";
fs.writeFileSync(logPath, "");

/**
 * 
 * @notice This function is used when we want to wait for a certain block to get created before continuing the program
 * @param targetNumber Number of the block to wait for
 * @returns Promise<bigint> that resolves when current block num. == @param targetNumber
 */
async function waitForBlock(targetNumber: bigint)
    : Promise<bigint> {
    return new Promise<bigint>((resolve, reject) => {
        ethers.provider.addListener("block", async (blockNumber: number | bigint) => {
            log(`New block created: ${blockNumber}`, logPath);
            blockNumber = BigInt(blockNumber);
            if (blockNumber === targetNumber) {
                await ethers.provider.removeAllListeners();
                resolve(blockNumber);
            }
            else if (blockNumber > targetNumber) {
                await ethers.provider.removeAllListeners();
                reject(blockNumber);
            }
        });
    });
}

/**
 * @notice This function continually export 'Epoch' objects to the main thread via messagePort
 * @dev The 'Epoch' object exported is serialized, so when we receive it on the main thread, we'll have to de-serialize it
 */
async function export_latest_epoch()
    : Promise<void> {
    try {
        while (true) {
            const blocksResponse: AxiosResponse = await axios.get(
                `${url}/epoch/latest/slots?apiKey=${apiKey}`
            );

            const blocks: Record<string, unknown>[] = blocksResponse.data.data;
            if (blocks.length <= 0) {
                throw new Error("No blocks found in epoch");
            }

            // Init new Epoch object 
            const epochNumber: bigint = BigInt(blocks[0].epoch as string);
            const firstBlockNumber: bigint = BigInt(blocks[0].exec_block_number as string);
            const lastBlockNumber: bigint = firstBlockNumber + 31n;
            const latestEpoch: Epoch = {
                epochNum: epochNumber,
                finalized: false
            };
            log(`Epoch number: ${epochNumber}`, logPath);
            log(`First block in epoch: ${firstBlockNumber}`, logPath);
            log(`Last block in epoch: ${lastBlockNumber}`, logPath);
            log("Waiting for epoch to finish...", logPath);
            await waitForBlock(lastBlockNumber)
                .then(async (blockNumber: bigint) => {
                    log("Epoch finished!", logPath);
                    log("Getting total eth supply and avg. consumption & emission of epoch...", logPath);
                    await Promise.all([
                        get_avg_consumption_and_emission_of_epoch(latestEpoch),
                        get_total_eth_supply_of_epoch(latestEpoch)
                    ]);
                    log(`Done! Total Eth supply: ${latestEpoch.totalEthSupply}, Consumption: ${latestEpoch.kWh}, Emission: ${latestEpoch.kgCO2e}`, logPath);
                    log("Exporting latest epoch to main thread...", logPath);
                    parentPort?.postMessage(latestEpoch);
                    const targetBlockNumber: bigint = blockNumber + BigInt(Math.round(constants.NUM_BLOCKS_IN_EPOCH / 2));
                    log("Waiting for 1/2 blocks in next epoch to pass by before moving on...", logPath);
                    log(`Target block to wait for: ${targetBlockNumber}`, logPath);
                    await waitForBlock(targetBlockNumber);
                })
                .catch(async (blockNumber: bigint) => {
                    const targetBlockNumber: bigint = blockNumber + BigInt(Math.round(constants.NUM_BLOCKS_IN_EPOCH / 4));
                    log("Beaconchai.in hasn't updated data for the latest epoch yet.", logPath);
                    log("Waiting for 1/4 blocks in next epoch to pass by before trying again...", logPath);
                    log(`Target block to wait for: ${targetBlockNumber}`, logPath);
                    await waitForBlock(targetBlockNumber);
                });
        }
    } catch (err: unknown) {
        throw new Error(`add_new_epoch_to_queue()^ Error: ${err}`);
    }
}

// Run function
export_latest_epoch().catch((err: unknown) => {
    console.log(err);
});