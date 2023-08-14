/** Dependencies */
import { network } from "hardhat";
import { network_config } from "../../00_network_config";

/** Import functions */
import get_total_tx_fee_reward_of_epoch from "./get_total_tx_fee_reward_of_epoch";

/** Export functions */
export { get_total_tx_fee_reward_of_epoch };

/** Export frequently used variables */
const chainId = network.config.chainId ?? "";
if (chainId == "") {
	throw new Error(`Invalid chain Id: ${chainId}`);
}

const url = network_config[chainId as keyof typeof network_config]["etherscan_url"] ?? "";
if (url == "") {
	throw new Error(`Invalid URL: ${url}`);
}

const apiKey = process.env.ETHERSCAN_API_KEY ?? "";
if (apiKey == "") {
	throw new Error(`Invalid API key: ${apiKey}`);
}

export { chainId, url, apiKey };