import { NextResponse } from "next/server";

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

export async function GET() {
  const result: LineChartData =
    await prisma.$queryRaw`SELECT * FROM get_bubble_chart_data()`;
  return NextResponse.json(result);
}
