'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarFilters } from './avatar-filters';
import { AvatarGrid } from './avatar-grid';

interface Filters {
  gender: string[];
  location: string[];
}

export function AvatarSelector() {
  const [filters, setFilters] = useState<Filters>({
    gender: [],
    location: [],
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl">Avatar</h2>
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="bg-slate-900/50 border-slate-800">
          <TabsTrigger value="library" className="data-[state=active]:bg-indigo-600">
            Library
          </TabsTrigger>
          <TabsTrigger value="community" className="data-[state=active]:bg-indigo-600">
            Community
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-indigo-600">
            Custom
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <AvatarFilters onFilterChange={handleFilterChange} activeFilters={filters} />
      <AvatarGrid filters={filters} />
    </div>
  );
}