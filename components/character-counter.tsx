'use client';

interface CharacterCounterProps {
  current: number;
  max: number;
}

export function CharacterCounter({ current, max }: CharacterCounterProps) {
  const isNearLimit = current > max * 0.9;
  const isOverLimit = current > max;

  return (
    <div className={`text-sm absolute bottom-2 right-2 ${
      isOverLimit 
        ? 'text-red-500' 
        : isNearLimit 
          ? 'text-yellow-500' 
          : 'text-slate-400'
    }`}>
      {current}/{max}
    </div>
  );
} 