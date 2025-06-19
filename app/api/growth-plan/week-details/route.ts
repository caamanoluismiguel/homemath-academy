
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateWeekDetails } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { planId, weekNumber, childId } = await request.json();

    if (!planId || !weekNumber || !childId) {
      return NextResponse.json(
        { error: 'Plan ID, week number, and child ID are required' },
        { status: 400 }
      );
    }

    // Check if week details already exist
    let weekDetail = await prisma.weekDetail.findUnique({
      where: {
        planId_weekNumber: {
          planId,
          weekNumber,
        },
      },
      include: {
        dailyLessonDetails: {
          orderBy: { dayNumber: 'asc' },
        },
      },
    });

    if (!weekDetail || !weekDetail.isGenerated) {
      // Generate new week details
      const child = await prisma.child.findUnique({
        where: { id: childId },
      });

      const growthPlan = await prisma.growthPlan.findUnique({
        where: { id: planId },
      });

      if (!child || !growthPlan) {
        return NextResponse.json(
          { error: 'Child or growth plan not found' },
          { status: 404 }
        );
      }

      const planStructure = growthPlan.planStructure as any[];
      const weekPlan = planStructure.find((w: any) => w.weekNumber === weekNumber);

      if (!weekPlan) {
        return NextResponse.json(
          { error: 'Week plan not found' },
          { status: 404 }
        );
      }

      // Convert Prisma child to our Child type
      const childData = {
        id: child.id,
        userId: child.userId,
        name: child.name,
        birthDate: child.birthDate?.toISOString(),
        preferredGrade: child.preferredGrade,
        preferredLang: child.preferredLang as 'en' | 'es',
      };

      const weekDetailsData = await generateWeekDetails(
        weekNumber, 
        weekPlan.mathConcept, 
        weekPlan.theology || '', 
        child.preferredGrade, 
        child.preferredLang as any
      );

      if (weekDetail) {
        // Update existing
        weekDetail = await prisma.weekDetail.update({
          where: { id: weekDetail.id },
          data: {
            weekTheme: weekDetailsData.weekTheme,
            theology: weekDetailsData.theology,
            dailyLessons: weekDetailsData.dailyLessons as any,
            isGenerated: true,
          },
          include: {
            dailyLessonDetails: {
              orderBy: { dayNumber: 'asc' },
            },
          },
        });

        // Create daily lesson details if they don't exist
        for (const lesson of weekDetailsData.dailyLessons) {
          const existingLesson = await prisma.dailyLessonDetail.findUnique({
            where: {
              weekDetailId_dayNumber: {
                weekDetailId: weekDetail.id,
                dayNumber: lesson.dayNumber,
              },
            },
          });

          if (!existingLesson) {
            await prisma.dailyLessonDetail.create({
              data: {
                weekDetailId: weekDetail.id,
                dayNumber: lesson.dayNumber,
                dayTitle: lesson.dayTitle,
                devotional: lesson.devotional,
                learningObjective: lesson.learningObjective,
                definition: lesson.definition,
                explanation: lesson.conceptExplanation,
                guidedExamples: lesson.guidedExamples,
                mainExercises: lesson.mainExercises,
                commonMistakes: lesson.commonMistakes,
                parentDiscussion: lesson.parentDiscussion,
                homework: lesson.homework,
                closingEncouragement: lesson.closingEncouragement,
              },
            });
          }
        }
      } else {
        // Create new
        weekDetail = await prisma.weekDetail.create({
          data: {
            planId,
            weekNumber,
            mathConcept: weekPlan.mathConcept,
            weekTheme: weekDetailsData.weekTheme,
            theology: weekDetailsData.theology,
            dailyLessons: weekDetailsData.dailyLessons as any,
            isGenerated: true,
          },
          include: {
            dailyLessonDetails: {
              orderBy: { dayNumber: 'asc' },
            },
          },
        });

        // Create daily lesson details
        for (const lesson of weekDetailsData.dailyLessons) {
          await prisma.dailyLessonDetail.create({
            data: {
              weekDetailId: weekDetail.id,
              dayNumber: lesson.dayNumber,
              dayTitle: lesson.dayTitle,
              devotional: lesson.devotional,
              learningObjective: lesson.learningObjective,
              definition: lesson.definition,
              explanation: lesson.conceptExplanation,
              guidedExamples: lesson.guidedExamples,
              mainExercises: lesson.mainExercises,
              commonMistakes: lesson.commonMistakes,
              parentDiscussion: lesson.parentDiscussion,
              homework: lesson.homework,
              closingEncouragement: lesson.closingEncouragement,
            },
          });
        }

        // Fetch the updated week detail with daily lesson details
        weekDetail = await prisma.weekDetail.findUnique({
          where: { id: weekDetail.id },
          include: {
            dailyLessonDetails: {
              orderBy: { dayNumber: 'asc' },
            },
          },
        });
      }
    }

    return NextResponse.json({ weekDetail });
  } catch (error) {
    console.error('Generate week details error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
