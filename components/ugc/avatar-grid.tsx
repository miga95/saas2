'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useAvatars } from '@/hooks/use-avatars';
import { Avatar } from '@/types/avatar';

interface AvatarGridProps {
  filters: {
    gender?: string;
    age?: string;
    style?: string;
    location?: string;
  };
  aspectRatio: string;
}

export function AvatarGrid({ filters, aspectRatio }: AvatarGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useAvatars(filters);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const getPreviewImage = (avatar: Avatar) => {
    if (!avatar) return '/placeholder-avatar.png';
    
    switch (aspectRatio) {
      case '16:9':
        return avatar.preview_image_16_9 || '/placeholder-avatar.png';
      case '1:1':
        return avatar.preview_image_1_1 || '/placeholder-avatar.png';
      case '9:16':
        return avatar.preview_image_9_16 || '/placeholder-avatar.png';
      default:
        return avatar.preview_image_9_16 || '/placeholder-avatar.png';
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load avatars. Please try again later.
      </div>
    );
  }

  const allAvatars = data?.pages.flatMap(page => page.results) || [];

  console.log("avatars : ", allAvatars);

  return (
    <div className="h-[calc(100vh-300px)] overflow-y-auto pr-4">
      <div className="grid grid-cols-5 gap-4">
        {allAvatars.map((avatar) => (
          <div
            key={avatar.id}
            className="aspect-square rounded-lg bg-slate-900/50 border border-slate-800 overflow-hidden hover:border-indigo-600 cursor-pointer transition-all"
          >
            <img
              src={getPreviewImage(avatar)}
              alt={avatar.creator_name || 'Avatar'}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-avatar.png';
              }}
            />
          </div>
        ))}
      </div>

      {(hasNextPage || isFetchingNextPage) && (
        <div 
          ref={loadMoreRef}
          className="flex justify-center py-4"
        >
          {isFetchingNextPage && (
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          )}
        </div>
      )}
    </div>
  );
}