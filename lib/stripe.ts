import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 100,
    credits: 10,
    priceId: "price_1QGSiCA0g4fLWq2DrHowZGLd",
    features: [
      'Basic AI content generation',
      '10 credits per month',
      'Standard support',
    ],
  },
  premium: {
    name: 'Premium',
    price: 200,
    credits: 20,
    priceId: "price_1QGSidA0g4fLWq2Dvyl0qLja",
    features: [
      'Advanced AI content generation',
      '20 credits per month',
      'Priority support',
      'Custom avatars',
    ],
  },
  business: {
    name: 'Business',
    price: 1000,
    credits: 50,
    priceId: "price_1QGSjAA0g4fLWq2DnPp1a7r4",
    features: [
      'Enterprise AI content generation',
      '50 credits per month', 
      'Custom avatars & branding',
      'API access',
    ],
  },
};