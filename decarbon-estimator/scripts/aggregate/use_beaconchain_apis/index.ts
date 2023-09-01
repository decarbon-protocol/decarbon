/** Import dependencies */
import { network_config, DEFAULT_CHAIN_ID } from "../../00_network_config";
import "dotenv/config";

/** Import functions from this directory */
import get_blocks_of_period from "./get_blocks_of_period";
import get_total_validator_payout_of_epoch from "./get_total_validator_payout_of_period";

/** Export functions from this directory*/
export { get_blocks_of_period };
export { get_total_validator_payout_of_epoch };

/** Export frequenly used variables */
const chainId: any = process.env.CHAIN_ID ?? DEFAULT_CHAIN_ID;
if (chainId === undefined) {
	throw new Error(`Invalid chain Id: ${chainId}`);
}

const url: any = network_config[chainId as keyof typeof network_config]["beaconchain_url"] ?? "";
if (url == "") {
	throw new Error(`Invalid URL: ${url}`);
}

const apiKey: any = process.env.BEACONCHAIN_API_KEY ?? "";
if (apiKey == "") {
	throw new Error(`Invalid API key: ${apiKey}`);
}

export { url, apiKey };