'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarFilters } from './avatar-filters';
import { AvatarGrid } from './avatar-grid';
import { AspectRatioSelector } from './aspect-ratio-selector';
import { Textarea } from '../ui/textarea';

interface Filters {
  gender: string[];
  location: string[];
}

export function AvatarSelector() {
  const [filters, setFilters] = useState<Filters>({
    gender: [],
    location: [],
  });
  const [text, setText] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl">Script</h2>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your script here..."
          className="w-full min-h-[200px] p-4 rounded-lg bg-secondary/50 resize-none"
          maxLength={3600} 
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl">Aspect Ratio</h2>
        <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl">Avatar</h2>
        <AvatarFilters onFilterChange={handleFilterChange} activeFilters={filters} />
        <AvatarGrid 
          filters={filters} 
          text={text} 
          aspectRatio={aspectRatio}
        />
      </div>
    </div>
  );
}