import { prisma } from ".";
import { Transaction, exampleTransaction } from "../interfaces";
import { log, output } from "../utils";
import { utils } from "ethers";

const logPath: string = "data/logs/database/insert_transactions.log";

export default async function insert_transactions(_transactionList: Transaction[]) 
: Promise<boolean> {
    try {
        output("\tInserting new transactions into database...");
        await prisma.transactions.createMany({
            data: _transactionList.map((transaction) => ({
                hash: transaction.hash,
                nonce: transaction.nonce,
                transaction_index: transaction.transaction_index,
                from_address: transaction.from_address,
                to_address: transaction.to_address,
                value: transaction.value.toString(),
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
        output("\tDone!");
        return true;
    } catch (err) {
        output(err);
        return false;
    }
}

// Testing
// const mocks: Transaction[] = [
//    exampleTransaction,
// ]

// console.log("Inserting into db...");
// insert_transactions(mocks)
//     .then(async (success) => {
//         if (success) {
//             const rows = await prisma.d_transaction.findMany();
//             console.log(rows);
//         }
//         else {
//             console.log("Failed");
//         }
//         console.log("Done");
//     })
//     .catch (err => console.log(err));