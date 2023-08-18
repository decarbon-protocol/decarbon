import Block from "./Block";
import Epoch, { exampleEpoch } from "./Epoch";
import Validator from "./Validator";
import IndividualEnergyStats from "./IndividualEnergyStat";

/**
 * @notice This is an example Block object with valid values
 * @dev Import this in other files and use it as a mock object for testing
 */
const exampleBlock: Block = {
    status: 1,
	blockNumber: 17853620n,
	feeRecipient: "0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5",
	blockHash: "0xa5649b0552015f6cbc54e99ae39e8960a3a92cb9a9c7a043fd2210c059e64aa8",
	timestamp: 1691297135n,
	baseFeePerGas: 11876463482n,
	epochNum: 219982n,
	proposerIndex: 788730n,
};

/**
 * @notice This is an example Validator object with valid values
 * @dev Import this in other files and use it as a mock object for testing
 */
const exampleValidator: Validator = {
	index: 748443n,
	publicKey: "0x8f1160774510e944c609c8facbaa003fc75275e5ef89213be58fa816b4e8d5627e9721c74dea80bb29c2760fa513f3c0",
	balance: 32023801079n,
	effectiveBalance: 32000000000n,
	slashed: false,
	activationEligibilityEpoch: 205474n,
	activationEpoch: 215227n,
	withdrawableEpoch: 9223372036854776000n,
	exitEpoch: 9223372036854776000n,
	totalWithdrawals: 46501827n,
	status: "active_online",
	withdrawalCredentials: "0x010000000000000000000000dd0e6e26d175cbfc4c2abe21d4ef9ca4ffd9763d"
};

/**
 * @notice This is an example Factors object
 * @dev Import this in other files and use it as a mock object for testing
 */
// const exampleFactors: Factors = {
//     xFactor: 0.9552563748976916,
//     yFactor: 0.04474362510230844
// }

/**
 * @notice 
 */

export { Block, exampleBlock };
export { Epoch, exampleEpoch };
export { Validator, exampleValidator };
export { IndividualEnergyStats };
