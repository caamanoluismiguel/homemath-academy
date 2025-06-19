
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateQuizQuestions } from '@/lib/ai-service';
import { Language } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { childId, weekNumber, mathConcept } = await request.json();

    if (!childId || !weekNumber || !mathConcept) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if quiz already exists
    const existingQuiz = await prisma.weeklyQuiz.findUnique({
      where: {
        childId_weekNumber: {
          childId,
          weekNumber: parseInt(weekNumber)
        }
      }
    });

    if (existingQuiz) {
      return NextResponse.json({ quiz: existingQuiz });
    }

    // Get child info for context
    const child = await prisma.child.findUnique({
      where: { id: childId }
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 }
      );
    }

    // Generate quiz questions using AI
    const questions = await generateQuizQuestions(mathConcept, child.preferredGrade, parseInt(weekNumber), child.preferredLang as Language);

    // Create the quiz
    const quiz = await prisma.weeklyQuiz.create({
      data: {
        childId,
        weekNumber: parseInt(weekNumber),
        mathConcept,
        questions: questions as any,
        totalQuestions: questions.length
      }
    });

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
