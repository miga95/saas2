'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { PLANS } from '@/lib/stripe';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function PricingCards() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(priceId);
      
      if (!session?.user) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {Object.entries(PLANS).map(([key, plan]) => (
        <Card key={key} className="flex flex-col p-6 bg-slate-900 border-slate-800">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
            <div className="mt-4 flex items-baseline text-white">
              <span className="text-5xl font-extrabold tracking-tight">€{plan.price}</span>
              <span className="ml-1 text-xl font-semibold">/month</span>
            </div>
            <ul className="mt-6 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex text-slate-300">
                  <Check className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="ml-3">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="mt-8"
            onClick={() => handleSubscribe(plan.priceId)}
            disabled={loading === plan.priceId}
          >
            {loading === plan.priceId ? 'Loading...' : 'Subscribe'}
          </Button>
        </Card>
      ))}
    </div>
  );
}