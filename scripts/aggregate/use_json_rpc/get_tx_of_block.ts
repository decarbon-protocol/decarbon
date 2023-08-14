import { network } from "hardhat";
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
async function get_tx_of_block(_block: Block, txInfo: boolean = true, write: boolean = false)
: Promise<Record<string, any>[] | string[]> {
	try {
		const blockHash: string = _block.blockHash ?? "";
		if (blockHash == "") {
			throw new Error(`Invalid block hash: ${blockHash}`);
		}

		const response: Record<string, any> = await network.provider.request({
			method: "eth_getBlockByHash",
			params: [blockHash, txInfo]
		}) as Record<string, any>;

		const tx: Record<string, any>[] | string[] = response.transactions;

		if (write) {
			fs.writeFileSync("data/get_tx_of_blocks.json", JSON.stringify(tx));
		}

		// finally
		return tx;

	} catch (err) {
		throw new Error(`Error wehen when running get_tx_receipts_of_block(): ${err}`);
	}
}

// Test
// get_tx_of_block(exampleBlock, true, true).then((txReceipts: any) => {
//     console.log(txReceipts);
// }).catch((err: any) => {
//     console.log(err);
// });

export default get_tx_of_block;