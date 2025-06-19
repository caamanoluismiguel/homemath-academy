
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateGrowthPlan } from '@/lib/ai-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const { childId } = params;

    let growthPlan = await prisma.growthPlan.findFirst({
      where: { childId },
      orderBy: { createdAt: 'desc' },
      include: {
        weekDetails: {
          orderBy: { weekNumber: 'asc' },
        },
      },
    });

    if (!growthPlan) {
      // Generate new growth plan if none exists
      const child = await prisma.child.findUnique({
        where: { id: childId },
      });

      const insightReport = await prisma.insightReport.findFirst({
        where: { childId },
        orderBy: { createdAt: 'desc' },
      });

      if (!child || !insightReport) {
        return NextResponse.json(
          { error: 'Child or insight report not found' },
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

      // Convert Prisma insight report to our InsightReport type
      const insightReportData = {
        id: insightReport.id,
        childId: insightReport.childId,
        testId: insightReport.testId,
        strengths: insightReport.strengths,
        weaknesses: insightReport.weaknesses,
        gradeEquivalence: insightReport.gradeEquivalence,
        commonErrors: insightReport.commonErrors,
        theologyNote: insightReport.theologyNote,
        aiSummary: insightReport.aiSummary,
        pdfUrl: insightReport.pdfUrl || undefined,
        createdAt: insightReport.createdAt.toISOString(),
      };

      const planStructure = await generateGrowthPlan(insightReportData, child.preferredGrade, child.preferredLang as any);

      growthPlan = await prisma.growthPlan.create({
        data: {
          childId,
          reportId: insightReport.id,
          planStructure: planStructure as any,
        },
        include: {
          weekDetails: true,
        },
      });
    }

    return NextResponse.json({ growthPlan });
  } catch (error) {
    console.error('Get growth plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
