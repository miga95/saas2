import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { absoluteUrl } from '@/lib/utils';

const returnUrl = absoluteUrl('/profile');

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.subscription) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }
    
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId!,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}