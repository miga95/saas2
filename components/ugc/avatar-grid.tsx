'use client';

import { Button } from '@/components/ui/button';

export function AvatarGrid() {
  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {Array(10).fill(0).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-slate-900/50 border border-slate-800 overflow-hidden hover:border-indigo-600 cursor-pointer transition-all"
          >
            <div className="w-full h-full bg-slate-800 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="outline" className="bg-slate-900/50 border-slate-800">
          Next
        </Button>
      </div>
    </>
  );
}