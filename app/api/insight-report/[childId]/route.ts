
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const { childId } = params;

    const insightReport = await prisma.insightReport.findFirst({
      where: { childId },
      orderBy: { createdAt: 'desc' },
      include: {
        testResult: true,
      },
    });

    if (!insightReport) {
      return NextResponse.json(
        { error: 'No insight report found for this child' },
        { status: 404 }
      );
    }

    return NextResponse.json({ insightReport });
  } catch (error) {
    console.error('Get insight report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
