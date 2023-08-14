/**
 * @dev Define a uniform Validator type for the whole project
 */
interface Validator {
    index: bigint,
    publicKey: string,

    slashed?: boolean,
    balance?: bigint,
    effectiveBalance?: bigint,
    withdrawableEpoch?: bigint,
    activationEligibilityEpoch?: bigint,
    activationEpoch?: bigint,
    exitEpoch?: bigint,
    totalWithdrawals?: bigint,
    lastAttestationSlot?: bigint,
    name?: string,
    status?: string,
    withdrawalCredentials?: string,
}

export default Validator;