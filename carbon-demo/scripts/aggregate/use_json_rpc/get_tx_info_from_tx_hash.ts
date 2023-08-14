import { network } from "hardhat";

async function get_tx_info_from_tx_hash(txHash: string)
: Promise<Record<string, any>> {
	const response: Record<string, any>  = await network.provider.request({
		method: "eth_getTransactionByHash",
		params: [txHash]
	}) as Record<string, any>;

	return response;
}

// Test
// const mock: string = "0x6b0b87e149d73e82bfdf7df5d0b1231afd6501aeb7c44935674ab882fd5262ba";
// get_tx_info_from_tx_hash(mock).then((txInfo: Record<string, any>) => {
//     console.log(`${JSON.stringify(txInfo, null, 2)}`);
// }).catch((err: any) => {
//     console.log(err);
// })

export default get_tx_info_from_tx_hash;