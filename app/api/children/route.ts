
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const children = await prisma.child.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ children });
  } catch (error) {
    console.error('Get children error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, birthDate, preferredGrade, preferredLang } = await request.json();

    if (!userId || !name || !preferredGrade) {
      return NextResponse.json(
        { error: 'User ID, name, and preferred grade are required' },
        { status: 400 }
      );
    }

    const child = await prisma.child.create({
      data: {
        userId,
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        preferredGrade,
        preferredLang: preferredLang || 'en',
      },
    });

    return NextResponse.json({ child });
  } catch (error) {
    console.error('Create child error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
