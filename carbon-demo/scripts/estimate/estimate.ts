import { network_config } from "../00_network_config";
import { get_finalized_epoch } from "../aggregate/use_beaconchain_apis";
import { get_total_tx_fee_reward_of_epoch } from "../aggregate/use_etherscan_apis";
import { get_total_tx_fee_of_addresses_in_epoch } from "../aggregate/use_json_rpc";
import { get_total_validator_payout_of_epoch } from "../aggregate/use_beaconchain_apis";
import { ethers, network } from "hardhat";
import { Block, Factors, Epoch, IndividualEnergyStats, exampleFactors, exampleValidator } from "../interfaces";

/**
 * @notice This function invokes other sub-functions. It calculates the energy consumption of an Eth address in 1 epoch
 * @param _epoch object of type Epoch. See 'scripts/interfaces/Epoch.ts' for more details
 * @param _stats a map from public key to an object of type 'EnergyStat'. See 'scripts/interfaces/EnergyStat.ts" for more details. Note: all keys in map should be UPPERCASE
 * @param _factors object of type 'Factors'. See 'scripts/interfaces/Factors.ts' for more details
 * @returns 
 */
async function execute_estimation(_epoch: Epoch, _stats: Map<string, IndividualEnergyStats>, _factors: Factors)
:Promise<Map<string, IndividualEnergyStats>> {
	try {
        // Populate objects in '_stats' with txCountInEpoch, txFeePaidInEpoch
        _stats = await get_total_tx_fee_of_addresses_in_epoch(_epoch, _stats);

        // get 
        
	} catch (err) {
		throw new Error(`Error^ when running per_epoch(): ${err}`);
	}
}

// Test
execute_estimation([exampleValidator.publicKey], exampleFactors).then((stats: bigint[]) => {
    
}).catch((err) => {
	console.log(err);
});

export default execute_estimation;