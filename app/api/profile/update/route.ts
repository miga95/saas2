import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-check';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  const session = await checkAuth();
  
  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: body,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}