import axios, { AxiosResponse } from "axios";
import { Block, Epoch, exampleEpoch } from "../../interfaces";
import { url, apiKey } from ".";

/**
 * @notice This function collects info about blocks that are in an Ethereum epoch
 * @dev In Ethereum, 1 epoch = 32 slots, 1 slot = 12 secs. Meanwhile, Ethereum's block time is 12 secs. Therefore, every epoch, 32 new blocks is produced
 * @dev Each epoch, we only call this function once to aggregate the data of blocks in the most currently-finalized epoch. Then we pass that data as a parameter into other functions from other files in this use_beaconchain_apis_folder.
 * @returns the @param _epoch but with updated Epoch.blocks property
 */
export default async function get_blocks_of_epoch(_epoch: Epoch): Promise<Epoch> {
	try {
		console.log(`Getting blocks of epoch ${_epoch.epochNum}...`);
		// make http requests to get basic infos of blocks that are in '_epoch'
		const response: AxiosResponse = await axios.get(`${url}/epoch/${_epoch.epochNum}/slots?apiKey=${apiKey}`);
		const blocks: Block[] = [];
		response.data.data.forEach((block: Record<string, unknown>) => {
			if (block.exec_block_hash !== undefined) {
				blocks.push({
					// These are required properties
					epochNum: BigInt(block.epoch as number),
					blockNumber: BigInt(block.exec_block_number as number),
					proposerIndex: BigInt(block.proposer as number),
					blockHash: block.exec_block_hash as string,
					feeRecipient: block.exec_fee_recipient as string,
					status: block.status as number,
					// These are optional properties, so comment them out to save energy
					timestamp: BigInt(block.exec_timestamp as number),
					gasUsed: BigInt(block.exec_gas_used as number),
					baseFeePerGas: BigInt(block.exec_base_fee_per_gas as number),
				});
			}
		});
		console.log("Done!");
        
		// finally
		_epoch.blocks = blocks;
		return _epoch;

	} catch (err) {
		throw new Error("get_blocks_in_finalized_epoch()^ Error: " + err);
	}
}

// Test
// get_blocks_of_epoch(exampleEpoch).then((epoch: Epoch) => {
//     console.log(epoch);
// }).catch((err) => {
//     console.log(err);
// })