import { Pool, QueryResult, PoolConfig } from "pg";
import { genEthAddress } from "../../utils";
import { log } from "../../utils";

const logPath: string = "data/logs/database.log";
export const TABLE: string = "DIM_INDIVIDUAL_STATS";

export const pool = new Pool({
    user: "ducmint",
    host: "localhost",
    database: "minhdb",
    password: "dm",
    port: 5432
} as PoolConfig)

async function testConnection()
:Promise<void> {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT NOW()");
        log(`${result}\nDB Connection Okay`, logPath);
        client.release();
    } catch (err) {
        throw new Error(`Connection error: ${err}`);
    }
}

export async function showAllRows()
: Promise<void> {
    try {
        const query: string = `SELECT * FROM "${TABLE}"`;
        const result: QueryResult = await pool.query(query);
        log(result.command, logPath);
        console.log(result.rows);
    } catch (err) {
        throw new Error(`showAllRows() error: ${err}`);
    }
}

export async function showRow(address: string)
: Promise<void> {
    try {
        const query: string = `SELECT * FROM "${TABLE}" WHERE "address" = $1`;
        const values: any[] = [address];
        const result: QueryResult = await pool.query(query, values);
        log(result.command, logPath);
        console.log(result.rows[0]);
    } catch (err) {
        throw new Error(`getRow() error: ${err}`);
    }
}

export async function getAllRows() 
: Promise<Record<string, string | number | bigint>[]> {
    try {
        const query: string = `SELECT * FROM "${TABLE}"`;
        const result: QueryResult = await pool.query(query);
        log(result.command, logPath);
        return result.rows;
    } catch (err) {
        throw new Error(`getAllRows() error: ${err}`);
    }
}

export async function getRow(address: string)
: Promise<Record<string, string | number | bigint>> {
    try {
        const query: string = `SELECT * FROM "${TABLE}" WHERE "address" = $1`;
        const values: any[] = [address];
        const result: QueryResult = await pool.query(query, values);
        log(result.command, logPath);
        return result.rows[0];
    } catch (err) {
        throw new Error(`getRow() error: ${err}`);
    }
}

export async function insertRow(address: string, kWh: number, kgCO2e: number, txMadeInEpoch: number, txFeePaidIneEpoch: number, epochNumber: bigint)
: Promise<void> {
    try {
        const query: string = `INSERT INTO "${TABLE}" ("address", "kWh", "kgCO2e", "txMadeInEpoch", "txFeePaidInEpoch", "epochNumber") VALUES ($1, $2, $3, $4, $5, $6)`;
        const values: any[] = [address, kWh, kgCO2e, txMadeInEpoch, txFeePaidIneEpoch, epochNumber];
        const result: QueryResult = await pool.query(query, values);
        log(result.command, logPath);
    } catch (err) {
        throw new Error(`insertRow() error: ${err}`);
    }
}

export async function clearTable() 
: Promise<void> {
    try {
        const query: string = `DELETE FROM "${TABLE}"`;
        const result: QueryResult = await pool.query(query);
        log(result.command, logPath);
    } catch (err) {
        throw new Error(`clearTable() error: ${err}`);
    }
}

export async function endConnection()
: Promise<void> {
    try {
        await pool.end();
    } catch (err) {
        throw new Error(`endConnection() error: ${err}`);
    }
}

// Testing
async function test() {
    await  clearTable();
    console.log("Generating mock address");
    const mocks: string[] = genEthAddress(500);
    console.log("Done");
    const kWh: number = 100
    const kgCO2e: number = 100;
    const txMadeInEpoch: number = 420;
    const txFeePaidIneEpoch: number = 0.42;
    const epochNumber: bigint = BigInt("1050862004");
    
    console.log("Inserting to db");
    mocks.forEach((address) => {
        Promise.all([
            insertRow(address, kWh, kgCO2e, txMadeInEpoch, txFeePaidIneEpoch, epochNumber)
        ]);  
    });
    console.log("Done");
    console.log("Result:\n");
    const rows: Record<string, string | number | bigint>[] = await getAllRows();
    console.log(JSON.stringify(rows, null, 2));
}

// test().catch(err => console.log(err));