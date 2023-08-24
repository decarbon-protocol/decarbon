import { Account } from "../interfaces";
import { PrismaClient } from "@prisma/client";
import { utils } from "ethers";
import { prisma } from ".";
import { output } from "../utils";

export default async function fetch_accounts_from_db(_addressToAccount: Map<string, Account>)
    : Promise<boolean> {
    try {
        // console.log(`\tFetching accounts from database...`);
        output(`\tFetching accounts from database...`);
        const rows = await prisma.d_account.findMany();
        // console.log(`\tDone! Number of accounts: ${rows.length}`);
        // console.log(`\tSetting up account map...`);
        output(`\tDone! Number of accounts: ${rows.length}`);
        output(`\tSetting up account map...`);
        rows.forEach(row => {
            const account: Account = {
                account_id: row.account_id,
                address: row.address,
                eth_received: parseFloat(row.eth_received!.toString()),
                eth_sent: parseFloat(row.eth_sent!.toString())
                // account_balance: utils.parseEther(row.account_balance!.toString()).toBigInt(),
            };
            _addressToAccount.set(row.address as string, account); // Update the Map directly
        });
        // console.log("\tDone!\n");
        output("\tDone!\n");
        return true;
    } catch (err) {
        // console.error(`setup_account_map(): ${err}`);
        output(`setup_account_map(): ${err}`);
        return false;
    }
}

// Testing
// let addressToAccont: Map<string, Account> = new Map<string, Account>();
// fetch_accounts_from_db(addressToAccont)
//     .then(success => {
//         if (success) {
//             console.log(addressToAccont.size);
//             for (const [key, value] of addressToAccont) {
//                 console.log(`Address: ${key}{${value.account_id}, ${value.eth_received}, ${value.eth_sent}}`);
//             }
//         }
//     })
//     .catch(err => console.log(err));