
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const { childId } = params;

    // Get all quiz attempts for the child
    const attempts = await prisma.quizAttempt.findMany({
      where: { 
        childId,
        completed: true
      },
      include: {
        quiz: true
      },
      orderBy: { completedAt: 'asc' }
    });

    // Get badges
    const badges = await prisma.badge.findMany({
      where: { childId },
      orderBy: { earnedAt: 'desc' }
    });

    // Calculate analytics
    const totalQuizzesCompleted = attempts.length;
    const averageScore = totalQuizzesCompleted > 0 
      ? attempts.reduce((sum: number, attempt: any) => sum + attempt.score, 0) / totalQuizzesCompleted 
      : 0;

    // Calculate improvement trend
    let improvementTrend = 0;
    if (attempts.length >= 2) {
      const firstHalf = attempts.slice(0, Math.ceil(attempts.length / 2));
      const secondHalf = attempts.slice(Math.ceil(attempts.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((sum: number, a: any) => sum + a.score, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum: number, a: any) => sum + a.score, 0) / secondHalf.length;
      
      improvementTrend = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    }

    // Group by week for weekly progress
    const weeklyProgress = attempts.reduce((acc: any[], attempt: any) => {
      const existing = acc.find(w => w.weekNumber === attempt.quiz.weekNumber);
      
      if (existing) {
        existing.attempts++;
        existing.scores.push(attempt.score);
        existing.lastAttemptDate = attempt.completedAt;
      } else {
        acc.push({
          weekNumber: attempt.quiz.weekNumber,
          mathConcept: attempt.quiz.mathConcept,
          attempts: 1,
          scores: [attempt.score],
          completed: true,
          lastAttemptDate: attempt.completedAt
        });
      }
      
      return acc;
    }, []).map((week: any) => ({
      ...week,
      bestScore: Math.max(...week.scores),
      averageScore: week.scores.reduce((sum: number, score: number) => sum + score, 0) / week.scores.length,
      improvement: week.scores.length > 1 
        ? ((week.scores[week.scores.length - 1] - week.scores[0]) / week.scores[0]) * 100 
        : 0
    }));

    // Calculate strong and weak areas
    const conceptScores = attempts.reduce((acc: any, attempt: any) => {
      const concept = attempt.quiz.mathConcept;
      if (!acc[concept]) {
        acc[concept] = [];
      }
      acc[concept].push(attempt.score);
      return acc;
    }, {});

    const conceptAverages = Object.entries(conceptScores).map(([concept, scores]: [string, any]) => ({
      concept,
      average: scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
    }));

    conceptAverages.sort((a, b) => b.average - a.average);
    
    const strongAreas = conceptAverages.slice(0, 3).map(c => c.concept);
    const weakAreas = conceptAverages.slice(-3).map(c => c.concept);

    // Calculate consistency score (lower standard deviation = higher consistency)
    const scores = attempts.map((a: any) => a.score);
    const variance = scores.length > 1 
      ? scores.reduce((sum: number, score: number) => sum + Math.pow(score - averageScore, 2), 0) / scores.length
      : 0;
    const standardDeviation = Math.sqrt(variance);
    const consistencyScore = Math.max(0, 100 - standardDeviation);

    // Calculate current streak
    let streakCount = 0;
    for (let i = attempts.length - 1; i >= 0; i--) {
      if (attempts[i].score >= 70) { // 70% threshold for streak
        streakCount++;
      } else {
        break;
      }
    }

    const analytics = {
      totalQuizzesCompleted,
      averageScore: Math.round(averageScore * 100) / 100,
      improvementTrend: Math.round(improvementTrend * 100) / 100,
      strongAreas,
      weakAreas,
      consistencyScore: Math.round(consistencyScore * 100) / 100,
      streakCount,
      badges,
      weeklyProgress
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching quiz analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
