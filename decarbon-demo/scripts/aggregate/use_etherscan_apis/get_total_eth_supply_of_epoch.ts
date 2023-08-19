import axios, { AxiosResponse } from "axios";
import { Epoch, exampleEpoch } from "../../interfaces";
import { url, apiKey } from "./";
import { log } from "../../utils";

const logPath: string = "data/logs/get_total_eth_supply.ts.log";
/** 
 * @notice This function gets the total Eth supply (total amount in circulation + total Eth2 staking rewards - total EIP1559 burnt fees )
 * @param _epoch Object of type 'Epoch'. See 'scripts/interfaces/Epoch.ts' for more details
 * @returns the @param _epoch with updated totalEthSupply property
 */
export default async function get_total_eth_supply_of_epoch(_epoch: Epoch): Promise<Epoch> {
	try {
		const supplyResponse: AxiosResponse = await axios.get(
			`${url}/?module=stats&action=ethsupply2&apikey=${apiKey}`
		);
		const supplyResult: Record<string, unknown> = supplyResponse.data.result;
		const totalEthSupply: bigint = BigInt(supplyResult.EthSupply as number) + BigInt(supplyResult.Eth2Staking as number) - BigInt(supplyResult.BurntFees as number);
		// log(totalEthSupply, logPath);
        
		// Finally
		_epoch.totalEthSupply = totalEthSupply;
		return _epoch;
	} catch (err: unknown) {
		throw new Error(`get_total_eth_supply()^ Error: ${err}`);
	}
}

// Test
// get_total_eth_supply_of_epoch(exampleEpoch).then((epoch) => {
//     console.log(epoch.totalEthSupply)
// }).catch((err: unknown) => {
//     console.log(err);
// })