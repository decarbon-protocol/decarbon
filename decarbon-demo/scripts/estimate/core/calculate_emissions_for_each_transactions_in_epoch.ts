import { Epoch, exampleEpoch, Transaction, Block, Account, exampleAccount } from "../../interfaces";
import { get_tx_of_block } from "../../aggregate/use_json_rpc";
import { hex2Dec, log } from "../../utils";
import { ethers } from "ethers";
import { get_tx_from_hashes } from "../../aggregate/use_json_rpc";
import fs from "fs";
import { calculate_x_y_factors_of_epoch } from "../../estimate/core";
import { get_blocks_of_epoch } from "../../aggregate/use_beaconchain_apis/";
import { resolveProperties } from "ethers/lib/utils";

const logPath: string = "data/logs/transactionList.json";
const transactionReceiptsPath: string = "data/logs/transactionReceipts.json";
const transactionResponsesPath: string = "data/logs/transactionResponses.json";
fs.writeFileSync(logPath, '');

function applyFormula(
    transaction__txFeePaid: bigint,
    transaction__ethBalanceChange: bigint,
    all__txFeePaid: bigint,
    all__totalEthSupply: bigint,
    all__xFactor: number,
    all__yFactor: number,
    all__emissions: number  // unit: kgCO2e
): [number, number] {
    const ratioY: number = parseFloat(ethers.utils.formatEther(transaction__txFeePaid)) / parseFloat(ethers.utils.formatEther(all__txFeePaid)) * all__yFactor;
    const ratioX: number = parseFloat(ethers.utils.formatEther(transaction__ethBalanceChange)) / parseFloat(ethers.utils.formatEther(all__totalEthSupply)) * all__xFactor;
    const transaction__senderEmissions: number = all__emissions * ratioY;
    const transaction__receiverEmissions: number = all__emissions * ratioX;
    return [transaction__senderEmissions, transaction__receiverEmissions];
}

/** 
 * @notice This function calculates the emissions of each transaction in one epoch
 * @dev We should update the database as soon as this function finishes
 * @param _epoch objects of type 'Epoch'. See 'scripts/interfaces/Epoch.ts" for more details
 * @param _transactionList an array of Transaction objects. See 'scripts/interfaces/Transaction.ts' for more details
 * @param _addressToAccount a set of addresses, kinda like a watch list, meaning we only calculate emissions for these addresses. *Note: all addresses in the list should be lowercase
 * @returns true if execution was successful, false otherwise
 */
export default async function calculate_emissions_of_transactions_in_epoch(_epoch: Epoch, _transactionList: Transaction[], _addressToAccount: Map<string, Account>, debug: boolean = false)
    : Promise<boolean> {
    console.log(`Calculating emissions of transactions in epoch ${_epoch.epoch_number}...\n`);
    try {
        // If we can't get blocks in epoch (could be server error), we skip this epoch and move on to the next epoch
        let success: boolean = await get_blocks_of_epoch(_epoch);
        if (!success) {
            return false;
        }
        await calculate_x_y_factors_of_epoch(_epoch);
        if (
            _epoch.total_tx_fee === undefined ||
            _epoch.total_eth_supply === undefined ||
            _epoch.xFactor === undefined ||
            _epoch.yFactor === undefined ||
            _epoch.kgCO2e === undefined ||
            _epoch.blocks === undefined
        ) {
            throw new Error(`totalTxFee/totalValidatorPayout/xFactor/yFactor/blocks of epoch ${_epoch.epoch_number}are undefined`);
        }
        const all__txFeePaid: bigint = _epoch.total_tx_fee!;
        const all__totalEthSupply: bigint = _epoch.total_eth_supply!;
        const all__xFactor: number = _epoch.xFactor!
        const all__yFactor: number = _epoch.yFactor!;
        const all__emissions: number = _epoch.kgCO2e!;

        const epoch__firstBlockNumber: number = _epoch.blocks[0].block_number;
        for (let i = 0; i < _epoch.blocks!.length; i++) {
            success = await get_tx_of_block(_epoch.blocks![i], false);
            if (!success) {
                return false;
            }

            const [transactionReceipts, transactionResponses] = await get_tx_from_hashes(_epoch.blocks![i].tx_hashes!) as [Record<string, string | boolean | []>[], Record<string, string | boolean | []>[]];

            if (debug) {
                fs.writeFileSync(transactionReceiptsPath, JSON.stringify(transactionReceipts, null, 4), 'utf-8');
                fs.writeFileSync(transactionResponsesPath, JSON.stringify(transactionResponses, null, 4), 'utf-8');
            }

            if (
                transactionReceipts === null || transactionResponses === null
                // transactionReceipts === undefined || transactionResponses === undefined
            ) {
                console.error(`Failed to get fetch transactions in epoch ${_epoch.epoch_number}!`);
                return false;
            }

            if (transactionResponses.length != transactionReceipts.length) {
                console.error("Unexpected: transactionResponses.length != transactionReceipts.length");
                return false;
            }

            for (let j = 0; j < transactionReceipts.length; j++) {
                if (
                    transactionResponses[j] == null || transactionReceipts[j] == null
                    // transactionResponses[j] === undefined || transactionReceipts[j] === undefined
                ) {
                    continue;
                }
                const transaction__sender: string = transactionResponses[j].from as string;
                const transaction__receiver: string = transactionResponses[j].to as string;
                if (_addressToAccount.has(transaction__sender) || _addressToAccount.has(transaction__receiver)) {
                    const transaction__gasUsed: bigint = BigInt(hex2Dec(transactionReceipts[j].gasUsed as string));
                    const transaction__gasPrice: bigint = BigInt(hex2Dec(transactionResponses[j].gasPrice as string));
                    const transaction__value: bigint = BigInt(hex2Dec(transactionResponses[j].value as string));
                    const transaction__txFeePaid: bigint = transaction__gasUsed * transaction__gasPrice;
                    const transaction__ethBalanceChange: bigint = transaction__value + transaction__txFeePaid;
                    const [transaction__senderEmissions, transaction__receiverEmissions] = applyFormula(
                        transaction__txFeePaid,
                        transaction__ethBalanceChange,
                        all__txFeePaid,
                        all__totalEthSupply,
                        all__xFactor,
                        all__yFactor,
                        all__emissions
                    )
                    const transaction__blockNumber: number = hex2Dec(transactionResponses[j].blockNumber as string);
                    const blockOffset = transaction__blockNumber - epoch__firstBlockNumber;
                    const transaction__timestamp: number = _epoch.blocks![blockOffset].timestamp;
                    const newTransaction: Transaction = {
                        hash: transactionResponses[j].hash as string,
                        nonce: hex2Dec(transactionResponses[j].nonce as string),
                        transaction_index: hex2Dec(transactionResponses[j].transactionIndex as string),
                        from_address: transaction__sender,
                        to_address: transaction__receiver,
                        value: transaction__value,
                        gas: BigInt(hex2Dec(transactionResponses[j].gas as string)),
                        gas_price: transaction__gasPrice,
                        block_number: hex2Dec(transactionResponses[j].blockNumber as string),
                        block_hash: transactionResponses[j].blockHash as string,
                        block_timestamp: transaction__timestamp,
                        receipt_contract_address: (transactionReceipts[j].contractAddress as string) ?? "",
                        receipt_status: hex2Dec(transactionReceipts[j].status as string),
                        receipt_gas_used: transaction__gasUsed,
                        receipt_cumulative_gas_used: BigInt(hex2Dec(transactionReceipts[j].cumulativeGasUsed as string)),
                        emission_by_transaction: transaction__senderEmissions,
                        emission_by_balance: transaction__receiverEmissions
                    }
                    _transactionList.push(newTransaction);

                    if (_addressToAccount.has(transaction__sender)) {
                        let currentValues = _addressToAccount.get(transaction__sender);
                        currentValues!.eth_sent += transaction__ethBalanceChange;
                        currentValues!.account_balance -= transaction__ethBalanceChange; //  This doesn't necessarily reflects the true balance of an address
                    }

                    if (_addressToAccount.has(transaction__receiver)) {
                        let currentValues = _addressToAccount.get(transaction__receiver);
                        currentValues!.eth_received += transaction__ethBalanceChange;
                        currentValues!.account_balance += transaction__ethBalanceChange; // This doesn't necessarily reflects the true balance of an address
                    }
                }
            }
        }

        // console.log(_transactionList);
        log(JSON.stringify(_transactionList, null, 4), logPath);
        console.log("Done!");

        return true;
    } catch (err) {
        throw new Error(`calculate_emisisons_of_transactions_in_epoch(): ${err}`);
    }
}

// Test
// const mocks = new Set<string>([
//     // These are transaction senders
//     "0x28c6c06298d514db089934071355e5743bf21d60",
//     "0x56eddb7aa87536c09ccc2793473599fd21a8b17f",
//     "0xae2fc483527b8ef99eb5d9b44875f005ba1fae13",
//     "0x21a31ee1afc51d94c2efccaa2092ad1028285549",
//     "0xe0deeccda3befa93aea667c2c13195ffdead01ab",
//     "0x327fe6f58fd07672e2b53be25598a0e43f23dd1c",
//     "0x276e6c50ddc7aa6e19e106b4f90bc8c99bddad73",
//     "0x5f06750bbf23b655016b0ec2fb2d82a33ae714ae",
//     "0x2f9a399c0d6234a3228e31483c61c4b509ef1cd3",
//     "0x8b89d0f0db08d938e58f134c7776eb108be5ba15",
//     "0x46340b20830761efd32832a74d7169b29feb9758",
//     "0x046961948080b224a2ab6a9d52b25937e75bb9ea",
//     "0x8ec8a01de404327923db6335a8e4b422524b6c92",
//     "0x3570b3604ff4b48296a357bdad8e986c373c560f",
//     "0xf06ebe3dc1ce76b7a320fcf402965d3eecd362a9",
//     "0x4c5132a45ac21d9a6a31bd4bd68fdaf4eefe9291",
//     "0xe6b7c477383428156f4e1afaaff72569ea04f5d6",
//     "0x974caa59e49682cda0ad2bbe82983419a2ecc400",
//     "0xea1c9b9799cf4ff42738f62a226da590354a3f1e",
//     "0x8328b7cb149e949969ea8e4e65c1e71dc2e4e8b3",
//     "0xb6f5160f76ad081c68ead03f2e59f007f42a7e78",

//     "0x6903DcEd8da1668D00F3cC9D021A3BDB3B8d00D3",

//     // These are transaction receivers
//     "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
//     "0xdf401bbc478093d6dc1688c949ec08f9356851c3",
//     "0xb31c1fff14cbd7cfa3836b1663d2bb82727e6606",
//     "0x8ab9cced71a92cd5ee11feac8d9f67017372c5ea",
//     "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
//     "0x188a99ea8764aa1838ab11dc5ababd7706ddfdd0"
// ])

// let addressToAccount: Map<string, Account> = new Map();
// let transactionList: Transaction[] = [];

// const account_balace_in_eth: number = 420;
// const eth_sent: number = 0;
// const eth_receive: number = 0;

// for (const address in mocks) {
//     addressToAccount.set(address, {
//         account_id: BigInt(address),
//         address: address,
//         eth_sent: BigInt(eth_sent),
//         eth_received: BigInt(eth_receive),
//         account_balance: BigInt(account_balace_in_eth)
//     });
// }

// // Epoch number value could e be set to a custom value for testing
// exampleEpoch.epoch_number = 223825;
// calculate_emissions_of_transactions_in_epoch(exampleEpoch, transactionList, addressToAccount, true)
//     .then(() => {
//         console.log(`Successfully calculated emissions for transactions in epoch ${exampleEpoch.epoch_number}!`);
//     })
//     .catch(err => {
//         console.log(err);
//         console.log(`Failed to calculate emissions for transactions in epoch ${exampleEpoch.epoch_number}!`);
//     }) 