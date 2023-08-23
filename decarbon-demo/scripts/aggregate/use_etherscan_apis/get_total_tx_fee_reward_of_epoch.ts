import axios, { AxiosResponse } from "axios";
import { Epoch, exampleEpoch } from "../../interfaces";
import { url, apiKey } from "./";

/**
 * 
 * @dev This function gets the sum of all tx fee of all transactions made in an epoch 
 * @param _epoch object of type 'Epoch'. See 'scripts/interfaces/Epoch.ts' for more details
 * @returns the @param _epoch but with updated property 'totalTxFee'
 */
export default async function get_total_tx_fee_reward_of_epoch(_epoch: Epoch)
: Promise<boolean> {
    try {
        let sum: bigint = 0n;
		if (_epoch.blocks === undefined || _epoch.blocks?.length == 0) {
            throw new Error(`Epoch ${_epoch.epoch_number} has 0 blocks`);
		}
		// make http request to get tx fee reward of blocks in '_epoch'
        const MAX_RETRY_ATTEMPTS = 5;
		for (const block of _epoch.blocks) {
            let rewardResponse: AxiosResponse;
            let retryCount = 0;
            while (retryCount <= MAX_RETRY_ATTEMPTS) {
                try {
                    rewardResponse = await axios.get(`${url}/?module=block&action=getblockreward&blockno=${block.number}&apikey=${apiKey}`);
                    break;
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        console.error(`\t\tServer error on attempt ${retryCount + 1}:`, err);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        retryCount++;
                    }
                }
            }
            if (retryCount > MAX_RETRY_ATTEMPTS) {
                console.error(`Failed to get block reward for block ${block.number} due to provider's server error`);
                return false;
            }
            else {
                const data = rewardResponse!.data;
                const txFee: bigint = BigInt(data.result.blockReward);
                sum += txFee;
            }
        }

		// If everything was successful, return true
		_epoch.total_tx_fee = sum;
		return true;
	} catch (err) {
		throw new Error(`get_total_tx_fee_reward_of_epoch(): ${err}`);
	}
}

// Test
// get_total_tx_fee_reward_of_epoch(exampleEpoch).then((success) => {
//     if (success) {
//         console.log(`Total txFee of epoch ${exampleEpoch.epoch_number} = ${exampleEpoch.total_tx_fee}`);
//     }
// }).catch((err) => {
// 	console.log(err);
// });