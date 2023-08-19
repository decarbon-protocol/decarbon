import { provider } from "./index";

/**
 * 
 * @param txHash transaction hash
 * @returns object that has info of about the transaction (just like a transaction receipt)
 */
export default async function get_tx_receipt_from_tx_hash(txHash: string): Promise<Record<string, unknown>> {
	const response: Record<string, unknown>  = await provider.send(
		"eth_getTransactionReceipt",
		[txHash]
	) as Record<string, unknown>;

	return response;
}

// Test
// const mock: string = "0x6b0b87e149d73e82bfdf7df5d0b1231afd6501aeb7c44935674ab882fd5262ba";
// get_tx_receipt_from_tx_hash(mock).then((txInfo: Record<string, any>) => {
//     console.log(`${JSON.stringify(txInfo, null, 2)}`);
// }).catch((err: unknown) => {
//     console.log(err);
// })
