/**
 * @dev Define a uniform type to temporarily store energy stats in 1 epoch of an Eth address before we push it to DB
 * @notice all variables in the interface is calculated based on 1 epoch
 */
interface IndividualEnergyStats {
    ethBalanceChange: bigint,
    epochNum: bigint,
    address: string,
    txFeePaidInEpoch: bigint,
    kWh: number,
    kgCO2e: number,
    txMadeInEpoch: number,
}

export default IndividualEnergyStats;