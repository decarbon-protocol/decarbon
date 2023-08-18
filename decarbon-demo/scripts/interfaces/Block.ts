/**
 * @dev Define a uniform Block type for the whole project
 */
interface Block {
    epochNum: bigint
    blockNumber: bigint,
    proposerIndex: bigint,
    blockHash: string,
    feeRecipient: string,
    status: number, // 1: accepted, 2: missed, 3: orphaned

    txCount?: number,
    baseFeePerGas?: bigint,
    gasUsed?: bigint,
    timestamp?: bigint,
    slot?: bigint,
    priorityFeePerGas?: bigint,
    gasPrice?: bigint,
    gasLimit?: bigint,
    parentHash?: string,
    stateRoot?: string,
    randao?: string,
    logsBloom?: string,
    txHashes?: string[] // Should use this instead of txReceipts to store transactions (but still only when needed);
    txReceipts?: Record<string, any>[] // Should avoid using this because the amount of data for each block would be very large
    txInfos?: Record<string, any>[] // Should avoid using this as well
}

export default Block;