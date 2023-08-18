/** Import dependencies */
import { network } from "hardhat";
import { network_config } from "../../";

/** Import functions from this directory */
import get_blocks_of_epoch from "./get_blocks_of_epoch";
import get_total_validator_payout_of_epoch from "./get_total_validator_payout_of_epoch";

/** Export functions from this directory*/
export { get_blocks_of_epoch };
export { get_total_validator_payout_of_epoch };

/** Export frequenly used variables */
const chainId = network.config.chainId ?? "";
if (chainId == "") {
	throw new Error(`Invalid chain Id: ${chainId}`);
}

const url = network_config[chainId as keyof typeof network_config]["beaconchain_url"] ?? "";
if (url == "") {
	throw new Error(`Invalid URL: ${url}`);
}

const apiKey = process.env.BEACONCHAIN_API_KEY ?? "";
if (apiKey == "") {
	throw new Error(`Invalid API key: ${apiKey}`);
}

export { url, apiKey };