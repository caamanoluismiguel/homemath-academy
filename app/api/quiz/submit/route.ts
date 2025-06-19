
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateQuizFeedback, checkForBadges } from '@/lib/ai-service';
import { Language } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { quizId, childId, responses, timeSpent } = await request.json();

    if (!quizId || !childId || !responses) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the quiz with questions
    const quiz = await prisma.weeklyQuiz.findUnique({
      where: { id: quizId }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get child data for AI feedback
    const child = await prisma.child.findUnique({
      where: { id: childId }
    });

    if (!child) {
      return NextResponse.json(
        { error: 'Child not found' },
        { status: 404 }
      );
    }

    const questions = quiz.questions as any[];
    
    // Calculate score and process responses
    let correctAnswers = 0;
    const processedResponses = responses.map((response: any) => {
      const question = questions.find(q => q.id === response.questionId);
      const isCorrect = question && question.correctAnswer.toLowerCase().trim() === response.answer.toLowerCase().trim();
      
      if (isCorrect) correctAnswers++;
      
      return {
        ...response,
        isCorrect
      };
    });

    const score = (correctAnswers / questions.length) * 100;

    // Get attempt number
    const previousAttempts = await prisma.quizAttempt.count({
      where: { quizId, childId }
    });

    // Generate AI feedback
    const feedback = await generateQuizFeedback(
      processedResponses,
      score,
      quiz.mathConcept,
      child.preferredGrade,
      child.preferredLang as Language
    );

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        childId,
        responses: processedResponses,
        score,
        timeSpent: timeSpent || null,
        completed: true,
        attemptNumber: previousAttempts + 1,
        feedback,
        completedAt: new Date()
      }
    });

    // Check for new badges
    const newBadges = await checkForBadges(childId, quiz.weekNumber, score, attempt.attemptNumber);
    
    // Award badges if any
    if (newBadges.length > 0) {
      await prisma.badge.createMany({
        data: newBadges.map(badge => ({
          ...badge,
          childId
        }))
      });
    }

    return NextResponse.json({ 
      attempt,
      newBadges,
      score,
      correctAnswers,
      totalQuestions: questions.length
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
