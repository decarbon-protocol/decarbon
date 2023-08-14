/** Import dependencies */
import { network } from "hardhat";
import { network_config } from "../../00_network_config";

/** Import functions from other files */
import get_finalized_epoch from "./get_finalized_epoch";
import get_validators_from_validator_indices from "./get_validators_from_validator_indices";
import get_total_validator_payout_of_epoch from "./get_total_validator_payout_of_epoch";


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

export { chainId, url, apiKey };

/** Export functions from other files */
export { get_finalized_epoch };
export { get_validators_from_validator_indices };
export { get_total_validator_payout_of_epoch };
