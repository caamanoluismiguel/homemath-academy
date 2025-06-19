
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const { name, birthDate, preferredGrade, preferredLang } = await request.json();
    const { childId } = params;

    const child = await prisma.child.update({
      where: { id: childId },
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        preferredGrade,
        preferredLang,
      },
    });

    return NextResponse.json({ child });
  } catch (error) {
    console.error('Update child error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const { childId } = params;

    await prisma.child.delete({
      where: { id: childId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete child error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
