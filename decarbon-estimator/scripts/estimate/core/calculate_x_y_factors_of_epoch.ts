import { ethers } from "ethers";
import { Epoch, exampleEpoch } from "../../interfaces";
import { get_total_tx_fee_reward_of_epoch } from "../../aggregate.old/use_etherscan_apis";
import { get_total_validator_payout_of_epoch } from "../../aggregate.old/use_beaconchain_apis";
import { log, output } from "../../utils";


/**
 * @notice This function calculates the X and Y factor of an epoch
 * @param _epoch object of type 'Epoch'. See 'scripts/interfaces/Epoch' for more details
 * @returns the @param _epoch but with updated xFactor and yFactor values
 */
export default async function calculate_x_y_factors_of_epoch(_epoch: Epoch)
    : Promise<boolean> {
    try {
        // console.log(`\tCalculating x, y factors of epoch ${_epoch.epoch_number}...\n`);
        output(`\tCalculating x, y factors of epoch ${_epoch.epoch_number}...\n`);

        // Getting total (sum of) tx fee reward in 'epoch'
        // console.log(`\t\tGetting total tx fee of epoch ${_epoch.epoch_number}...`);
        output(`\t\tGetting total tx fee of epoch ${_epoch.epoch_number}...`);
        let success: boolean = await get_total_tx_fee_reward_of_epoch(_epoch);
        if (!success) {
            return false;
        }
        const totalTxFee: bigint = _epoch.total_tx_fee ?? 0n;
        if (totalTxFee === 0n) {
            throw new Error(`Total tx fee of epoch ${_epoch.epoch_number} = 0`);
        }
        // console.log(`\t\tDone! total tx fee = ${totalTxFee} (wei)\n`);
        output(`\t\tDone! total tx fee = ${totalTxFee} (wei)\n`);

        // Getting total (sum of) validator payout of 'epoch'
        // console.log(`\t\tGetting total validator payout of epoch ${_epoch.epoch_number}...`);
        output(`\t\tGetting total validator payout of epoch ${_epoch.epoch_number}...`);
        success = await get_total_validator_payout_of_epoch(_epoch);
        if (!success) {
            return false;
        }
        const totalValidatorPayout: bigint = _epoch.total_validator_payout!;
        if (totalValidatorPayout <= 0n) {
            // console.error(`Total validator payout of epoch ${_epoch.epoch_number} = 0`);
            output(`\t\tTotal validator payout of epoch ${_epoch.epoch_number} = 0`);
            return false;
        }
        // console.log(`\t\tDone! Total validator payout = ${totalValidatorPayout} (wei)\n`);
        output(`\t\tDone! Total validator payout = ${totalValidatorPayout} (wei)\n`);

        if (totalTxFee >= totalValidatorPayout) {
            // console.error(`Total tx fee >= total validator payout (${totalTxFee >= totalValidatorPayout})`);
            output(`\t\tTotal tx fee >= total validator payout (${totalTxFee >= totalValidatorPayout})`);
            return false;
        }

        const dividend: number = parseFloat(ethers.utils.formatEther(totalTxFee));
        const divisor: number = parseFloat(ethers.utils.formatEther(totalValidatorPayout));
        const y: number = dividend / divisor;
        const x: number = 1 - y;
        _epoch.xFactor = x;
        _epoch.yFactor = y;
        // console.log("\tdividend: ", dividend);
        // console.log("\tdivisor: ", divisor);
        // console.log(`\tDone! Result = {x factor: ${_epoch.xFactor}, y factor: ${_epoch.yFactor}}\n`);
        output(`\tdividend: ${dividend}`, );
        output(`\tdivisor: ${divisor}`);
        output(`\tDone! Result = {x factor: ${_epoch.xFactor}, y factor: ${_epoch.yFactor}}\n`);

        // If everything was successful, return true
        return true;
    } catch (err) {
        throw new Error(`calculate_x_y_factors()^ Error: ${err}`);
    }
}

// Test
// calculate_x_y_factors_of_epoch(exampleEpoch).then((epoch: Epoch) => {
// 	console.log(`Epoch ${epoch.epochNum}: { X = ${epoch.xFactor}, Y = ${epoch.yFactor}}`);
// }).catch((err: unknown) => {
// 	console.log(err);
// });