import Block from "./Block";
import Epoch, { exampleEpoch } from "./Epoch";
import Account from "./Account";
import Transaction from "./Transaction";

/**
 * @notice This is an example Block object with valid values
 * @dev Import this in other files and use it as a mock object for testing
 */
const exampleBlock: Block = {
    block_number: 17891407,
    epoch_number: 221171,
    proposer_index: 122222,
    block_hash: "0x3ae9a488f920980a7ecb9f6d64541bf6783adf005ec34c2be3dea84924cdab9e",
    fee_recipient: "0x8d0d35169cc73b5a9a2e5dabf794615cea019487",
    status: 1, // 1: accepted, 2: missed, 3: orphaned
    transaction_count: 181,
    gas_used: 16510090n,
    gas_limit: 30000000n,
    timestamp: 1691754047,
    parent_hash: "0x145f588cee7ae92cdc1585e3049159bbed698d83c1c8eb149c52e940920db9f5",
    state_root: "0x5c77ca85e7d64a0ff753d85a0f828945d588aee9eb2f58f78062bc88c928513f",
    logs_bloom: "0x05302923640953c3569832218056232bb02b068009c1a8203b89010092670940001191d40410202142b11520006523906a9ca00898502900265b18b750b16400c8456408cea49ba8eaba6b5bc70c19a426010109045609c102184c65c26251f0da01b1015212c00d42cc90303080684104985c0060184525c6a00a364268890388088e10024ca92504ea0c6953f810024124188dbb0c131e4c270052209046348e5061e0042160b1830658e038363e080b848000c02f0112490088620c1ac21286c814825e7028202d5b98088c4e9082003450a056e8a45027015112002024846cf029888550d080c084a7a061260201a40012107faaa5ce003599e1b6d51881",
}

/**
 * @notice This is an example Transaction object with valid values
 * @dev Import this in other files and use it as a mock object for testing
 */
const exampleTransaction: Transaction = {
    hash: '0x095c99e0ff02e83bf0f0aa62186ddb48c603c7439ace1d2ffa6bbf2b094ac695',
    nonce: 14,
    transaction_index: 82,
    from_address: '0x4a246e9eb500496e63e5520154c07136ac6cbb17',
    to_address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
    value: 70810000000000000n,
    gas: 148233n,
    gas_price: 18809516526n,
    block_number: 17891386,
    block_hash: '0x8354a5da163b238f2265db0a66172093ddee8bc2c3ec0b91a535cd7a99ef9644',
    block_timestamp: 1691753795,
    receipt_contract_address: '',
    receipt_status: 1,
    receipt_gas_used: 123991n,
    receipt_cumulative_gas_used: 7880285n,
    emission_by_transaction: 0.000189834833591451,
    emission_by_balance: 1.5754220835315355e-8
}

/**
 * @notice This is an example Account object with valid values
 * @dev Import this in other files and use it as a mock object for testing
 */
const exampleAccount = {
    account_id: 1n,
    address: "0xfD48761638E3a8C368ABAEFa9859cf6baa6C3c27",
    eth_sent: 0n,
    eth_received: 0n,
    account_balance: 0n
}

/**
 * @notice export interfaces
 */
export { Block, exampleBlock };
export { Epoch, exampleEpoch };
export { Transaction };
export { Account, exampleAccount };
