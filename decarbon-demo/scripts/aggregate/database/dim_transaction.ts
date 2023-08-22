import { pool } from ".";
import { Transaction } from "../../interfaces";
import { genEthAddress } from "../../utils";


/**
 * @notice Schema for d_transaction
 */
// CREATE TABLE IF NOT EXISTS public.d_transaction
// (
//     transaction_id bigint NOT NULL DEFAULT nextval('d_transaction_transaction_id_seq'),
//     hash text COLLATE pg_catalog."default",
//     nonce bigint,
//     transaction_index bigint,
//     from_address text COLLATE pg_catalog."default",
//     to_address text COLLATE pg_catalog."default",
//     value numeric(38,0),
//     gas bigint,
//     gas_price bigint,
//     receipt_cumulative_gas_used bigint,
//     receipt_gas_used bigint,
//     receipt_contract_address text COLLATE pg_catalog."default",
//     receipt_status bigint,
//     block_timestamp timestamp without time zone,
//     block_number bigint,
//     block_hash text COLLATE pg_catalog."default",
//     "emission_by_transaction" bigint,
//     "emission_by_balance" bigint,
//     CONSTRAINT d_transaction_pkey PRIMARY KEY (transaction_id)
// )

const TABLE: string = "d_transaction";
export async function insertTransactions(_transactionList: Transaction[]) {
    try {
        const values = _transactionList
            .map(transaction =>
                `(
                    '${transaction.hash}',
                    ${transaction.nonce},
                    ${transaction.transaction_index},
                    '${transaction.from_address}',
                    '${transaction.to_address}',
                    ${transaction.value},
                    ${transaction.gas},
                    ${transaction.gas_price},
                    ${transaction.receipt_cumulative_gas_used},
                    ${transaction.receipt_gas_used},
                    '${transaction.receipt_contract_address}',
                    ${transaction.receipt_status},
                    to_timestamp(${transaction.block_timestamp}),
                    ${transaction.block_number},
                    '${transaction.block_hash}',
                    ${transaction.emission_by_transaction},
                    ${transaction.emission_by_balance}
                )`
            )
            .join(', ');

        const query: string = `
            INSERT INTO "${TABLE}" (
                "hash", "nonce", "transaction_index", "from_address", "to_address", "value", "gas", "gas_price", "receipt_cumulative_gas_used",
                "receipt_gas_used", "receipt_contract_address", "receipt_status", "block_timestamp", "block_number", "block_hash",
                "emission_by_transaction", "emission_by_balance"
            )
            VALUES ${values}`;

        const result = await pool.query(query);
        console.log(result);
    } catch (err) {
        console.log("updateTransactions(): ", err);
    }
}

// Testing
async function test() {
    const addressList: string[] = genEthAddress(500);
    const _hash = '0xabcdef1234567890';
    const _nonce = 12345;
    const _transaction_index = 1;
    const _from_address = '0x123456789abcdef0';
    const _to_address = '0xfedcba0987654321';
    const _value = 1000000000000000000n;
    const _gas = 21000n;
    const _gasPrice = 20000000000n;
    const _receipt_cumulative_gas_used = 21000n;
    const _receipt_gas_used = 21000n;
    const _receipt_contract_address = '0x9876543210abcdef';
    const _receipt_status = 1;
    const _block_timestamp = 1691753795;
    const _block_number = 123456;
    const _blockHash = '0xabcdef0123456789';
    const _emission_by_transaction = 3333332;
    const _emission_by_balance = 14141455;
    const transactionList: Transaction[] = [];
    for (const address of addressList) {
        transactionList.push({
            hash: _hash,
            nonce: _nonce,
            transaction_index: _transaction_index,
            from_address: address,
            to_address: _to_address,
            value: _value,
            gas: _gas,
            gas_price: _gasPrice,
            receipt_cumulative_gas_used: _receipt_cumulative_gas_used,
            receipt_gas_used: _receipt_gas_used,
            receipt_contract_address: _receipt_contract_address,
            receipt_status: _receipt_status,
            block_timestamp: _block_timestamp,
            block_number: _block_number,
            block_hash: _blockHash,
            emission_by_transaction: _emission_by_transaction,
            emission_by_balance: _emission_by_balance,
        })
    }
    await insertTransactions(transactionList);
    console.log(await pool.query("SELECT * FROM d_transaction"));
}
// test().catch(err => console.log(err));

export const dim_transaction = {
    insertTransactions
}