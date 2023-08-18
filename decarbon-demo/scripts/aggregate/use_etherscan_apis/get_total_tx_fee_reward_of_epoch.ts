import axios, { AxiosResponse } from "axios";
import { Epoch, exampleEpoch } from "../../interfaces";
import { url, apiKey } from "./";

/**
 * 
 * @dev This function gets the sum of all tx fee of all transactions made in an epoch 
 * @param _epoch object of type 'Epoch'. See 'scripts/interfaces/Epoch.ts' for more details
 * @returns the @param _epoch but with updated property 'totalTxFee'
 */
export default async function get_total_tx_fee_reward_of_epoch(_epoch: Epoch): Promise<Epoch> {
	try {
		let sum: bigint = 0n;
		if (_epoch.blocks === undefined || _epoch.blocks?.length == 0) {
			throw new Error(`Epoch ${_epoch.epochNum} has 0 blocks`);
		}
		// make http request to get tx fee reward of blocks in '_epoch'
		for (const block of _epoch.blocks) {
			const rewardResponse: AxiosResponse = await axios.get(`${url}/?module=block&action=getblockreward&blockno=${block.blockNumber}&apikey=${apiKey}`,);
			const data = rewardResponse.data;
			const txFee: bigint = BigInt(data.result.blockReward);
			sum += txFee;
		}

		// Finally
		_epoch.totalTxFee = sum;
		return _epoch;
	} catch (err: unknown) {
		throw new Error(`Error^ related to get_txFee_of_epoch(): ${err}`);
	}
}

// Test
// get_total_tx_fee_reward_of_epoch(exampleEpoch).then((epoch: Epoch) => {
// 	console.log(`Total txFee of epoch ${epoch.epochNum} = ${epoch.totalTxFee}`);
// }).catch((err: unknown) => {
// 	console.log(err);
// });