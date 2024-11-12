import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.json() as Stripe.Event
  console.log("EVENT", body.type);
  const session = await body.data.object as Stripe.Checkout.Session;
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );
  switch (body.type) {
    case 'checkout.session.completed':
      
      console.log("subscription found", subscription);
      
      const createdSubscription = await prisma.subscription.create({
        data: {
          userId: subscription.metadata.userId,
          stripeSubscriptionId: subscription.id as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
          status: subscription.status,
        },
      });
      console.log("created : ", createdSubscription);
      
      break;
    case 'invoice.payment_succeeded':

      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
    default:
      break;
  }

  return new NextResponse(null, { status: 200 });
}