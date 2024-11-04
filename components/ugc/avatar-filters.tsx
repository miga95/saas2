'use client';

import { Search, Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const filters = [
  { name: 'Gender', options: ['Male', 'Female'] },
  { name: 'Age', options: ['18-25', '26-35', '36+'] },
  { name: 'Location', options: ['Indoor', 'Outdoor'] },
  { name: 'Style', options: ['Casual', 'Business'] },
];

export function AvatarFilters() {
  return (
    <div className="flex gap-2 items-center">
      {filters.map((filter) => (
        <Select key={filter.name}>
          <SelectTrigger className="w-32 bg-slate-900/50 border-slate-800">
            <SelectValue placeholder={filter.name} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option} value={option.toLowerCase()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      <div className="flex gap-2 ml-auto">
        <Button variant="ghost" size="icon">
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Star className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}