
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateInsightReport } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { childId, gradeLevel, responses } = await request.json();

    if (!childId || !gradeLevel || !responses) {
      return NextResponse.json(
        { error: 'Child ID, grade level, and responses are required' },
        { status: 400 }
      );
    }

    // Calculate score
    const totalQuestions = responses.length;
    let correctAnswers = 0;

    // Simple scoring logic - in real app, this would be more sophisticated
    responses.forEach((response: any) => {
      // This is a simplified scoring - you'd want more sophisticated logic
      if (response.answer && response.answer.toString().trim() !== '') {
        correctAnswers++;
      }
    });

    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Save test result
    const testResult = await prisma.placementTestResult.create({
      data: {
        childId,
        gradeLevel,
        responses,
        score,
        completed: true,
      },
    });

    // Generate insight report
    const child = await prisma.child.findUnique({
      where: { id: childId },
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
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

    // Convert Prisma test result to our PlacementTestResult type
    const testResultData = {
      id: testResult.id,
      childId: testResult.childId,
      gradeLevel: testResult.gradeLevel,
      responses: testResult.responses as any,
      score: testResult.score || undefined,
      completed: testResult.completed,
      dateCompleted: testResult.dateCompleted.toISOString(),
    };

    const insightData = await generateInsightReport(testResultData, child.preferredGrade, child.preferredLang as any);

    const insightReport = await prisma.insightReport.create({
      data: {
        childId,
        testId: testResult.id,
        strengths: insightData.strengths,
        weaknesses: insightData.weaknesses,
        gradeEquivalence: insightData.gradeEquivalence,
        commonErrors: insightData.commonErrors,
        theologyNote: insightData.theologyNote,
        aiSummary: insightData.aiSummary,
      },
    });

    return NextResponse.json({ 
      testResult, 
      insightReport,
      success: true 
    });
  } catch (error) {
    console.error('Submit test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
