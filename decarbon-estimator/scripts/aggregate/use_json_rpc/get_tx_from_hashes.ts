import axios, { AxiosError } from 'axios';
import { get_tx_of_block, url } from ".";
import { output } from '../../utils';
import { exampleBlock } from '../../../types/blockchain';

export default async function get_tx_from_hashes(transactionHashes: string[])
    : Promise<[Record<string, string | boolean | []>[], Record<string, string | boolean | []>[]] | undefined> {
    const MAX_HASHES_PER_REQUEST = 166;
    while (transactionHashes.length > 0) {
        let requestList = transactionHashes.splice(0, MAX_HASHES_PER_REQUEST - 1);
        const batchRequests = requestList.flatMap((hash, index) => [
            {
                jsonrpc: '2.0',
                method: 'eth_getTransactionReceipt',
                params: [hash],
                id: index * 2 + 1
            },
            {
                jsonrpc: '2.0',
                method: 'eth_getTransactionByHash',
                params: [hash],
                id: index * 2 + 2
            }
        ]);
        const MAX_RETRY_ATTEMPTS = 5;
        let retryCount = 0;
        while (retryCount < MAX_RETRY_ATTEMPTS) {
            try {
                const response = await axios.post(url, batchRequests);
                const receiptResults: Record<string, string | boolean | []>[] = response.data.filter((result: any, index: number) => index % 2 === 0).map((result: any) => result.result);
                const transactionResults: Record<string, string | boolean | []>[] = response.data.filter((result: any, index: number) => index % 2 === 1).map((result: any) => result.result);
                return [receiptResults, transactionResults];
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    // console.error(`Server error on attempt ${retryCount + 1}:`, err);
                    output(`Server error on attempt ${retryCount + 1}, HTTP status code: ${err.response?.status}`);
                    await new Promise<void>(resolve => {
                        setTimeout(resolve, 12 * 1000);
                    });
                    retryCount++;
                    // console.log("Retrying...");
                    output("Retrying...");
                }
                else {
                    throw new Error(`get_tx_from_hashes(): ${err}`);
                }
            }
        }
        // If maximum attempts exceeded, print out error and don't return anything
        // console.error("\tMaximum retry attempts exceeded.");
        output("\tMaximum retry attempts exceeded.");
    }
}

// Testing
// const mocks: string[] = [
//     "0x2670ff2af7f1b3222849ebac93de7bd454c6e54de82b3ee91cb0154cb3028390",
//     "0x038fd1be49ae14a7ff97baa1f9114b4b6258f808147bd678590d8240dff28f75",
//     "0x101c7be9b6b2eda0c1325c5993e5bdadb8bb6501cf5a90e3cb68e8da1c7a2786",
//     "0x2cb9dc4c57214dc57caf11fd8f00fff1782b58c806c994f513578850df98d646",
//     "0x05172a2dd10162ece997ca358d575187989b6b41488e20ed67f2912e68b819e4",
//     "0x2ad1340dd15e96fff68417db4c7711219d165847c2741b8b7fd468aef1b65011",
//     "0x444c098bafd062a1d494af549cf80b46f6cde6c90187b00bd84e6397c099a744",
//     "0xc1dea6dc8c7feef1364262e69a1016040cf711dbc1242992b9be1bd15d9b87d1",
//     "0x989529a7919477e90fe978b7924865e5985a89c36ec9793cdfcf7efa5e076725",
//     "0xafba6e09095b04a8392d4d3786853436e4affb0c9dab9df608d7e410177c6968",
//     "0x1a30677da5f8d36fa4176dd3a3a50a5f3dc23549b6642402a3bd2cf5ddc20d92",
// ]


// get_tx_of_block(exampleBlock, false).then(() => {
//     get_tx_from_hashes(exampleBlock.tx_hashes!)
//     .then(() => {
//         // console.log('Transaction Receipts:', receipts);
//         // console.log('Transaction Details:', transactions);
//         // Process the data as needed
//     })
//     .catch((error: any) => {
//         console.error('Error:', error);
//     });  
// })