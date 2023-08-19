import { ethers } from "ethers";
import { Epoch, exampleEpoch } from "../../interfaces";
import { get_total_tx_fee_reward_of_epoch } from "../../aggregate/use_etherscan_apis";
import { get_total_validator_payout_of_epoch } from "../../aggregate/use_beaconchain_apis";

/**
 * @notice This function calculates the X and Y factor of an epoch
 * @param _epoch object of type 'Epoch'. See 'scripts/interfaces/Epoch' for more details
 * @returns the @param _epoch but with updated xFactor and yFactor values
 */
export default async function calculate_x_y_factors_of_epoch(_epoch: Epoch)
    : Promise<Epoch> {
    try {
        console.log(`Calculating x, y factors of epoch ${_epoch.epochNum}...`);

        // Getting total (sum of) tx fee reward in 'epoch'
        console.log(`->Getting total tx fee of epoch ${_epoch.epochNum}...`);
        _epoch = await get_total_tx_fee_reward_of_epoch(_epoch);
        const totalTxFee: bigint = _epoch.totalTxFee ?? 0n;
        if (totalTxFee === 0n) {
            throw new Error(`Total tx fee of epoch ${_epoch.epochNum} = 0`);
        }
        console.log(`->Done! total tx fee = ${totalTxFee} (wei)\n`);

        // Getting total (sum of) validator payout of 'epoch'
        console.log(`->Getting total validator payout of epoch ${_epoch.epochNum}...`);
        _epoch = await get_total_validator_payout_of_epoch(_epoch);
        const totalValidatorPayout: bigint = _epoch.totalValidatorPayout!;
        if (totalValidatorPayout === 0n) {
            throw new Error(`Total validator payout of epoch ${_epoch.epochNum} = 0`);
        }
        console.log(`->Done! Total validator of epch payout = ${totalValidatorPayout} (wei)\n`);

        // Calculate Incentivization Factors
        if (totalTxFee >= totalValidatorPayout) {
            throw new Error(`Unexpected: total tx fee >= total validator payout (${totalTxFee >= totalValidatorPayout})`);
        }

        const dividend: number = parseFloat(ethers.utils.formatEther(totalTxFee));
        const divisor: number = parseFloat(ethers.utils.formatEther(totalValidatorPayout));
        const y: number = dividend / divisor;
        const x: number = 1 - y;
        _epoch.xFactor = x;
        _epoch.yFactor = y;
        console.log("dividend: ", dividend);
        console.log("divisor: ", divisor);
        console.log(`Done! Result = {X: ${_epoch.xFactor}, Y: ${_epoch.yFactor}}`);

        // Finally
        return _epoch;
    } catch (err: unknown) {
        throw new Error(`calculate_x_y_factors()^ Error: ${err}`);
    }
}

// Test
// calculate_x_y_factors_of_epoch(exampleEpoch).then((epoch: Epoch) => {
// 	console.log(`Epoch ${epoch.epochNum}: { X = ${epoch.xFactor}, Y = ${epoch.yFactor}}`);
// }).catch((err: unknown) => {
// 	console.log(err);
// });