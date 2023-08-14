import axios, { AxiosError, AxiosResponse } from "axios";
import { Validator, exampleValidator } from "../../interfaces";
import { url } from ".";

/**
 * 
 * @notice This function takes in a list of validators' index and return a list of 'Validator' objects
 * @param index Index of validator in beacon chain
 */
async function get_validators_from_validator_indices(_indices: bigint[]) {
	try {
		const validators: Validator[] = [];

		for (const _index of _indices) {
			const reqParams = {
				indicesOrPubkey: _index.toString()
			};
			const { data }: Record<string, any>  = await axios.post(`${url}/validator`, reqParams, {
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				}
			});
			const _validator = data.data;
			validators.push({
				// These 2 values are required
				index: _index,
				publicKey: _validator.pubkey,
				// These other values are optional, so comment them out to save energy
				balance: _validator.balance,
				effectiveBalance: _validator.effectivebalance,
				slashed: _validator.slashed,
				activationEligibilityEpoch: _validator.activationeligibilityepoch,
				activationEpoch: _validator.activationepoch,
				withdrawableEpoch: _validator.withdrawableepoch,
				exitEpoch: _validator.exitepoch,
				totalWithdrawals: _validator.total_withdrawals,
				status: _validator.status,
				withdrawalCredentials: _validator.withdrawalcredentials,
			});
		}

		// finally
		return validators;

	} catch (err: any) {
		throw new Error(`get_validators_from_indexes()^ Error: ${err}`);
	}
}

// Test
// get_validators_from_indices([exampleValidator.index, exampleValidator.index]).then((validators: Validator[]) => {
//     console.log(validators);
// }).catch((err: any) => {
//     console.log(err);
// });

export default get_validators_from_validator_indices;