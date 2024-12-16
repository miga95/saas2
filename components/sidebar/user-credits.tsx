'use client';

import { Coins } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

export function UserCredits() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center gap-x-2">
        <Coins className="h-4 w-4 text-yellow-500 animate-pulse" />
        <span className="text-sm animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-x-2">
      <Coins className="h-4 w-4 text-yellow-500" />
      <span className="text-sm">
        {user?.credits || 0} credits
      </span>
    </div>
  );
} 