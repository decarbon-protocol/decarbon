import { PrismaClient } from "@prisma/client";
import fetch_accounts_from_db from "./fetch_accounts_from_db";
import insert_transactions  from "./insert_transactions";
import update_account_data from "./update_accounts_data";
import { output } from "../utils";

/**
 * @notice setup a connected prisma client
 */
const prisma = new PrismaClient();

async function disconnectDb() {
    output("Disconnecting Prisma client...");
    await prisma.$disconnect();
    output("Done!");
}

export { prisma, disconnectDb };
export { fetch_accounts_from_db };
export { insert_transactions };
export { update_account_data };