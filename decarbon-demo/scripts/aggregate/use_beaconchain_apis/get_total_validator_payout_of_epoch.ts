import axios, { AxiosResponse} from "axios";
import { Epoch, exampleEpoch } from "../../interfaces";
import { url } from ".";


export default async function get_total_validator_payout_of_epoch(_epoch: Epoch)
: Promise<Epoch> {
	try {
		const epoch: bigint = _epoch.epochNum;
		const prevEpoch = epoch - 1n;
		let response: AxiosResponse = await axios.get(`${url}/epoch/${epoch}`);
		const epochData: Record<string, unknown> = response.data.data;
		const totalBalance: bigint = BigInt(epochData.totalvalidatorbalance as number);

		response = await axios.get(`${url}/epoch/${prevEpoch}`);
		const prevEpochData = response.data.data;
		const prevTotalBalance: bigint = BigInt(prevEpochData.totalvalidatorbalance);
		const totalPayout: bigint = (totalBalance - prevTotalBalance) * BigInt(1e9); // convert from Gwei to wei;

		// Finally
		_epoch.totalValidatorPayout = totalPayout;
		return _epoch;

	} catch (err: unknown) {
		throw new Error(`get_total_validator_payout_of_epoch()^ Error: ${err}`);
	}
}

// Test
// get_total_validator_payout_of_epoch(exampleEpoch).then((epoch: Epoch) => {
//     console.log(`Total validator payout of epoch ${epoch.epochNum} = ${epoch.totalValidatorPayout}`);
// }).catch((err: unknown) => {
//     console.log(err);
// })