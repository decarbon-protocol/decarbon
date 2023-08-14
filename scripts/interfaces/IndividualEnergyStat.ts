/**
 * @dev Define a uniform type to temporarily store energy stats in 1 epoch of an Eth address before we push it to DB
 */
interface IndividualEnergyStats {
    ethBalance: bigint,
    epochNum: bigint,
    pubKey: string,
    txFeePaidInEpoch: bigint,
    kWh: bigint,
    kgCO2e: bigint
    txCountInEpoch: number
}

export default IndividualEnergyStats;