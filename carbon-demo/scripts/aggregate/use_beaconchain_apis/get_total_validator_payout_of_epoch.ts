import axios, { AxiosError, AxiosResponse} from "axios";
import { Epoch, exampleEpoch } from "../../interfaces";
import { url } from ".";


async function get_total_validator_payout_of_epoch(_epoch: Epoch)
: Promise<bigint> {
    try {
        const epoch: bigint = _epoch.epochNum;
        const prevEpoch = epoch - 1n;
        let response: AxiosResponse = await axios.get(`${url}/epoch/${epoch}`);
        const epochData: Record<string, any> = response.data.data;
        const totalBalance: bigint = BigInt(epochData.totalvalidatorbalance);

        response = await axios.get(`${url}/epoch/${prevEpoch}`);
        const prevEpochData = response.data.data;
        const prevTotalBalance: bigint = BigInt(prevEpochData.totalvalidatorbalance);
        const totalPayout: bigint = totalBalance - prevTotalBalance;

        // Finally
        return totalPayout;

    } catch (err: any) {
        throw new Error(`get_total_validator_payout_of_epoch()^ Error: ${err}`)
    }
}

// Test
// get_total_validator_payout_of_epoch(exampleEpoch).then((totalPayout: bigint) => {
//     const epoch: bigint = exampleEpoch.epochNum;
//     console.log(`Total validator payout of epoch ${epoch} = ${totalPayout}`);
// }).catch((err: any) => {
//     console.log(err);
// })

export default get_total_validator_payout_of_epoch;