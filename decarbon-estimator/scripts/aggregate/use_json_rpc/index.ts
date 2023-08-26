import "dotenv/config";
import 

const url: string = process.env.MAINNET_RPC_URL ?? "";
if (url == "") {
    throw new Error("Please specify RPC provider url");
}

export { url };

/**
 * @notice import and export sub-functions
 */
import get_account_info from "./get_account_info";
export { get_account_info };
