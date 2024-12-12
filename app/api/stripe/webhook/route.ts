import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';
import { PLANS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body as Stripe.Event;

    console.log("EVENT", event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (!session?.subscription) {
          return new NextResponse(JSON.stringify({ received: true }));
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0].price.id;
        
        // Check if user already has a subscription and cancel it in Stripe
        const existingSubscription = await prisma.subscription.findFirst({
          where: {
            userId: subscription.metadata.userId,
          },
        });

        if (existingSubscription) {
          // Cancel the old subscription in Stripe
          try {
            await stripe.subscriptions.cancel(existingSubscription.stripeSubscriptionId);
          } catch (error) {
            console.error('Error canceling old subscription:', error);
          }

          // Delete from database
          await prisma.subscription.delete({
            where: {
              id: existingSubscription.id,
            },
          });
        }

        // Create new subscription
        await prisma.subscription.create({
          data: {
            userId: subscription.metadata.userId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            status: subscription.status,
          },
        });

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (!invoice.subscription) {
          return new NextResponse(JSON.stringify({ received: true }));
        }

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const newPriceId = subscription.items.data[0].price.id;
        const newPlan = Object.values(PLANS).find(p => p.priceId === newPriceId);

        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripePriceId: newPriceId,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });

        //  ajout de crédits
        if (newPlan) {
          const user = await prisma.user.findUnique({
            where: { id: subscription.metadata.userId },
            select: { credits: true }
          });

          await prisma.user.update({
            where: {
              id: subscription.metadata.userId,
            },
            data: {
              credits: (user?.credits || 0) + newPlan.credits,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await prisma.subscription.delete({
          where: {
            stripeSubscriptionId: subscription.id,
          },
        });
        break;
      }
    }

    return new NextResponse(JSON.stringify({ received: true }));
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 400 }
    );
  }
}