/**
 * @notice Interface with the same schema as d_account table in database
 */
export default interface Account {
    account_id: bigint,
    address: string,
    eth_sent: number, // Unit: Eth
    eth_received: number, // Unit: Eth
    // account_balance: bigint // wei
}