import { ethers, JsonRpcProvider } from "ethers";
import { Epoch, exampleEpoch, IndividualEnergyStats } from "../../interfaces";
import { Filter } from "ethers";
import { Log } from "ethers";
import { get_tx_of_block, url } from ".";
import fs from "fs";
import { hex2Dec } from "../../utils";

const provider: JsonRpcProvider = new ethers.JsonRpcProvider(url);
/** 
 * @notice This function filters out transactions sent by the '_pubKeys' in '_epoch'
 * @param _epoch objects of type 'Epoch'. See 'scripts/interfaces/Epoch.ts" for more details
 * @param _stats a map from public key to an object of type 'EnergyStat'. See 'scripts/interfaces/EnergyStat.ts" for more details. Note: all keys in map should be UPPERCASE
 * @param write wheter to write results to file or not
 * @returns 'stats' with updated stats
 */
async function get_total_tx_fee_of_addresses_in_epoch(_epoch: Epoch, _stats: Map<string, IndividualEnergyStats>)
    : Promise<Map<string, IndividualEnergyStats>> {
    try {
        for (const block of _epoch.blocks) {
            const transactions: Record<string, any>[] = await get_tx_of_block(block, true) as Record<string, any>[];
            for (const tx of transactions) {
                const address: string = tx.from.toUpperCase();
                if (!(_stats.has(address))) {
                    continue;
                }
                const gasUsed: bigint = BigInt(hex2Dec(tx.gas));
                const gasPrice: bigint = BigInt(hex2Dec(tx.gasPrice));
                const txFee: bigint = gasUsed * gasPrice;
                let currStats: IndividualEnergyStats = _stats.get(address)!;
                currStats.txCountInEpoch++;
                currStats.txFeePaidInEpoch += txFee;
                _stats.set(address, currStats);
            }
        }

        // Finally
        return _stats;

    } catch (err: any) {
        const isENS: boolean = err.message.includes("UNCONFIGURED_NAME") ? true : false;
        const msg: string = isENS ? "\n->1 Invalid Ethereum address" : "";
        throw new Error(`get_tx_sent_from_addresses_of_block()^ Error: ${err + msg},`);
    }
}

// Test
get_total_tx_fee_of_addresses_in_epoch(exampleEpoch, ).catch((err: any) => {
    console.log(err);
})

export default get_total_tx_fee_of_addresses_in_epoch;