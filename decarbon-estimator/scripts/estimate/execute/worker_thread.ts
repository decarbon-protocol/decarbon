import axios, { AxiosResponse } from "axios";
import { url, apiKey } from "../../aggregate.old/use_beaconchain_apis";
import { parentPort } from "worker_threads";
import { ethers } from "ethers";
import { provider } from "../../aggregate.old/use_json_rpc";
import { Epoch } from "../../interfaces";
import { get_total_eth_supply_of_epoch } from "../../aggregate.old/use_etherscan_apis";
import { constants } from "../../01_constants";
import { get_avg_emissions_of_epoch } from "../../aggregate.old/use_ccri_apis";
import { clearLog, log, output } from "../../utils";
import fs from "fs";

const logPath: string = "data/logs/worker_thread.log";
clearLog(logPath);

/**
 * 
 * @notice This function is used when we want to wait for a certain block to get created before continuing the program
 * @param targetNumber Number of the block to wait for
 * @returns Promise<number> that resolves when current block num. == @param targetNumber
 */
async function waitForBlock(targetNumber: number)
    : Promise<number> {
    return new Promise<number>((resolve, reject) => {
        provider.addListener("block", (blockNumber: number) => {
            log(`New block created: ${blockNumber}`, logPath);
            if (blockNumber === targetNumber) {
                provider.removeAllListeners();
                resolve(blockNumber);
            }
            else if (blockNumber > targetNumber) {
                provider.removeAllListeners();
                reject(blockNumber);
            }
        });
    });
}

/**
 * @notice This function continually export 'Epoch' objects to the main thread via messagePort
 * @dev The 'Epoch' object exported is serialized, so when we receive it on the main thread, we'll have to de-serialize it
 */
async function continually_export_latest_epoch()
    : Promise<void> {
    try {
        while (true) {
            let blocksResponse: AxiosResponse;
            while (true) {
                try {
                    blocksResponse = await axios.get(`${url}/epoch/latest/slots?apiKey=${apiKey}`);
                    break;
                } catch(err) {
                    output(`Worker thread: cannot get info about the current epoch, (could be beaconchai.in server error): ${err}`);
                    await new Promise<void>(resolve => {
                        setTimeout(resolve, 4 * 1000);
                    });
                    output("Retrying until we can get some info about the latest epoch...");
                }
            }
            const blocks: Record<string, unknown>[] = blocksResponse!.data.data;
            if (blocks.length <= 0) {
                throw new Error("No blocks found in epoch");
            }

            // Init new Epoch object 
            const epochNumber: number = blocks[0].epoch as number;
            const epoch__firstBlockNumber: number = blocks[0].exec_block_number as number;
            const epoch__lastBlockNumber: number = epoch__firstBlockNumber + (constants.NUM_BLOCKS_IN_EPOCH - 1);
            const latestEpoch: Epoch = {
                epoch_number: epochNumber,
                finalized: false
            };
            log(`New epoch: ${epochNumber}`, logPath);
            log(`First block in epoch: ${epoch__firstBlockNumber}`, logPath);
            log(`Last block in epoch: ${epoch__lastBlockNumber}`, logPath);
            log("Waiting for epoch to finish...", logPath);
            await waitForBlock(epoch__lastBlockNumber)
                .then(async (blockNumber: number) => {
                    log("Epoch finished!", logPath);
                    log("Getting total eth supply and avg. consumption & emission of epoch...", logPath);
                    await Promise.all([
                        get_avg_emissions_of_epoch(latestEpoch),
                        get_total_eth_supply_of_epoch(latestEpoch)
                    ]);
                    log(`Done! Total Eth supply: ${latestEpoch.total_eth_supply}, Emission: ${latestEpoch.kgCO2e}`, logPath);
                    log("Exporting latest epoch to main thread...", logPath);
                    parentPort?.postMessage(latestEpoch);
                    const targetBlockNumber: number = blockNumber + Math.round(constants.NUM_BLOCKS_IN_EPOCH / 2);
                    log("Waiting for 1/2 blocks in next epoch to pass by before moving on...", logPath);
                    log(`Target block to wait for: ${targetBlockNumber}`, logPath);
                    await waitForBlock(targetBlockNumber);
                })
                .catch(async (blockNumber: number) => {
                    const targetBlockNumber: number = blockNumber + Math.round(constants.NUM_BLOCKS_IN_EPOCH / 4);
                    log("Beaconchai.in hasn't updated data for the latest epoch yet.", logPath);
                    log("Waiting for 1/4 blocks in next epoch to pass by before trying again...", logPath);
                    log(`Target block to wait for: ${targetBlockNumber}`, logPath);
                    await waitForBlock(targetBlockNumber);
                });
        }
    } catch (err: unknown) {
        throw new Error(`continually_export_latest_epoch): ${err}`);
    }
}

// Run function
continually_export_latest_epoch().catch((err: unknown) => {
    output(err);
});