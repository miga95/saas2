import { useMutation, useQuery } from '@tanstack/react-query';

interface LipsyncInput {
  text: string;
  avatarId: string;
  aspectRatio: string;
}

interface LipsyncStatus {
  id: string;
  text: string;
  creator: string;
  output: string | null;
  aspect_ratio: string;
  status: 'pending' | 'in_queue' | 'running' | 'failed' | 'done' | 'rejected';
  progress: number;
  // ... autres champs
}

export function useLipsync() {
  const generateLipsync = useMutation({
    mutationFn: async (input: LipsyncInput) => {
      const response = await fetch('/api/lipsyncs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) {
        throw new Error('Échec de la génération de la vidéo');
      }
      
      return response.json();
    },
  });

  const checkLipsyncStatus = (id: string) => {    
    return useQuery<LipsyncStatus>({
      queryKey: ['lipsync', id],
      queryFn: async () => {
        const response = await fetch(`/api/lipsyncs?id=${id}`);
        if (!response.ok) {
          throw new Error('Échec de la vérification du statut');
        }
        const data = await response.json();
        console.log('Status response:', data);
        return data;
      },
      enabled: !!id,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
      staleTime: 0,
      retry: true,
      retryDelay: 2000,
    });
  };

  return {
    generateLipsync,
    checkLipsyncStatus,
  };
} 