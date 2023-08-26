/**
 * @notice Define a custom interface for transactions
 * @dev Be careful when importing, don't mistake this interface the 'Transaction' provided by ethers.js
 */
export default interface Transaction {
    hash: string,
    nonce: number,
    transaction_index: number,
    from_address: string,
    to_address: string,
    value: bigint,
    gas: bigint,
    gas_price: bigint,
    block_number: number,
    block_hash: string,
    block_timestamp: number,
    receipt_contract_address: string,
    receipt_status: number,
    receipt_gas_used: bigint,
    receipt_cumulative_gas_used: bigint,
    emission_by_transaction: number,
    emission_by_balance: number,
    // consumption_by_transaction: number,
    // consumption_by_balance: number
}

