import { Button } from "@/components/ui/button";

interface AspectRatioSelectorProps {
  value: '9:16' | '16:9' | '1:1';
  onChange: (value: '9:16' | '16:9' | '1:1') => void;
}

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="flex gap-2 justify-center">
      <Button
        variant={value === '9:16' ? 'default' : 'outline'}
        onClick={() => onChange('9:16')}
        className="w-14 h-14 flex flex-col items-center justify-center"
      >
        <div className="w-4 h-6 border-2 rounded" />
        <span className="text-xs mt-1">9:16</span>
      </Button>
      <Button
        variant={value === '16:9' ? 'default' : 'outline'}
        onClick={() => onChange('16:9')}
        className="w-14 h-14 flex flex-col items-center justify-center"
      >
        <div className="w-6 h-4 border-2 rounded" />
        <span className="text-xs mt-1">16:9</span>
      </Button>
      <Button
        variant={value === '1:1' ? 'default' : 'outline'}
        onClick={() => onChange('1:1')}
        className="w-14 h-14 flex flex-col items-center justify-center"
      >
        <div className="w-5 h-5 border-2 rounded" />
        <span className="text-xs mt-1">1:1</span>
      </Button>
    </div>
  );
} 