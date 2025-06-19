
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const weekNumber = searchParams.get('weekNumber');

    if (!childId) {
      return NextResponse.json(
        { error: 'Child ID is required' },
        { status: 400 }
      );
    }

    // Get progress logs for the child
    const whereClause: any = { childId };
    if (weekNumber) {
      whereClause.weekNumber = parseInt(weekNumber);
    }

    const progressLogs = await prisma.progressLog.findMany({
      where: whereClause,
      orderBy: [
        { weekNumber: 'asc' },
        { dayNumber: 'asc' },
        { completedAt: 'desc' }
      ],
    });

    // Get daily lesson completion status
    const growthPlan = await prisma.growthPlan.findFirst({
      where: { childId },
      include: {
        weekDetails: {
          include: {
            dailyLessonDetails: true,
          },
        },
      },
    });

    const dailyProgress = growthPlan?.weekDetails.map((week: any) => ({
      weekNumber: week.weekNumber,
      mathConcept: week.mathConcept,
      dailyLessons: week.dailyLessonDetails.map((lesson: any) => ({
        dayNumber: lesson.dayNumber,
        dayTitle: lesson.dayTitle,
        isCompleted: lesson.isCompleted,
        completedAt: lesson.completedAt,
      })),
    })) || [];

    return NextResponse.json({ 
      progressLogs,
      dailyProgress,
    });
  } catch (error) {
    console.error('Get daily progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      childId, 
      weekNumber, 
      dayNumber, 
      activity, 
      timeSpent, 
      mastery, 
      notes 
    } = await request.json();

    if (!childId || !weekNumber || !dayNumber || !activity || !mastery) {
      return NextResponse.json(
        { error: 'Child ID, week number, day number, activity, and mastery level are required' },
        { status: 400 }
      );
    }

    const progressLog = await prisma.progressLog.create({
      data: {
        childId,
        weekNumber,
        dayNumber,
        activity,
        timeSpent,
        mastery,
        notes,
      },
    });

    return NextResponse.json({ progressLog });
  } catch (error) {
    console.error('Create progress log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
