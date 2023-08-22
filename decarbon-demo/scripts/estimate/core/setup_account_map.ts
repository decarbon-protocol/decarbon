import { Account } from "../../interfaces";
import { dim_account } from "../../aggregate/database/dim_account";

export default async function setup_account_map(_addressToAccount: Map<string, Account>) 
: Promise<boolean> {
    try {
        console.log(`\nFetching accounts from database...`);
        const rows = await dim_account.getAllRows();
        console.log(`\tDone! Number of accounts: ${rows.length}`);
        console.log(`\tSetting up account map...`);
        _addressToAccount = rows.reduce((map, row) => {
            const account: Account = {
                account_id: BigInt(row.account_id as string),
                address: row.address as string,
                eth_received: BigInt(row.eth_received as string),
                eth_sent: BigInt(row.eth_sent as string),
                account_balance: BigInt(row.account_balance as string)
            }
            return map.set(row.address as string, account);
        }, new Map<string, Account>());
        console.log("\tDone!\n");
        return true;
    } catch (err) {
        console.error(`setup_account_map(): ${err}`);
        return false;
    }
}

// Testing
// setup_account_map()
// .then(map => {
//     for (const [key, value] of map) {
//         console.log(`Address: ${key}{${value.account_id}, ${value.account_balance}, ${value.eth_received}, ${value.eth_sent}}`);
//     }
// })
// .catch(err => console.log(err));