import Block from "./Block";

/**
 * @dev Define a uniform Epoch type for the whole project
 */
interface Epoch {
    epochNum: bigint,
    
    finalized?: boolean,
    blocks?: Block[],
    attestationsCount?: number,
    attesterSlashingsCount?: number,
    averageValidatorBalance?: bigint,
    blocksCount?: number,
    depositsCount?: number,
    eligibleEther?: bigint,
    globalParticipationRate?: number,
    missedBlocks?: number,
    orphanedBlocks?: number,
    proposedBlocks?: number,
    proposerSlashingsCount?: number,
    rewardsExported?: boolean,
    scheduledBlocks?: number,
    totalValidatorBalance?: bigint,
    timestamp?: string | bigint,
    validatorsCount?: bigint,
    voluntaryExitsCount?: number,
    votedEther?: bigint,
    withdrawalCount?: number,
    totalTxFee?: bigint,
    totalEthSupply?: bigint,
    totalValidatorPayout?: bigint,
    kWh?: number, // average energy consumption of epoch in kWh unit
    kgCO2e?: number, // average carbon emissions of epoch in kgCO2e unit
    xFactor?: number,
    yFactor?: number,
}

/**
 * @notice This is an example Epoch object with valid values (It's defined in this file instead of './index.ts' because it's too long)
 * @dev Import this in other files and use it as mock object for testing
 */
const exampleEpoch: Epoch = {
	epochNum: 221171n,
	kWh: 75.14219923708822,
	kgCO2e: 26.046499564706007,
	totalEthSupply: BigInt("120139112969493971973265217"),
    blocks: [],
	// blocks: [
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891377n,
	// 		proposerIndex: 519181n,
	// 		blockHash: "0x7924bc0d36c8ee49de26b71760a920ba9b8f071dfc73f35ee14c58a8fe801984",
	// 		feeRecipient: "0x690b9a9e9aa1c9db991c7721a92d351db4fac990",
	// 		timestamp: 1691753687n,
	// 		gasUsed: 13607794n,
	// 		baseFeePerGas: 17696370242n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891378n,
	// 		proposerIndex: 421554n,
	// 		blockHash: "0x0bc5305283e05e0a145fd087716964e3a54841f7070b93288c3fff08fa844e0e",
	// 		feeRecipient: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
	// 		timestamp: 1691753699n,
	// 		gasUsed: 14082164n,
	// 		baseFeePerGas: 17491061969n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891379n,
	// 		proposerIndex: 38381n,
	// 		blockHash: "0x2fc11c03d4cb1da1858e99a9ca2e4fb84cb8d706f411c420afef603b4d675497",
	// 		feeRecipient: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
	// 		timestamp: 1691753711n,
	// 		gasUsed: 29972367n,
	// 		baseFeePerGas: 17357279250n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891380n,
	// 		proposerIndex: 293631n,
	// 		blockHash: "0x294d088f45b7a6024038f7fca9830d294856a302d5f08070ce38e3262de5f6ee",
	// 		feeRecipient: "0x5124fcc2b3f99f571ad67d075643c743f38f1c34",
	// 		timestamp: 1691753723n,
	// 		gasUsed: 16301650n,
	// 		baseFeePerGas: 19522942208n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891381n,
	// 		proposerIndex: 147080n,
	// 		blockHash: "0x9b87ab383ee8d762d04a948630277d5fc6404fb1bef11b6bc6a8d221abd4cfa8",
	// 		feeRecipient: "0x4675c7e5baafbffbca748158becba61ef3b0a263",
	// 		timestamp: 1691753735n,
	// 		gasUsed: 12907125n,
	// 		baseFeePerGas: 19734709189n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891382n,
	// 		proposerIndex: 299682n,
	// 		blockHash: "0x07643e8ae1b0baa1563fdf88ce8870b7354094f1a979f1a78b86513fd513fe8f",
	// 		feeRecipient: "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
	// 		timestamp: 1691753747n,
	// 		gasUsed: 14442543n,
	// 		baseFeePerGas: 19390523527n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891383n,
	// 		proposerIndex: 454239n,
	// 		blockHash: "0x7bc66c55c628f013ed77e8cffe4f56bf29565bf7c567ccf17be53157f7dc11ae",
	// 		feeRecipient: "0x388c818ca8b9251b393131c08a736a67ccb19297",
	// 		timestamp: 1691753759n,
	// 		gasUsed: 8991669n,
	// 		baseFeePerGas: 19300445335n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891384n,
	// 		proposerIndex: 80840n,
	// 		blockHash: "0xc6008820be0bb6ae982facbb37884aab0298aa4796f66d0508a16bd538960709",
	// 		feeRecipient: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
	// 		timestamp: 1691753771n,
	// 		gasUsed: 17975559n,
	// 		baseFeePerGas: 18334083135n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891385n,
	// 		proposerIndex: 353328n,
	// 		blockHash: "0x41900d84db23be3a306c3bfac263252ab6a2c5e9a00bbdd54a0a5c5687a854bc",
	// 		feeRecipient: "0xdafea492d9c6733ae3d56b7ed1adb60692c98bc5",
	// 		timestamp: 1691753783n,
	// 		gasUsed: 13522402n,
	// 		baseFeePerGas: 18788701018n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891386n,
	// 		proposerIndex: 695214n,
	// 		blockHash: "0x8354a5da163b238f2265db0a66172093ddee8bc2c3ec0b91a535cd7a99ef9644",
	// 		feeRecipient: "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
	// 		timestamp: 1691753795n,
	// 		gasUsed: 15568205n,
	// 		baseFeePerGas: 18557349793n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891387n,
	// 		proposerIndex: 144746n,
	// 		blockHash: "0xe625dcdb1f7669f5765e8473654559ec1de7c9e18166ffe01033dd498859f18a",
	// 		feeRecipient: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
	// 		timestamp: 1691753807n,
	// 		gasUsed: 10316673n,
	// 		baseFeePerGas: 18645219617n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891388n,
	// 		proposerIndex: 494991n,
	// 		blockHash: "0x1f66a22ec532dcdd6384825fc55397882018ffff69c5a1190cf5e1bc509b3eea",
	// 		feeRecipient: "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
	// 		timestamp: 1691753819n,
	// 		gasUsed: 12549362n,
	// 		baseFeePerGas: 17917539114n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891389n,
	// 		proposerIndex: 6212n,
	// 		blockHash: "0x6d27830ebd41fa8a38316def6ab4a4e0bebe9a3ab5a2626950878fc83c521a33",
	// 		feeRecipient: "0xb64e2d92b22d6f3ce8346a8e4b2ebe896ac65dad",
	// 		timestamp: 1691753831n,
	// 		gasUsed: 14993074n,
	// 		baseFeePerGas: 17551627429n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891390n,
	// 		proposerIndex: 503382n,
	// 		blockHash: "0x375f4bdd90526813ba41053d8ffcb26fe766dc004e6a6498184b30ee2b62ba5c",
	// 		feeRecipient: "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
	// 		timestamp: 1691753843n,
	// 		gasUsed: 13528970n,
	// 		baseFeePerGas: 17550614408n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891391n,
	// 		proposerIndex: 418729n,
	// 		blockHash: "0x41e9378c8edd3a9c15426227b599b94f2d176b4bfa12dab7f841cfa8c87a7dac",
	// 		feeRecipient: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
	// 		timestamp: 1691753855n,
	// 		gasUsed: 15559298n,
	// 		baseFeePerGas: 17335468739n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891392n,
	// 		proposerIndex: 686219n,
	// 		blockHash: "0x9fbd4f06b702ede4fa7c1e4283cacd538011e2f7a3df5a7b27c70f3652a4c0f6",
	// 		feeRecipient: "0xbaf6dc2e647aeb6f510f9e318856a1bcd66c5e19",
	// 		timestamp: 1691753867n,
	// 		gasUsed: 11972765n,
	// 		baseFeePerGas: 17416266180n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891393n,
	// 		proposerIndex: 220131n,
	// 		blockHash: "0x0a2bd729e7d4400e48773bdb5b3b5c5fbaf617124a15792b2a7b7bab9b80f284",
	// 		feeRecipient: "0xdafea492d9c6733ae3d56b7ed1adb60692c98bc5",
	// 		timestamp: 1691753879n,
	// 		gasUsed: 19476719n,
	// 		baseFeePerGas: 16976906759n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891394n,
	// 		proposerIndex: 272700n,
	// 		blockHash: "0x8d74f1105ed4e51e224dcb102391f08e03b6fc8e32ec857f01dbddcd36b844bb",
	// 		feeRecipient: "0x05295a0ac05d2165b061cd44907c53b7a85e95ff",
	// 		timestamp: 1691753891n,
	// 		gasUsed: 3364234n,
	// 		baseFeePerGas: 17610247101n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891395n,
	// 		proposerIndex: 144224n,
	// 		blockHash: "0x951ec1d8b8da98a465cbe27eddeb1068d679d0f476c582d003a60fc6c033c070",
	// 		feeRecipient: "0x706fb2d6a08b7c75a9e06c1d13dbe6310d074c57",
	// 		timestamp: 1691753903n,
	// 		gasUsed: 29987015n,
	// 		baseFeePerGas: 15902674481n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891396n,
	// 		proposerIndex: 438578n,
	// 		blockHash: "0xdd97aed204f951c12c8410bd114ea9024b6c14a6c00d146f1a22852d1e0f2278",
	// 		feeRecipient: "0xbaf6dc2e647aeb6f510f9e318856a1bcd66c5e19",
	// 		timestamp: 1691753915n,
	// 		gasUsed: 24465273n,
	// 		baseFeePerGas: 17888787989n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891397n,
	// 		proposerIndex: 656108n,
	// 		blockHash: "0x11cc86c7fa9dccec479d58f39cf676de76d0a5558ada8cfe0a5e3e58aa0d6237",
	// 		feeRecipient: "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
	// 		timestamp: 1691753927n,
	// 		gasUsed: 10592544n,
	// 		baseFeePerGas: 19299806838n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891398n,
	// 		proposerIndex: 172650n,
	// 		blockHash: "0x1aa6b26aaa698a1fc3f6c1225af7326b2a59e6d7be9f3da60bf2926263f5e31d",
	// 		feeRecipient: "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
	// 		timestamp: 1691753939n,
	// 		gasUsed: 11262128n,
	// 		baseFeePerGas: 18590948093n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891399n,
	// 		proposerIndex: 486034n,
	// 		blockHash: "0x7fff0975dbfa9a4c7349e500df6752ce5601419394a00d16fc08d98e58d1e94d",
	// 		feeRecipient: "0xdafea492d9c6733ae3d56b7ed1adb60692c98bc5",
	// 		timestamp: 1691753951n,
	// 		gasUsed: 15078057n,
	// 		baseFeePerGas: 18011859891n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891400n,
	// 		proposerIndex: 584533n,
	// 		blockHash: "0xdbd39b93a17bb04378c39291f4c5b6457fa77cae4934c33755261c80f29213e0",
	// 		feeRecipient: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
	// 		timestamp: 1691753963n,
	// 		gasUsed: 15389319n,
	// 		baseFeePerGas: 18023576155n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891401n,
	// 		proposerIndex: 387126n,
	// 		blockHash: "0x508ab517e99d4f18084c93814dcbf3f168e8ce10d70b69aa2fe412606820eacc",
	// 		feeRecipient: "0x388c818ca8b9251b393131c08a736a67ccb19297",
	// 		timestamp: 1691753975n,
	// 		gasUsed: 15226000n,
	// 		baseFeePerGas: 18082050493n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891402n,
	// 		proposerIndex: 195588n,
	// 		blockHash: "0xfb42c293576c9d97ac024abdf1a18775cec325b4abfdd18aa7aa47feb1daf516",
	// 		feeRecipient: "0xe1bd460f3540ca743b2e1065d62eabab06ddcaa9",
	// 		timestamp: 1691753987n,
	// 		gasUsed: 13298652n,
	// 		baseFeePerGas: 18116105021n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891403n,
	// 		proposerIndex: 739595n,
	// 		blockHash: "0xf03061f05331ee4dc3f0e3643547f0e7fa96c265cef8cb100585adbaf3a3842d",
	// 		feeRecipient: "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
	// 		timestamp: 1691753999n,
	// 		gasUsed: 22611699n,
	// 		baseFeePerGas: 17861219164n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891404n,
	// 		proposerIndex: 181599n,
	// 		blockHash: "0xd3ce8d3039afad952b0c7a7a8fdd50a8dd1ad674a982b6d091e7531d4e5d9f04",
	// 		feeRecipient: "0x333333f332a06ecb5d20d35da44ba07986d6e203",
	// 		timestamp: 1691754011n,
	// 		gasUsed: 12545975n,
	// 		baseFeePerGas: 18994174172n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891405n,
	// 		proposerIndex: 727107n,
	// 		blockHash: "0x32a056ca6171c2c1654c2c007ebb384629cebf1e84f0b5f87b5e9f548474aed8",
	// 		feeRecipient: "0x1f9090aae28b8a3dceadf281b0f12828e676c326",
	// 		timestamp: 1691754023n,
	// 		gasUsed: 14591095n,
	// 		baseFeePerGas: 18605739354n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891406n,
	// 		proposerIndex: 709873n,
	// 		blockHash: "0x145f588cee7ae92cdc1585e3049159bbed698d83c1c8eb149c52e940920db9f5",
	// 		feeRecipient: "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97",
	// 		timestamp: 1691754035n,
	// 		gasUsed: 14040293n,
	// 		baseFeePerGas: 18542339522n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891407n,
	// 		proposerIndex: 122222n,
	// 		blockHash: "0x847bebac1ef5daa4560d82d9600ffd8296336379ac31ca193afbd81dfb59f37c",
	// 		feeRecipient: "0x8d0d35169cc73b5a9a2e5dabf794615cea019487",
	// 		timestamp: 1691754047n,
	// 		gasUsed: 16510090n,
	// 		baseFeePerGas: 18394046081n
	// 	},
	// 	{
	// 		epochNum: 221171n,
	// 		blockNumber: 17891408n,
	// 		proposerIndex: 202607n,
	// 		blockHash: "0x2bba5c5d81fbec3b3724ebe3d9666d65a04bfc39ae4122e99bc7455d162a4626",
	// 		feeRecipient: "0x388c818ca8b9251b393131c08a736a67ccb19297",
	// 		timestamp: 1691754059n,
	// 		gasUsed: 11281659n,
	// 		baseFeePerGas: 18625518289n
	// 	}
	// ]
};

export default Epoch;
export { exampleEpoch };