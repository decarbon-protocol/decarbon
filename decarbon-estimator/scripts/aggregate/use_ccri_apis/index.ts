/** Dependencies */
import { network_config, DEFAULT_CHAIN_ID } from "../../00_network_config";

/** Import functions from this directory*/
import get_avg_emissions_of_period from "./get_avg_emissions_of_period";

/** Export functions from this directory*/
export { get_avg_emissions_of_period };

/** Export frequenly used variables */
const chainId = process.env.CHAIN_ID ?? DEFAULT_CHAIN_ID;
if (chainId === undefined) {
	throw new Error(`Invalid chain Id: ${chainId}`);
}

const url: string = "https://v2.api.carbon-ratings.com/currencies/dot";
if (url == "") {
	throw new Error(`Invalid URL: ${url}`);
}

const apiKey = process.env.CCRI_API_KEY ?? "";
if (apiKey == "") {
	throw new Error(`Invalid API key: ${apiKey}`);
}
export { url, apiKey };
