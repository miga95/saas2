import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface PreviewResponse {
  id: string;
  name?: string;
  output?: string;
  created_at: string;
  updated_at: string;
  progress?: number;
  failed_reason?: string;
  media_job: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  webhook_url?: string;
  preview?: string;
}

interface PreviewInput {
  avatarId: string;
  text: string;
  aspectRatio?: '9:16' | '16:9' | '1:1';
}

async function generatePreview(input: PreviewInput): Promise<PreviewResponse> {
  try {
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[PREVIEW_REQUEST_ERROR]', {
        status: response.status,
        data
      });
      throw new Error(data.error || 'Failed to generate preview');
    }

    return data;
  } catch (error) {
    console.error('[PREVIEW_ERROR]', error);
    throw error;
  }
}

export function usePreview() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const previewMutation = useMutation({
    mutationFn: generatePreview,
    onMutate: () => {
      toast.loading('Generating preview...');
    },
    onSuccess: (data) => {
      console.log('[PREVIEW_SUCCESS]', data);
      toast.dismiss();
      toast.success('Preview generation started');
      // Rediriger vers l'éditeur avec l'ID de la prévisualisation
      router.push(`/editor?previewId=${data.id}`);
    },
    onError: (error: Error) => {
      console.error('[PREVIEW_MUTATION_ERROR]', {
        message: error.message,
        stack: error.stack,
      });
      toast.dismiss();
      toast.error(`Failed to generate preview: ${error.message}`);
    }
  });

  return {
    generatePreview: previewMutation.mutate,
    isGenerating: previewMutation.isPending,
    previewError: previewMutation.error,
    previewData: previewMutation.data,
    reset: previewMutation.reset
  };
} 