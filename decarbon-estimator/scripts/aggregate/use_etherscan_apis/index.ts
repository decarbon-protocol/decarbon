/** Dependencies */
import { network_config, DEFAULT_CHAIN_ID } from "../../00_network_config";

/** Import functions from this directory*/
import get_total_tx_fee_reward_of_period from "./get_total_tx_fee_reward_of_period";
import get_total_eth_supply_of_period from "./get_total_eth_supply_of_period";

/** Export functions from this directory*/
export { get_total_tx_fee_reward_of_period as get_total_tx_fee_reward_of_epoch };
export { get_total_eth_supply_of_period };

/** Export frequently used variables */
const chainId: any = process.env.CHAIN_ID ?? DEFAULT_CHAIN_ID;
if (chainId === undefined) {
	throw new Error(`Invalid chain Id: ${chainId}`);
}

const url: any = network_config[chainId as keyof typeof network_config]["etherscan_url"] ?? "";
if (url == "") {
	throw new Error(`Invalid URL: ${url}`);
}

const apiKey: any = process.env.ETHERSCAN_API_KEY ?? "";
if (apiKey == "") {
	throw new Error(`Invalid API key: ${apiKey}`);
}

export { url, apiKey };