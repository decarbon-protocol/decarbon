/** Dependencies */
import { network_config, DEFAULT_CHAIN_ID } from "../../00_network_config";
import { ethers, providers } from "ethers";

/** Import functions from this directory */
import get_tx_of_block from "./get_tx_of_block";
import get_tx_info_from_tx_hash from "./get_tx_info_from_tx_hash";
import get_tx_receipt_from_tx_hash from "./get_tx_receipt_from_tx_hash";
import get_tx_fee_paid_and_balance_change_of_addresses_in_epoch from "./get_tx_fee_paid_and_balance_change_of_addresses_in_epoch";

/** Export functions from this directory */
export { get_tx_of_block };
export { get_tx_info_from_tx_hash };
export { get_tx_receipt_from_tx_hash };
export { get_tx_fee_paid_and_balance_change_of_addresses_in_epoch };

/** Export frequently used variables */
const chainId: any = process.env.CHAIN_ID ?? DEFAULT_CHAIN_ID;
if (chainId === undefined) {
	throw new Error(`Invalid chain Id: ${chainId}`);
}

const url: any = network_config[chainId as keyof typeof network_config]["rpc_url"] ?? "";
if (url == "") {
	throw new Error(`Invalid URL: ${url}`);
}

const provider = new ethers.providers.JsonRpcProvider(url);

export { url, provider };