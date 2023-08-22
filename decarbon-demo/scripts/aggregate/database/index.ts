import "dotenv/config";
import { Pool, QueryResult } from "pg";
import { log } from "../../utils";
import { dim_account } from "./dim_account";
import { dim_transaction } from "./dim_transaction";

const logPath: string = "data/database/index.log";

/**
 * @notice Configure db connection
 */
const db__username: string = process.env.POSTGRESQL_USERNAME ?? "";
const db__password: string = process.env.POSTGRESQL_PASSWORD ?? "";
const db__database: string = process.env.POSTGRESQL_DATABASE ?? "";
const db__host: string = process.env.POSTGRESQL_HOST ?? "";
const db__port: number | any = process.env.POSTGRESQL_PORT ?? "";
if (
    db__username === "" ||
    db__password === "" ||
    db__database === "" ||
    db__host === "" ||
    db__port === ""
) {
    throw new Error(
        "Environment values: POSTGRESQL_USERNAME, POSTGRESQL_PASSWORD, POSTGRESQL_DATABASE, POSTGRESQL_HOST and POSTGRESQL_PORT are required"
    );
}

const pool = new Pool({
    user: db__username,
    host: db__host,
    database: db__database,
    password: db__password,
    port: db__port
});

async function testConnection()
:Promise<void> {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT NOW()");
        console.log(`${result}\nDB Connection Okay`);
        client.release();
    } catch (err) {
        throw new Error(`Connection error: ${err}`);
    }
}

async function endConnection()
: Promise<void> {
    try {
        await pool.end();
    } catch (err) {
        throw new Error(`endConnection() error: ${err}`);
    }
}

/**
 * @notice export frequently used functions
 */
export { pool, testConnection, endConnection };
export { dim_account, dim_transaction }
// Testing
// testConnection();