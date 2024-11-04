import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

const updateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const validatedFields = updateSchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse('Invalid input data', { status: 400 });
    }

    const { name, email, currentPassword, newPassword } = validatedFields.data;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.password) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return new NextResponse('Invalid current password', { status: 400 });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return new NextResponse('Email already in use', { status: 400 });
      }
    }

    // Update user data
    const updateData: any = {
      name,
      email,
    };

    // If new password is provided, hash and update it
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile update error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}