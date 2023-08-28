import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { LineChartData } from "@/app/types/api.model";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

(BigInt.prototype as any).toJSON = function () {
  return String(this);
};

// export async function GET({ url }: NextRequest) {
//   const searchParams = url && new URL(url).searchParams;
//   const from = (searchParams && searchParams.get("from")) || "2023-05-29";
//   const to = (searchParams && searchParams.get("to")) || "2023-06-08";
//   const result: LineChartData =
//     await prisma.$queryRaw`SELECT * FROM get_line_chart_data(${from}, ${to})`;
//   return NextResponse.json(result);
// }

// commit by Minh: support individual address query
export async function GET({ url }: NextRequest) {
    const searchParams = url && new URL(url).searchParams;
    const from = (searchParams && searchParams.get("from")) || "2023-05-29";
    const to = (searchParams && searchParams.get("to")) || "2023-06-08";
    const addressList = searchParams && searchParams.getAll("address");
    if (addressList.length <= 0) {
        return NextResponse.json(null);
    }
      
    try {

        const transactions: Record<string, any>[] = await prisma.$queryRaw`
        SELECT * FROM get_transactions(${from}::date, ${to}::date, ${addressList})
    `;
    console.log(transactions) // debug
    // create lineDataItem[] from transactions
    let emissionsMap = new Map<string, number>();
    for (const txn of transactions) {
        let val = emissionsMap.get(txn.t_from_address);
        emissionsMap.set(txn.t_from_address, val == null ? 0 : val + txn.t_emission_by_transaction);
        val = emissionsMap.get(txn.t_to_address);
        emissionsMap.set(txn.t_to_address, val == null ? 0 : val + txn.t_emission_by_balance);
    }
    let result: LineChartData = [];
    let currDate = new Date().toLocaleDateString('en-US');
    for (const _address of Array.from(emissionsMap.keys())) {
        result.push({
            address: _address,
            ghg_emission: emissionsMap.get(_address)?.toString() as string,
            date_actual: currDate,
        })
    }
    console.log(result);
    return NextResponse.json(result);
    } catch (err) {
        console.error(`GET method of api/line: ${err}`);
    }
}  