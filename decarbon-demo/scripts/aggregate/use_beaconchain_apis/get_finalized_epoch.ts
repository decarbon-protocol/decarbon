import axios, { AxiosError, AxiosResponse } from "axios";
import { Block, Epoch } from "../../interfaces";
import { url, apiKey } from ".";

/**
 * @notice This function collects info about blocks that are in the latest Ethereum epoch
 * @returns Info of the above-mentioned blocks, but parsed into objects of type 'Block'. See 'scripts/interfaces/Block.ts' for more details
 * @dev In Ethereum, 1 epoch = 32 slots, 1 slot = 12 secs. Meanwhile, Ethereum's block time is 12 secs. Therefore, every epoch, 32 new blocks is produced
 * @dev Each epoch, we only call this function once to aggregate the data of blocks in the most currently-finalized epoch. Then we pass that data as a parameter into other functions from other files in this use_beaconchain_apis_folder.
 */
async function get_finalized_epoch()
: Promise<Epoch> {
    try {
        // make a http request to gets the finalized epoch
        let response: AxiosResponse = await axios.get(`${url}/epoch/finalized`);
        const epochData: Record<string, any> = response.data.data;
        const epoch: Epoch = {
            // These are require properties
            epochNum: BigInt(epochData.epoch),
            blocks: [],
            // These are optional properties
        } 


        // make http requests to get basic infos of blocks that are in the latest epoch
        response = await axios.get(`${url}/epoch/${epoch.epochNum}/slots?apiKey=${apiKey}`);
        const blocks: Block[] = [];
        response.data.data.forEach((block: Record<string, any>) => {
            if (block.exec_block_hash !== undefined) {
                blocks.push({
                    // These are required properties
                    epochNum: BigInt(block.epoch),
                    blockNumber: BigInt(block.exec_block_number),
                    proposerIndex: BigInt(block.proposer),
                    blockHash: block.exec_block_hash,
                    feeRecipient: block.exec_fee_recipient,
                    // These are optional properties, so comment them out to save energy
                    timestamp: BigInt(block.exec_timestamp),
                    gasUsed: BigInt(block.exec_gas_used),
                    baseFeePerGas: BigInt(block.exec_base_fee_per_gas),
                });
            }
        });
        
        
        // finally
        epoch.blocks = blocks;
        return epoch;

    } catch (err) {
        throw new Error("get_blocks_in_finalized_epoch()^ Error: " + err);
    }
}

// Test
// get_finalized_epoch().then((epoch) => {
//     console.log(epoch);;
// }).catch((err) => {
//     console.log(err);
// })

export default get_finalized_epoch;