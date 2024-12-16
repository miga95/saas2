'use client';

import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  credits: number;
  subscription: {
    status: string;
    stripeCurrentPeriodEnd: string;
  } | null;
}

export function useUser() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  return {
    user,
    isLoading,
    error,
  };
} 