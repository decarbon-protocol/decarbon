import axios, { AxiosError, AxiosResponse } from "axios";
import { Block, Epoch, exampleEpoch } from "../../interfaces";
import { url, apiKey } from ".";
import { provider } from "../use_json_rpc";
import { log } from "../../utils";
import { constants } from "../../01_constants";

/**
 * @notice This function collects info about blocks that are in an Ethereum epoch
 * @dev In Ethereum, 1 epoch = 32 slots, 1 slot = 12 secs. Meanwhile, Ethereum's block time is 12 secs. Therefore, every epoch, 32 new blocks is produced
 * @dev Each epoch, we only call this function once to aggregate the data of blocks in the most currently-finalized epoch. Then we pass that data as a parameter into other functions from other files in this use_beaconchain_apis_folder.
 * @returns the @param _epoch but with updated Epoch.blocks property
 */
export default async function get_blocks_of_epoch(_epoch: Epoch)
: Promise<boolean> {
    const MAX_RETRY_ATTEMPTS = constants.NUM_BLOCKS_IN_EPOCH - 1; // Maximum number of retry attempts
    let retryCount = 0;

    while (retryCount <= MAX_RETRY_ATTEMPTS) {
        try {
            console.log(`\tGetting blocks of epoch ${_epoch.epoch_number}...`);
            const response: AxiosResponse = await axios.get(`${url}/epoch/${_epoch.epoch_number}/slots?apiKey=${apiKey}`);
            const blocks: Block[] = [];
            for (const block of response.data.data) {
                const blockStatus: number = Number(block.status as string);
                if (blockStatus !== 2 && blockStatus !== 3) {
                    blocks.push({
                        epoch_number: block.epoch as number,
                        number: block.exec_block_number as number,
                        proposer_index: block.proposer as number,
                        hash: block.exec_block_hash as string,
                        fee_recipient: block.exec_fee_recipient as string,
                        timestamp: block.exec_timestamp as number,
                        gas_used: BigInt(block.exec_gas_used as number),
                        gas_limit: BigInt(block.exec_gas_limit as number),
                        parent_hash: block.exec_parent_hash as string,
                        state_root: block.exec_state_root as string,
                        logs_bloom: block.exec_logs_bloom as string,
                        transaction_count: block.exec_transactions_count as number,
                        status: blockStatus,
                    });
                }
            }

            _epoch.blocks = blocks;
            console.log("\tDone!\n");
            return true;

        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.error(`\t\tServer error on attempt ${retryCount + 1}:`, err);
                // Wait for 1 block before retrying
                await new Promise<void>(resolve => {
                    setTimeout(resolve, 12 * 1000);
                });
                retryCount++;
                console.log('\t\tRetrying...');
            }
            else {
                throw new Error(`get_blocks_of_epoch(): ${err}`);
            }
        }
    }
    // If exceed maximum retry attempts
    console.error("\nMaximum retry attempts exceeded.");
    return false;
}

// Test
// get_blocks_of_epoch(exampleEpoch)
//     .then((success) => {
//         if (success) {
//             console.log(exampleEpoch.blocks);
//         }
//         else {
//             console.log("Could be server error");
//         }
//     })
//     .catch((err) => {
//         console.log(err);
//     })
