'use client';

import { useQuery } from '@tanstack/react-query';
import { AvatarResponse, Avatar } from '@/types/avatar';

interface UseAvatarsFilters {
  gender?: string[];
  location?: string[];
  type?: 'realistic' | 'styled';
}

async function fetchAvatars(): Promise<AvatarResponse> {
  const response = await fetch('/api/avatars');
  
  if (!response.ok) {
    throw new Error('Failed to fetch avatars');
  }

  const data = await response.json();

  // Transformer la réponse pour correspondre à notre structure
  return data.map((avatar: any) => ({
    id: avatar.id,
    created_at: avatar.created_at,
    updated_at: avatar.updated_at,
    gender: avatar.gender,
    creator_name: avatar.creator_name,
    video_scene: avatar.video_scene,
    keywords: avatar.keywords,
    preview_image_16_9: avatar.preview_image_16_9,
    preview_image_1_1: avatar.preview_image_1_1,
    preview_image_9_16: avatar.preview_image_9_16,
    preview_video_16_9: avatar.preview_video_16_9,
    preview_video_1_1: avatar.preview_video_1_1,
    preview_video_9_16: avatar.preview_video_9_16,
    landscape_preview_video: avatar.landscape_preview_video,
    squared_preview_video: avatar.squared_preview_video,
    is_active: avatar.is_active,
    process_status: avatar.process_status,
    failed_reason: avatar.failed_reason,
    type: avatar.type
  }));
}

export function useAvatars(filters: UseAvatarsFilters) {
  return useQuery({
    queryKey: ['avatars', filters],
    queryFn: fetchAvatars,
    select: (data) => {
      return data.filter(avatar => {
        // Filtre par type
        if (filters.type && filters.type !== avatar.type?.toLowerCase()) {
          return false;
        }

        // Filtre par genre
        if (filters.gender?.length) {
          const genderMap: Record<string, string> = {
            'male': 'm',
            'female': 'f'
          };
          const mappedGenders = filters.gender.map(g => genderMap[g.toLowerCase()] || g.toLowerCase());
          if (!mappedGenders.includes(avatar.gender?.toLowerCase())) {
            return false;
          }
        }

        // Filtre par location (video_scene)
        if (filters.location?.length) {
          const isOutdoor = avatar.video_scene?.toLowerCase().includes('outdoor');
          const wantsOutdoor = filters.location.includes('outdoor');
          const wantsIndoor = filters.location.includes('indoor');

          // Si on veut outdoor et que ce n'est pas outdoor, ou si on veut indoor et que c'est outdoor
          if ((wantsOutdoor && !isOutdoor) || (wantsIndoor && isOutdoor)) {
            return false;
          }
        }

        return true;
      });
    }
  });
}