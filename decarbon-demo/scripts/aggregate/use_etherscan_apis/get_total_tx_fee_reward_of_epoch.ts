import axios, { AxiosError, AxiosResponse } from "axios";
import { Block, Epoch, exampleEpoch } from "../../interfaces";
import { url, apiKey } from ".";

/**
 * 
 * @dev This function is used to get the sum of all tx fee of every block we pass in
 * @param _epoch objects of type 'Block'. See 'scripts/interfaces/Block.ts' for more details
 * @returns the sum of all transaction fee of all the blocks. Basically, each block has its total tx fee, now we sum up total tx fee of all blocks.
 */
async function get_total_tx_fee_reward_of_epoch(_epoch: Epoch)
: Promise<bigint> {
	try {
		let sum: bigint = 0n;

		// make http request to get txn fee of the blocks in the parameters
		for (const block of _epoch.blocks) {
			const response = await axios.get(`${url}/?module=block&action=getblockreward&blockno=${block.blockNumber}&apikey=${apiKey}`,);
			const data = response.data;
			const txFee: bigint = BigInt(data.result.blockReward);
			sum += txFee;
		}

        // Finally
		return sum;

	} catch (err) {
		throw new Error(`Error^ related to get_txFee_of_epoch(): ${err}`);
	}
}

// Test
// get_total_tx_fee_reward_of_epoch(exampleEpoch).then((totalTxFee) => {
// 	console.log(`Total txFee of epoch ${exampleEpoch.epochNum} = ${totalTxFee}`);
// }).catch((err) => {
// 	console.log(err);
// });

export default get_total_tx_fee_reward_of_epoch;