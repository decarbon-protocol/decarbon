import { fetch_accounts_from_db, prisma } from ".";
import { Account } from "../../types/blockchain";
import { utils } from "ethers";
import { output } from "../utils";

export default async function udpate_accounts_data(_addressToAccount: Map<string, Account>)
: Promise<boolean> {
    try {
        output("\tUpdating accounts data in database...")
        for (const [_address, _account] of _addressToAccount) {
            await prisma.d_account.update({
                where: { address: _address },
                data: {
                    eth_sent: _account.eth_sent,
                    eth_received: _account.eth_received
                }
            })
        }
        output("\tDone!");
        return true;
    } catch (error) {
        console.error('Error updating accounts:', error);
        return false;
    }
}

// Testing
// async function test() {
//     let addressToAccount = new Map<string, Account>();
//     await fetch_accounts_from_db(addressToAccount);
//     for (let [address, account] of  addressToAccount) {
//         account.eth_sent = 111n;
//         account.eth_received = 222n;
//     }
//     await udpate_accounts_data(addressToAccount);
// }

// test().catch(err => console.log(err));