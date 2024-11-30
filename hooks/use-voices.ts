'use client';

import { useQuery } from '@tanstack/react-query';
import { VoiceResponse } from '@/types/voice';
import { toast } from 'sonner';

async function fetchVoices(): Promise<VoiceResponse> {
  try {
    const response = await fetch('/api/voices');

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching voices:', error);
    toast.error('Failed to load voices');
    throw error;
  }
}

export function useVoices() {
  return useQuery({
    queryKey: ['voices'],
    queryFn: fetchVoices,
    retry: 2,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}