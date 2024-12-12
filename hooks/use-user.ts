import { useQuery } from '@tanstack/react-query';

interface User {
  credits: number;
  name: string | null;
  email: string | null;
}

async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user/credits');
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 0, // Toujours considérer les données comme périmées
    refetchOnMount: true, // Recharger les données au montage du composant
  });
} 