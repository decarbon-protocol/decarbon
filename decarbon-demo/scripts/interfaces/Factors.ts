/**
 * @dev Define a uniform  Incentivization Factors type for the whole project
 * @notice xFactor: Block Reward Incentivization Factor (In case of Ethereum PoS, it can be treated as Consensus Layer Reward Incentivization Factor)
 * @notice yFactor: Transaction Fee Incentivization Factor
 * @notice For more details, see '@credits/accouting_for_energy_usage_in_blockchains.pdf'
 */
interface Factors {
    xFactor: number,
    yFactor: number;
}

export default Factors;