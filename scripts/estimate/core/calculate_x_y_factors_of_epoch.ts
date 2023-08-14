import { ethers } from "hardhat";
import { Epoch, Factors, exampleEpoch } from "../../interfaces";
import { get_total_tx_fee_reward_of_epoch } from "../../aggregate/use_etherscan_apis";
import { get_total_validator_payout_of_epoch } from "../../aggregate/use_beaconchain_apis";

/**
 * @notice This function calculates the X and Y factor of the most recently finalized epoch
 * @param _epoch object of type 'Epoch'. See 'scripts/interfaces/Epoch' for more details
 */
async function calculate_x_y_factors_of_epoch(_epoch: Epoch)
: Promise<Factors> {
    try {
        // Getting total (sum of) tx fee reward in 'epoch'
        console.log(`Getting total tx fee of epoch ${_epoch.epochNum}...`);
        const totalTxFee: bigint = await get_total_tx_fee_reward_of_epoch(_epoch);
        console.log(`Done! total tx fee = ${totalTxFee} (wei)\n`);

        // Getting total (sum of) validator payout of 'epoch'
        console.log(`Getting total validator payout of epoch ${_epoch.epochNum}...`)
        const totalValidatorPayout: bigint = await get_total_validator_payout_of_epoch(_epoch) * BigInt(1e9); // convert from Gwei to wei
        console.log(`Done! Total validator payout = ${totalValidatorPayout} (wei)\n`);

        // Calculate Incentivization Factors
        console.log(`Estimating...`);
        if (totalTxFee >= totalValidatorPayout) {
            throw new Error(`Unexpected: total tx fee >= total validator payout (${totalTxFee >= totalValidatorPayout})`);
        }

        const dividend: number = parseFloat(ethers.formatEther(totalTxFee));
        const divisor: number = parseFloat(ethers.formatEther(totalValidatorPayout));
        const y: number = dividend / divisor;
        const x: number = 1 - y;
        const factors: Factors = {
            xFactor: x,
            yFactor: y
        }
        console.log("dividend: ", dividend);
        console.log("divisor: ", divisor);
        console.log(`Result: ${JSON.stringify(factors, null, 2)}`);
        
        // Finally
        return factors;

    } catch (err: any) {
        throw new Error(`calculate_x_y_factors()^ Error: ${err}`);
    }
}

// Test
// calculate_x_y_factors(exampleEpoch).then((factors) => {
//     console.log(factors);
// }).catch((err: any) => {
//     console.log(err);
// })

export default calculate_x_y_factors_of_epoch;