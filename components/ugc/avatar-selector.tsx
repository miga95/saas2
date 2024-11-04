'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarFilters } from './avatar-filters';
import { AvatarGrid } from './avatar-grid';

export function AvatarSelector() {
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
      <AvatarFilters />
      <AvatarGrid />
    </div>
  );
}