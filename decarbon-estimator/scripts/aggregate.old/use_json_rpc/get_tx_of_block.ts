import { provider } from ".";
import { Block, exampleBlock } from "../../interfaces";
import fs from "fs";
import axios from "axios";
import { output } from "../../utils";

/**
 * 
 * @notice This function gets all the transactions of '_blocks' and save them to '_block.txHashes' or '_block.txInfos
 * @param _block An object of type Block. See 'scripts/interfaces/Block.ts' for more details
 * @param txResponse If txInfo == true, returns a list of transaction objects(includes basic tx details), otherwise returns a list transaction hashes
 * @param write If write == true, save results to data/get_tx_receitps_of_block
 * @returns JSON objects that represent txReceipts(They have the following properties: from, to, value, input, ...)
*/
export default async function get_tx_of_block(_block: Block, txResponse: boolean = true, write: boolean = false)
    : Promise<boolean> {
    // If the block is either missed/orphaned, their transactions aren't executed so we can safely discard them
    if (_block.status !== 1) {
        return false;
    }

    let retryCount = 0;
    const MAX_RETRY_ATTEMPTS = 5;
    while (retryCount <= MAX_RETRY_ATTEMPTS) {
        try {
            const response: Record<string, unknown> = await provider.send(
                "eth_getBlockByHash",
                [_block.hash, txResponse]
            ) as Record<string, unknown>;
            const transactions: Record<string, unknown>[] | string[] = response.transactions as Record<string, unknown>[] | string[];
            if (write) {
                fs.writeFileSync("data/get_tx_of_block.json", JSON.stringify(transactions));
            }

            if (txResponse) {
                _block.tx_responses = transactions as Record<string, any>[];
            } else {
                _block.tx_hashes = transactions as string[];
            }

            // If everthing was successful, return true
            return true;

        } catch (err) {
            if (axios.isAxiosError(err)) {
                // console.error(`\t\tServer error on attempt ${retryCount + 1}`);
                output(`\t\tServer error on attempt ${retryCount + 1}`);
                await new Promise(resolve => {
                    setTimeout(resolve, 5000 * 1000);
                })
                retryCount++;
                // console.log("Retrying...");
                output("Retrying...");
            }
            else {
                throw new Error(`get_tx_of_block()^: ${err}`);
            }
        }
    }
    // If exceed maximum retry attempt allowed, return false
    // console.error("\nMaximum retry attempts exceeded.");
    output("\nMaximum retry attempts exceeded.");
    return false;
}

// Test
// get_tx_of_block(exampleBlock, false, true).then((success) => {
//     if (success) {
//         console.log(exampleBlock.tx_hashes);
//     }
// }).catch((err) => {
//     console.log(err);
// });