'use client';

import { Coins } from 'lucide-react';

export function UserCredits( {userCredits}: {userCredits: number}) {
  
  return (
    <div className="flex items-center gap-x-2">
      <Coins className="h-4 w-4 text-yellow-500" />
      <span className="text-sm">
        {userCredits} credits
      </span>
    </div>
  );
} 