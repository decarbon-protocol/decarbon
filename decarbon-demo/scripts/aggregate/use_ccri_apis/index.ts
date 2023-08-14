/** Dependencies */
import { network_config } from "../../00_network_config";
import { network } from "hardhat";

/** Import functions */
import get_network_energy_consumption_in_24h from "./get_network_energy_consumption_in_24h";

/** Export functions */
export { get_network_energy_consumption_in_24h }

/** Export frequenly used variables */
const chainId = network.config.chainId ?? "";
if (chainId == "") {
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
export { chainId, url, apiKey };
