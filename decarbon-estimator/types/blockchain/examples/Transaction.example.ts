import Transaction from "../Transaction";

/**
 * @notice This is an example Transaction object with valid values
 * @dev Import this in other files and use it as a mock object for testing
 */
const exampleTransaction: Transaction = {
    hash: '0x095c99e0ff02e83bf0f0aa62186ddb48c603c7439ace1d2ffa6bbf2b094ac695',
    nonce: 14,
    transaction_index: 82,
    from_address: '0x4a246e9eb500496e63e5520154c07136ac6cbb17',
    to_address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
    value: 70810000000000000n,
    gas: 148233n,
    gas_price: 18809516526n,
    block_number: 17891386,
    block_hash: '0x8354a5da163b238f2265db0a66172093ddee8bc2c3ec0b91a535cd7a99ef9644',
    block_timestamp: 1691753795,
    receipt_contract_address: '',
    receipt_status: 1,
    receipt_gas_used: 123991n,
    receipt_cumulative_gas_used: 7880285n,
    emission_by_transaction: 0.000189834833591451,
    emission_by_balance: 1.5754220835315355e-8
}

export default exampleTransaction;