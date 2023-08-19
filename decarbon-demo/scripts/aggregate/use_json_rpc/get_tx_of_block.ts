import { provider } from "./";
import { Block, exampleBlock } from "../../interfaces";
import fs from "fs";

/**
 * 
 * @notice This function gets all the transactions of '_blocks' and save them to '_block.txHashes' or '_block.txInfos
 * @param _block An object of type Block. See 'scripts/interfaces/Block.ts' for more details
 * @param txInfo If txInfo == true, returns a list of transaction objects(includes basic tx details), otherwise returns a list transaction hashes
 * @param write If write == true, save results to data/get_tx_receitps_of_block
 * @returns JSON objects that represent txReceipts(They have the following properties: from, to, value, input, ...)
*/
export default async function get_tx_of_block(_block: Block, txInfo: boolean = true, write: boolean = false)
    : Promise<Record<string, unknown>[] | string[]> {
	try {
		// If the block is either missed/orphaned, their transactions aren't executed so we can safely discard them
		if (_block.status == 2 || _block.status == 3) {
			return [];
		}

		else {
			const response: Record<string, unknown> = await provider.send(
				"eth_getBlockByHash",
				[_block.blockHash, txInfo]
			) as Record<string, unknown>;
			const transactions: Record<string, unknown>[] | string[]= response.transactions as Record<string, unknown>[] | string[];
			if (write) {
				fs.writeFileSync("data/get_tx_of_block.json", JSON.stringify(transactions));
			}

			// finally
			return transactions;
		}
	} catch (err) { 
		throw new Error(`get_tx_of_block()^: ${err}`);
	}
}

// Test
// get_tx_of_block(exampleBlock, true, true).then((transactions: any) => {
//     console.log(transactions);
// }).catch((err: unknown) => {
//     console.log(err);
// });