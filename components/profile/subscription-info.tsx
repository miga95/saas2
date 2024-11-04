'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Subscription } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface SubscriptionInfoProps {
  subscription: Subscription | null;
}

export function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
      
      {subscription ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{subscription.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next billing date</p>
              <p className="font-medium">
                {formatDate(subscription.stripeCurrentPeriodEnd)}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/pricing')}
          >
            Manage Subscription
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You are currently not subscribed to any plan.
          </p>
          <Button
            className="w-full"
            onClick={() => router.push('/pricing')}
          >
            View Plans
          </Button>
        </div>
      )}
    </Card>
  );
}