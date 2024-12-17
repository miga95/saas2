'use client';

import { Search, Star, RefreshCw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FilterOption = {
  id: string;
  label: string;
};

type FilterCategory = 'gender' | 'location';

const filters: Record<FilterCategory, FilterOption[]> = {
  gender: [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
  ],
  location: [
    { id: 'indoor', label: 'Indoor' },
    { id: 'outdoor', label: 'Outdoor' },
  ],
};

interface Filters {
  gender: string[];
  location: string[];
  type?: string;
}

interface AvatarFiltersProps {
  onFilterChange: (filters: Filters) => void;
  activeFilters: Filters;
}

export function AvatarFilters({ onFilterChange, activeFilters }: AvatarFiltersProps) {
  const handleFilterChange = (category: FilterCategory, value: string, checked: boolean) => {
    const newFilters = { ...activeFilters };
    const categoryFilters = [...(newFilters[category] || [])];
    
    if (checked) {
      newFilters[category] = [...categoryFilters, value];
    } else {
      newFilters[category] = categoryFilters.filter(
        (filter: string) => filter !== value
      );
    }

    onFilterChange(newFilters);
  };

  const handleTypeChange = (type: string) => {
    onFilterChange({ ...activeFilters, type });
  };

  const isFilterActive = (category: FilterCategory, value: string): boolean => {
    return activeFilters[category]?.includes(value) || false;
  };

  const getActiveFilterCount = (category: FilterCategory): number => {
    return activeFilters[category]?.length || 0;
  };

  const resetFilters = () => {
    onFilterChange({
      gender: [],
      location: [],
      type: 'realistic'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => handleTypeChange('realistic')}
          className={cn(
            "pb-4 px-6 text-sm font-medium relative flex items-center gap-2",
            "hover:text-white transition-colors",
            (!activeFilters.type || activeFilters.type === 'realistic') ? "text-white" : "text-slate-400",
            (!activeFilters.type || activeFilters.type === 'realistic') && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
          )}
        >
          Realistic Avatar
        </button>
        <button
          onClick={() => handleTypeChange('styled')}
          className={cn(
            "pb-4 px-6 text-sm font-medium relative flex items-center gap-2",
            "hover:text-white transition-colors",
            activeFilters.type === 'styled' ? "text-white" : "text-slate-400",
            activeFilters.type === 'styled' && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
          )}
        >
          Styled Avatar
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(Object.entries(filters) as [FilterCategory, FilterOption[]][]).map(([category, options]) => (
            <Popover key={category}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-slate-900/50 border-slate-800 hover:bg-slate-800"
                >
                  <span className="capitalize">{category}</span>
                  {getActiveFilterCount(category) > 0 && (
                    <span className="ml-2 h-5 w-5 rounded-full bg-indigo-600 text-xs flex items-center justify-center">
                      {getActiveFilterCount(category)}
                    </span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4 bg-slate-900 border-slate-800">
                <div className="space-y-2">
                  {options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${category}-${option.id}`}
                        checked={isFilterActive(category, option.id)}
                        onCheckedChange={(checked) => 
                          handleFilterChange(category, option.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`${category}-${option.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </div>

        <div className="flex gap-2">
          {(activeFilters.gender.length > 0 || activeFilters.location.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Star className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}