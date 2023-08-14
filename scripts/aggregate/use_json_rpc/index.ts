/** Dependencies */
import { network } from "hardhat";
import { network_config } from "../../00_network_config";

/** Import functions from other files */
import get_tx_of_block from "./get_tx_of_block";
import get_tx_info_from_tx_hash from "./get_tx_info_from_tx_hash";
import get_tx_receipt_from_tx_hash from "./get_tx_receipt_from_tx_hash";
import get_total_tx_fee_of_addresses_in_epoch from "./get_total_tx_fee_of_addresses_in_epoch";

/** Export functions from other files */
export { get_tx_of_block };
export { get_tx_info_from_tx_hash };
export { get_tx_receipt_from_tx_hash };
export { get_total_tx_fee_of_addresses_in_epoch };

/** Export frequently used variables */
const chainId = network.config.chainId ?? "";
if (chainId == "") {
    throw new Error(`Invalid chain Id: ${chainId}`);
}

const url = network_config[chainId as keyof typeof network_config]["rpc_url"] ?? "";
if (url == "") {
    throw new Error(`Invalid URL: ${url}`);
}

export { chainId, url };