'use client';

import { Button } from '@/components/ui/button';

const ratios = [
  { value: '9:16', label: '9:16' },
  { value: '16:9', label: '16:9' },
  { value: '1:1', label: '1:1' },
];

interface AspectRatioSelectorProps {
  value: string;
  onChange: (ratio: string) => void;
}

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl">Aspect ratio</h2>
      <div className="flex gap-2">
        {ratios.map((ratio) => (
          <Button
            key={ratio.value}
            variant={value === ratio.value ? 'default' : 'outline'}
            className={`flex-1 max-w-[120px] ${
              value === ratio.value ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900/50 border-slate-800'
            }`}
            onClick={() => onChange(ratio.value)}
          >
            {ratio.label}
          </Button>
        ))}
      </div>
    </div>
  );
}