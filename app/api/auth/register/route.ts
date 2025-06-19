export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyFirebaseToken, getFirebaseUserEmail } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(request);
    if (!uid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Create user in our database with Firebase UID
    const user = await prisma.user.create({
      data: {
        id: uid, // Use Firebase UID as our user ID
        email,
        name,
        subscription: 'trial',
      },
      include: {
        children: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

