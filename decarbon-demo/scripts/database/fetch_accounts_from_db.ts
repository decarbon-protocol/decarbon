import { Account } from "../interfaces";
import { PrismaClient } from "@prisma/client";
import { utils } from "ethers";
import { prisma } from ".";
import { output } from "../utils";

export default async function fetch_accounts_from_db(_addressList: Set<string>)
    : Promise<boolean> {
    try {
        // console.log(`\tFetching accounts from database...`);
        output(`\tFetching accounts from database...`);
        const rows = await prisma.d_account.findMany();
        console.log(rows);
        // console.log(`\tDone! Number of accounts: ${rows.length}`);
        // console.log(`\tSetting up account map...`);
        output(`\tDone! Number of accounts: ${rows.length}`);
        output(`\tSetting up account map...`);
        for (const account of rows) {
            _addressList.add(account.address);
        }
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
// let addressList: string[] = [];
// fetch_accounts_from_db(addressList)
//     .then(success => {
//         if (success) {
//             console.log(addressList.length);
//             for (const address of addressList) {
//                 console.log(address);
//             }
//         }
//     })
//     .catch(err => console.log(err));