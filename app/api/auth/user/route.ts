export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyFirebaseToken } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(request);
    if (!uid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user by Firebase UID
    const user = await prisma.user.findUnique({
      where: { id: uid },
      include: {
        children: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

