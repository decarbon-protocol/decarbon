/**
 * @notice Interface with the same schema as d_account table in database
 */
export default interface Account {
    account_id: bigint,
    address: string,
    eth_sent: bigint, // wei
    eth_received: bigint, // wei
    // account_balance: bigint // wei
}