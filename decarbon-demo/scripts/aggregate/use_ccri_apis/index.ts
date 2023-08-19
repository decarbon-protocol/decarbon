/** Dependencies */
import { network_config, DEFAULT_CHAIN_ID } from "../../00_network_config";

/** Import functions from this directory*/
import get_avg_consumption_and_emission_of_epoch from "./get_avg_consumption_and_emission_of_epoch";

/** Export functions from this directory*/
export { get_avg_consumption_and_emission_of_epoch };

/** Export frequenly used variables */
const chainId = process.env.CHAIN_ID ?? DEFAULT_CHAIN_ID;
if (chainId === undefined) {
	throw new Error(`Invalid chain Id: ${chainId}`);
}

const url = network_config[chainId as keyof typeof network_config]["ccri_url"] ?? "";
if (url == "") {
	throw new Error(`Invalid URL: ${url}`);
}

const apiKey = process.env.CCRI_API_KEY ?? "";
if (apiKey == "") {
	throw new Error(`Invalid API key: ${apiKey}`);
}
export { url, apiKey };
