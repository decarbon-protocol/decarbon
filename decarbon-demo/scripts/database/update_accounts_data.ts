import { prisma } from "./";
import { Account } from "../interfaces";

export default async function update_account_data(_addressToAccount: Map<string, Account>)
: Promise<boolean> {
    try {
        console.log("\tUpdating account data in database...");
        // do something here
        console.log("\tDone!");
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Testing