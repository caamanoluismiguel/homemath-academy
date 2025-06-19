
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, formType } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        subject: subject || '',
        message,
        formType: formType || 'general',
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been received. We\'ll get back to you soon!' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
