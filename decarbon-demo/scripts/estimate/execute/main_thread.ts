import axios, { AxiosResponse } from "axios";
import { url } from "../../aggregate/use_beaconchain_apis";
import { provider } from "../../aggregate/use_json_rpc/";
import { Queue } from "../../classes";
import { Epoch, exampleEpoch, Transaction, Account } from "../../interfaces";
import { calculate_emissions_of_transactions_in_epoch } from "../core";
import { fetch_accounts_from_db, insert_transactions, update_account_data } from "../../database";
import { Worker, isMainThread } from "worker_threads";
import { constants } from "../../01_constants";
import { clearLog, log } from "../../utils";
import insert_blocks from "../../database/insert_blocks";

/**
 * @notice set the path of log file and clear the log file
 */
const logPath: string = "data/logs/main_thread.log";
clearLog(logPath);

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
                let oldestEpoch: Epoch = queue.front()!;
                const confirmed: boolean = await confirm_finalization_of_epoch(oldestEpoch);
                if (!confirmed) {
                    log(`Epoch ${oldestEpoch.epoch_number}'s finalization status isn't confirmed`, logPath);
                    continue;
                }
                else {
                    log(`Epoch ${oldestEpoch.epoch_number}'s finalization status is confirmed!`, logPath);
                    console.log(`Processing epoch ${oldestEpoch.epoch_number}...\n`);
                    oldestEpoch.finalized = true;
                    queue.dequeue();

                    // If we cannot fetch accounts from database, skip the epoch
                    let success: boolean = await fetch_accounts_from_db(addressToAccount);
                    if (!success) {
                        log(`Failed to fetch accounts from database, skipping epoch ${oldestEpoch.epoch_number}`, logPath);
                        continue;
                    }

                    success = await calculate_emissions_of_transactions_in_epoch(oldestEpoch, transactionList, addressToAccount);
                    if (!success) {
                        // If unfortunately the provider's server is down, we have to skip thsi epoch
                        log(`Due to server error, skipping epoch ${oldestEpoch.epoch_number}...`, logPath);
                        continue;
                    }

                    // If the calculation was successful, we save results to the database
                    success = await update_account_data(addressToAccount);
                    if (!success) {
                        log(`Failed to update transactions to database, skipping epoch ${oldestEpoch.epoch_number}`, logPath);
                        continue;
                    }

                    success = await insert_blocks(oldestEpoch.blocks!);
                    if (!success) {
                        log(`Failed to insert new blocks into database, skipping epoch ${oldestEpoch.epoch_number}`, logPath)
                        log(`Reverting changes done to db`, logPath);
                        // Revert account changes above

                        continue;
                    }

                    success = await insert_transactions(transactionList);
                    if (!success) {
                        log(`Failed to insert new transactions into database, skipping epoch ${oldestEpoch.epoch_number}`, logPath);
                        log(`Reverting changes done to db`, logPath);
                        // Revert new blocks added above

                        continue;
                    }
                }
            }
            else {
                // log("Not enough epochs in queue to determine the status of epochs! Waiting 1 block before trying again...", logPath);
                await new Promise<void>((resolve) => {
                    provider.addListener("block", (blockNumber: number) => {
                        // log(`New block created: ${blockNumber}`, logPath);
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
        console.log(`Finished processing epoch\n`);
    }
}

// Execute main thread
if (isMainThread) {
    console.log("Estimator has been started\nSay hi to Estimator, ヾ(＠⌒ー⌒＠)ノ, its job is to continually\n\taggregate Ethereum data every 6.4 minutes\n\t\tand calculate the carbon emissions of each transactions in that time period,\n\t\t\tthen finally save the calculation results to database\n\t\t\t\tand repeat |^^| ");
    console.log("To see its internal log, take a look at these files:\n\t'data/logs/main_thread.log'\n\t'data/logs/worker_thread.log'");
    console.log("To see the calculation results (if finished calculating), check this file:\n\t'data/logs/transactionList.json'");
    console.log("================================\n");
    main()
        .then(() => { })
        .catch(err => console.error(err))
}