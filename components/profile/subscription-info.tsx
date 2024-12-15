'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Subscription, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Coins, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionInfoProps {
  subscription: Subscription | null;
  user: User;
}

export function SubscriptionInfo({ subscription, user }: SubscriptionInfoProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/stripe/subscription/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">Subscription Status</h2>
        <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
          <Coins className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            {user.credits} credits
          </span>
        </div>
      </div>
      
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
            onClick={handleManageSubscription}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Manage Subscription'
            )}
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