
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateDailyLesson } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { weekDetailId, dayNumber, mathConcept, childGrade, language = 'en' } = await request.json();

    if (!weekDetailId || !dayNumber || !mathConcept || !childGrade) {
      return NextResponse.json(
        { error: 'Week detail ID, day number, math concept, and child grade are required' },
        { status: 400 }
      );
    }

    // Check if daily lesson detail already exists
    let dailyLessonDetail = await prisma.dailyLessonDetail.findUnique({
      where: {
        weekDetailId_dayNumber: {
          weekDetailId,
          dayNumber,
        },
      },
    });

    if (!dailyLessonDetail) {
      // Generate new daily lesson detail
      const lessonData = await generateDailyLesson(
        1, // weekNumber - not critical for generation
        dayNumber,
        mathConcept,
        '', // theology - will be generated
        childGrade,
        language
      );

      // Create new daily lesson detail
      dailyLessonDetail = await prisma.dailyLessonDetail.create({
        data: {
          weekDetailId,
          dayNumber,
          dayTitle: lessonData.dayTitle,
          devotional: lessonData.devotional,
          learningObjective: lessonData.learningObjective,
          definition: lessonData.definition,
          explanation: lessonData.conceptExplanation,
          guidedExamples: lessonData.guidedExamples,
          mainExercises: lessonData.mainExercises,
          commonMistakes: lessonData.commonMistakes,
          parentDiscussion: lessonData.parentDiscussion,
          homework: lessonData.homework,
          closingEncouragement: lessonData.closingEncouragement,
        },
      });
    }

    return NextResponse.json({ dailyLessonDetail });
  } catch (error) {
    console.error('Generate daily lesson error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { dailyLessonId, isCompleted } = await request.json();

    if (!dailyLessonId || typeof isCompleted !== 'boolean') {
      return NextResponse.json(
        { error: 'Daily lesson ID and completion status are required' },
        { status: 400 }
      );
    }

    const updatedLesson = await prisma.dailyLessonDetail.update({
      where: { id: dailyLessonId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    return NextResponse.json({ dailyLessonDetail: updatedLesson });
  } catch (error) {
    console.error('Update daily lesson completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
