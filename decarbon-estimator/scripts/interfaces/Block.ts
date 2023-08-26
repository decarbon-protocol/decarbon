/**
 * @dev Define a uniform Block type for the whole project
 */
interface Block {
    epoch_number: number, // Epoch number field won't be stored in database, it's only used for calculating purpose
    status: number, // 1: accepted, 2: missed, 3: orphaned. Status won't be stored in db as well.
    
    number: number,
    proposer_index: number,
    hash: string,
    timestamp: number,
    fee_recipient: string,
    transaction_count: number,
    gas_used: bigint,
    gas_limit: bigint,
    parent_hash: string,
    state_root: string,
    logs_bloom: string,
    tx_hashes?: string[] // Should use this instead of txReceipts to store transactions (but still only when needed);
    tx_responses?: Record<string, string | boolean | []>[] // Should avoid using this as well
    tx_receipts?: Record<string, string | boolean | []>[] // Should avoid using this because the amount of data for each block would be very large
}

export default Block;