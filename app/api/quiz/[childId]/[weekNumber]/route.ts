
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { childId: string; weekNumber: string } }
) {
  try {
    const { childId, weekNumber } = params;

    const quiz = await prisma.weeklyQuiz.findUnique({
      where: {
        childId_weekNumber: {
          childId,
          weekNumber: parseInt(weekNumber)
        }
      },
      include: {
        attempts: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
