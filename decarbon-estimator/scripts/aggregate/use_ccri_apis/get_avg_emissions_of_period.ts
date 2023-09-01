import { apiKey, url } from ".";
import axios, { AxiosResponse } from "axios";
import { constants } from "../../01_constants";
import { Epoch, exampleEpoch } from "../../interfaces";
import fs from "fs";

/**
 * 
 * @notice This function gets the avg. energy consumption and carbon emissions of the whole Ethereum network in 1 epoch
 * @param _epoch Object of type Epoch. See 'scripts/interfaces/Epoch.ts' for more details
 * @returns the @param '_epoch' but with updated properties 'kWh' and 'kgCO2e'
 */
export default async function get_avg_emissions_of_period(_epoch: Epoch): Promise<Epoch> {
	try {
		// get avg. consumption of epoch
		const powerResponse: AxiosResponse = await axios.get(
			`${url}/power/network?key=${apiKey}`
		);
		// fs.writeFileSync("data/get_power.json", JSON.stringify(powerResponse.data, null, 4));
		const powerEntries: Record<string, unknown>[] = powerResponse.data.entries;
		const avgPower: number = powerEntries[powerEntries.length - 1].power as number; // daily avg. kilo-wattage power of network (kW)
		const avgConsumption: number = avgPower * (constants.NUM_MINUTES_IN_EPOCH / 60); // avg. consumption of network in 1 epoch (kWh)

		// get avg. emission of epoch
		const emissionResponse: AxiosResponse = await axios.get(
			`${url}/emissions/network?key=${apiKey}`
		);
		// fs.writeFileSync("data/get_emission.json", JSON.stringify(emissionResponse.data, null, 4));
		const emissionEntries: Record<string, unknown>[] = emissionResponse.data.entries;
		const avgCarbonIntensity: number = emissionEntries[emissionEntries.length - 1].intensity as number; // daily avg. carbon intensity of network (kgCO2e/kWh)
		const avgEmission: number = avgCarbonIntensity * avgConsumption; // avg. carbon emission of network in 1 epoch (kgCO2e)

		// Finally
		// _epoch.kWh = avgConsumption;
		_epoch.kgCO2e = avgEmission;
		return _epoch;

	} catch (err: unknown) {
		throw new Error(`^get_avg_consumption_and_emission_of_epoch(): ${err}`);
	}
}

// Test
get_avg_emissions_of_period(exampleEpoch).then((epoch: Epoch) => {
	console.log(`Emission: ${epoch.kgCO2e} (kgCO2e)`);
}).catch((err: unknown) => {
	console.log(err);
});