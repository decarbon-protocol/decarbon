import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { LineChartData, LineChartDataItem } from "@/app/types/api.model";
import { format } from "path";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

(BigInt.prototype as any).toJSON = function () {
  return String(this);
};

export async function GET({ url }: NextRequest) {
  const searchParams = url && new URL(url).searchParams;
  const from = (searchParams && searchParams.get("from")) || "2023-05-29";
  const to = (searchParams && searchParams.get("to")) || "2023-06-08";
  const result: LineChartData =
    await prisma.$queryRaw`SELECT * FROM get_line_chart_data(${from}, ${to})`;
  return NextResponse.json(result);
}
