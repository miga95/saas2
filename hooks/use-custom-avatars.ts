import { useQuery } from '@tanstack/react-query';
import { CustomAvatar } from '@/types/avatar';

export function useCustomAvatars() {
  return useQuery<CustomAvatar[]>({
    queryKey: ['custom-avatars'],
    queryFn: async () => {
      const response = await fetch('/api/custom-avatars');
      if (!response.ok) {
        throw new Error('Failed to fetch custom avatars');
      }
      return response.json();
    },
  });
} 