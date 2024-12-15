import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getAuthSession();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        credits: true,
        name: true,
        email: true
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USER_CREDITS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 