import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";
import "typechain";
import "solidity-coverage";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/types";

const PRIVATE_KEYS: string[] = process.env.PRIVATE_KEYS?.split(" ") ?? [""];
const SEPOLIA_RPC_URL: string = process.env.SEPOLIA_RPC_URL ?? "";
const MAINNET_RPC_URL: string = process.env.MAINNET_RPC_URL ?? "";
const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY ?? "";
const COINMARKETCAP_API_KEY: string = process.env.COINMARKETCAP_API_KEY ?? "";

const config: HardhatUserConfig = {
	solidity: "0.8.18",
	defaultNetwork: "mainnet",
	networks: {
		mainnet: {
			url: MAINNET_RPC_URL,
			accounts: PRIVATE_KEYS,
			chainId: 1,
		},
		sepolia_testnet: {
			url: SEPOLIA_RPC_URL,
			accounts: PRIVATE_KEYS,
			chainId: 11155111,
		},
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	gasReporter: {
		enabled: true,
		noColors: true,
		currency: "USD",
		outputFile: "./artifacts/latest-gas-report",
		coinmarketcap: COINMARKETCAP_API_KEY
	},
};

export default config;