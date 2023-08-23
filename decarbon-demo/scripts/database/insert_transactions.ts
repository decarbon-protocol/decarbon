import { prisma } from "./";
import { Transaction, exampleTransaction } from "../interfaces";
import { log } from "../utils";
import { utils } from "ethers";

const logPath: string = "data/logs/database/insert_transactions.log";

export default async function insert_transactions(_transactionList: Transaction[]) 
: Promise<boolean> {
    try {
        console.log("\tInserting new transactions into database...");
        await prisma.d_transaction.createMany({
            data: _transactionList.map((transaction) => ({
                hash: transaction.hash,
                nonce: transaction.nonce,
                transaction_index: transaction.transaction_index,
                from_address: transaction.from_address,
                to_address: transaction.to_address,
                value: utils.formatEther(transaction.value),
                gas: transaction.gas,
                gas_price: transaction.gas_price,
                block_number: transaction.block_number,
                block_hash: transaction.block_hash,
                block_timestamp: new Date(transaction.block_timestamp * 1000).toISOString(),
                receipt_contract_address: transaction.receipt_contract_address,
                receipt_status: transaction.receipt_status,
                receipt_gas_used: transaction.receipt_gas_used,
                receipt_cumulative_gas_used: transaction.receipt_cumulative_gas_used,
                emission_by_transaction: transaction.emission_by_transaction,
                emission_by_balance: transaction.emission_by_balance
            }))
        })        
        console.log("Done!");
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Testing
// const mocks: Transaction[] = [
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
//    exampleTransaction,
// ]

// console.log("Inserting into db...");
// insert_transactions(mocks)
//     .then(async (success) => {
//         if (success) {
//             const rows = await prisma.d_transaction.findMany();
//             console.log(rows);
//         }
//         console.log("Done");
//     })
//     .catch (err => console.log(err));