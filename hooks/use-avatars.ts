'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { AvatarResponse, Avatar } from '@/types/avatar';

interface AvatarFilters {
  gender: string[];
  age: string[];
  style: string[];
  location: string[];
}

async function fetchAvatars(page = 1): Promise<AvatarResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
  });

  const response = await fetch(`/api/avatars?${queryParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch avatars');
  }

  return response.json();
}

function filterAvatars(avatars: Avatar[], filters: AvatarFilters) {
  return avatars.filter(avatar => {
    // Gender filter
    if (filters.gender.length > 0) {
      const genderMatches = filters.gender.some(gender => {
        const genderMatch = gender.toLowerCase() === 'male' ? 'm' : 'f';
        return avatar.gender === genderMatch;
      });
      if (!genderMatches) return false;
    }

    // Age filter (assuming age range is in keywords or video_scene)
    if (filters.age.length > 0) {
      const ageMatches = filters.age.some(age => 
        avatar.keywords?.includes(age) || avatar.video_scene?.includes(age)
      );
      if (!ageMatches) return false;
    }

    // Style filter (assuming style is in keywords or video_scene)
    if (filters.style.length > 0) {
      const styleMatches = filters.style.some(style => 
        avatar.keywords?.includes(style) || avatar.video_scene?.includes(style)
      );
      if (!styleMatches) return false;
    }

    // Location filter (assuming location is in keywords or video_scene)
    if (filters.location.length > 0) {
      const locationMatches = filters.location.some(location => 
        avatar.keywords?.includes(location) || avatar.video_scene?.includes(location)
      );
      if (!locationMatches) return false;
    }

    return true;
  });
}

export function useAvatars(filters: AvatarFilters) {
  return useInfiniteQuery({
    queryKey: ['avatars', filters],
    queryFn: ({ pageParam = 1 }) => fetchAvatars(pageParam),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage <= Math.ceil(lastPage.count / 20) ? nextPage : undefined;
    },
    initialPageParam: 1,
    select: (data) => {
      if (Object.values(filters).every(filterArray => filterArray.length === 0)) {
        return data;
      }

      return {
        ...data,
        pages: data.pages.map(page => ({
          ...page,
          results: filterAvatars(page.results, filters)
        }))
      };
    }
  });
}