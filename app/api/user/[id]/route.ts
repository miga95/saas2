import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        subscription: {
          select: {
            credits: true
          }
        }
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USER_GET_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 