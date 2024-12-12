'use client';

import { Coins } from 'lucide-react';

interface UserCreditsProps {
  credits: number;
}

export function UserCredits({ credits }: UserCreditsProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg text-sm bg-slate-900">
      <Coins className="h-4 w-4 text-indigo-400" />
      <span className="text-indigo-400">{credits} crédits</span>
    </div>
  );
} 