import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
export async function GET() {
  // const result = await prisma.blocks.findMany();
  const result = null // test by Phuc for Vercel Delployment
  return NextResponse.json(result);
}
