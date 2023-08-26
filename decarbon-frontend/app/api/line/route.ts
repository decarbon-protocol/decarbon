import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { LineChartData } from "@/app/types/api.model";
import { NextApiRequest } from "next";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

(BigInt.prototype as any).toJSON = function () {
  return String(this);
};

export async function GET(req: NextApiRequest) {
  const { from = "2023-08-26", to = "2023-08-28" } = req.query || {};
  const result: LineChartData =
    await prisma.$queryRaw`SELECT * FROM get_line_chart_data(${from}, ${to})`;
  return NextResponse.json(result);
}
