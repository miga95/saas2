import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 100,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      'Basic AI content generation',
      'Up to 10 videos per month',
      'Standard support',
    ],
  },
  premium: {
    name: 'Premium',
    price: 200,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    features: [
      'Advanced AI content generation',
      'Up to 50 videos per month',
      'Priority support',
      'Custom avatars',
    ],
  },
  business: {
    name: 'Business',
    price: 1000,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
    features: [
      'Enterprise AI content generation',
      'Unlimited videos',
      '24/7 Premium support',
      'Custom avatars & branding',
      'API access',
    ],
  },
};