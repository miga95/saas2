'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Loader2, Play, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PreviewResponse {
  id: string;
  name: string | null;
  text: string | null;
  creator: string;
  output: string | null;
  aspect_ratio: string;
  green_screen: boolean;
  created_at: string;
  updated_at: string;
  progress: number | null;
  failed_reason: string | null;
  media_job: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  is_hidden: boolean;
  audio_url: string | null;
  webhook_url: string | null;
  accent: string | null;
  preview: string | null;
  preview_audio: string | null;
  no_caption: boolean;
  no_music: boolean;
  caption_style: string;
  caption_position: string;
  caption_offset_x: string;
  caption_offset_y: string;
  background_asset_image_url: string | null;
}

export default function PreviewClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const previewId = searchParams.get('previewId');
  const [isRendering, setIsRendering] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<PreviewResponse>({
    queryKey: ['preview', previewId],
    queryFn: async (): Promise<PreviewResponse> => {
      const response = await fetch(`/api/preview/${previewId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch preview');
      }
      const data = await response.json();
      return data;
    },
    enabled: !!previewId,
    refetchInterval: (data) => {
      return data ? false : 3000;
    },
  });
  
  console.log("data", data);
  useEffect(() => {
    if (!data?.preview) return;
  }, [data?.preview]);

  const handleRender = async () => {
    if (!data || isRendering) return;
    setIsRendering(true);
    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aspect_ratio: data.aspect_ratio,
          text: data.text,
          creator: data.creator,
          green_screen: data.green_screen,
          accent: data.accent,
          no_caption: data.no_caption,
          background_asset_image_url: data.background_asset_image_url
        }),
      })
      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 402) {
          toast.error(`Insufficient credits. You need ${responseData.requiredCredits} credits to render this video.`);
        } else {
          throw new Error(responseData.error || 'Failed to start render');
        }
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast.success('Render started successfully');
      router.push(`/project/${responseData.id}`);
    } catch (error) {
      console.error('Failed to start render:', error);
      toast.error('Failed to start render');
    } finally {
      setIsRendering(false);
      setShowConfirmDialog(false);
    }
  };

  if (!previewId) return null;

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[1200px]">
          {/* Header */}
          <div className="mb-4 flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => setShowConfirmDialog(true)}
              disabled={isRendering || !data}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRendering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rendering...
                </>
              ) : (
                'Render'
              )}
            </Button>
          </div>

          {/* Preview Container */}
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            {/* Video Preview */}
            <div className="flex items-center justify-center p-8">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm text-slate-400">
                    {data ? 'Generating preview...' : 'Loading...'}
                  </p>
                </div>
              ) : error ? (
                <div className="text-red-500">Failed to load preview</div>
              ) : data?.preview ? (
                <div className="space-y-4 w-full">
                  <div className="relative w-full pt-[56.25%]">
                    <iframe
                      src={data.preview}
                      className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="text-center space-y-2">
                    {videoDuration && (
                      <p className="text-sm text-slate-400">
                        Durée de la vidéo: {Math.round(videoDuration)} secondes
                      </p>
                    )}
                    <p className="text-yellow-500 text-sm">
                      ❗Clicking 'Render' will provide accurate lip-sync and higher clarity.
                    </p>
                  </div>
                </div>
              ) : data?.failed_reason ? (
                <div className="text-red-500">
                  Generation failed: {data.failed_reason}
                </div>
              ) : (
                <div className="text-slate-400">No preview available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Video Render</DialogTitle>
            <DialogDescription>
              This action will cost 5 credits. Do you want to proceed with rendering the video?
              {videoDuration && (
                <p className="mt-2">
                  La vidéo finale durera environ {Math.round(videoDuration)} secondes.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRender} disabled={isRendering}>
              {isRendering ? 'Rendering...' : 'Render Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 