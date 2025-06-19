
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Find or create user (mockup authentication)
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        children: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          subscription: 'trial', // Start with trial
        },
        include: {
          children: true,
        },
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
