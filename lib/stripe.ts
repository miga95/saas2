import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 69,
    credits: 25,
    priceId: "price_1QIzwYA0g4fLWq2DewEG6bth",
    features: [
      'Basic AI content generation',
      '25 credits per month',
      'Standard support',
    ],
  },
  premium: {
    name: 'Premium',
    price: 99,
    credits: 50,
    priceId: "price_1QI7yhA0g4fLWq2D3pHk1Y9A",
    features: [
      'Advanced AI content generation',
      '50 credits per month',
      'Priority support',
      'Custom avatars',
    ],
  },
  business: {
    name: 'Business',
    price: 169,
    credits: 100,
    priceId: "price_1QI7xGA0g4fLWq2D9xHT3W2B",
    features: [
      'Enterprise AI content generation',
      '100 credits per month', 
      'Custom avatars & branding',
      'API access',
    ],
  },
};