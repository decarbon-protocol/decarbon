import axios, { AxiosResponse } from "axios";
import { Epoch, exampleEpoch } from "../../../types/blockchain";
import { url } from ".";
import { constants } from "../../01_constants";
import { output } from "../../utils";

export default async function get_total_validator_payout_of_epoch(_epoch: Epoch)
    : Promise<boolean> {
    let retryCount = 0;
    const MAX_RETRY_ATTEMPTS = constants.NUM_BLOCKS_IN_EPOCH - 1;
    while (retryCount < MAX_RETRY_ATTEMPTS) {
        try {
            const epochNumber: number = _epoch.epoch_number;
            const prevEpochNumber = epochNumber - 1;
            let response: AxiosResponse = await axios.get(`${url}/epoch/${epochNumber}`);
            const epochData: Record<string, unknown> = response.data.data;
            const totalBalance: bigint = BigInt(epochData.totalvalidatorbalance as number);

            response = await axios.get(`${url}/epoch/${prevEpochNumber}`);
            const prevEpochData = response.data.data;
            const prevTotalBalance: bigint = BigInt(prevEpochData.totalvalidatorbalance as number);
            const totalPayout: bigint = (totalBalance - prevTotalBalance) * BigInt(1e9); // convert from Gwei to wei;

            // If successful, return true
            _epoch.total_validator_payout = totalPayout;
            return true;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // console.error(`\t\tServer error on attempt ${retryCount + 1}: `, err);
                output(`\t\tServer error on attempt ${retryCount + 1}: ${err}`);
                await new Promise(resolve => {
                    setTimeout(resolve, 12 * 1000);
                })
                retryCount++;
                // console.log('\t\tRetrying...');
                output('\t\tRetrying...');
            }
            else {
                throw new Error(`get_total_validator_payout_of_epoch(): ${err}`);
            }
        }
    }
    // console.error("\t\tMaximum retry attempts exceeded.");
    output("\t\tMaximum retry attempts exceeded.");
    return false;
}

// Test
// get_total_validator_payout_of_epoch(exampleEpoch).then((success) => {
//     if (success) {
//         console.log(`Total validator payout of epoch ${exampleEpoch.epoch_number} = ${exampleEpoch.total_validator_payout}`);
//     }
// }).catch((err: unknown) => {
//     console.log(err);
// })