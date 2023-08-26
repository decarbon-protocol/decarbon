import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { LineChartData } from "@/app/types/api.model";
import { groupBy } from "lodash";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

(BigInt.prototype as any).toJSON = function () {
  return String(this);
};

export async function GET() {
  const result: LineChartData =
    await prisma.$queryRaw`SELECT * FROM get_line_chart_data('2023-08-26', '2023-08-28')`;
  return NextResponse.json(result);
}
