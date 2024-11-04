import { PricingCards } from '@/components/pricing/pricing-cards';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-bold text-white">Simple, transparent pricing</h1>
          <p className="text-xl text-slate-400">Choose the plan that's right for you</p>
        </div>
        <PricingCards />
      </div>
    </div>
  );
}