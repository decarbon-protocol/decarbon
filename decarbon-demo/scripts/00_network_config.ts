import "dotenv/config";

/**
 * @notice network_config object contains informations about a few networks like Ethereum mainnet, Ethereum Sepolia,...
 * @dev '1', '5',... is the chainId of each network(mainnet, sepolia, ...)
 *
 */
const network_config = {
	1: {
		name: "Ethereum mainnet",
		etherscan_url: "https://api.etherscan.io/api",
		beaconchain_url: "https://beaconcha.in/api/v1",
		ccri_url: "https://v2.api.carbon-ratings.com/currencies/eth2",
		rpc_url: process.env.MAINNET_RPC_URL,
	},
	5: {
		name: "Ethereum Goerli testnet",
		etherscan_url: "https://api-goerli.etherscan.io/api",
		beaconchain_url: "https://beaconcha.in/api/v1",
		ccri_url: "https://v2.api.carbon-ratings.com/currencies/eth2",
		rpc_url: "someone add this",
	},
	11155111: {
		name: "Ethereum Sepolia testnet",
		etherscan_url: "https://api-sepolia.etherscan.io/api",
		beaconchain_url: "https://beaconcha.in/api/v1",
		ccri_url: "https://v2.api.carbon-ratings.com/currencies/eth2",
		rpc_url: process.env.SEPOLIA_RPC_URL,
	},
};

export { network_config };