'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectResponse {
  id: string;
  name: string | null;
  text: string | null;
  creator: string;
  output: string | null;
  aspect_ratio: string;
  green_screen: boolean;
  created_at: string;
  updated_at: string;
  progress: number;
  failed_reason: string | null;
  media_job: string;
  status: 'pending' | 'done' | 'failed';
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

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data, isLoading, error } = useQuery<ProjectResponse>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/lipsyncs/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      return data;
    },
    enabled: !!projectId,
    refetchInterval: (data) => {
     if (!data) return 2000;
      return ['done', 'failed'].includes(data?.state?.data?.status) ? false : 2000;
    },
  });

  const isRendering = !data || data.status !== 'done';

  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[1200px]">
          {/* Header */}
          <div className="mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Video Container */}
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-center p-8">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm text-slate-400">Loading project...</p>
                </div>
              ) : error ? (
                <div className="text-red-500">Failed to load project</div>
              ) : data?.status === 'failed' ? (
                <div className="text-red-500">
                  Render failed: {data.failed_reason || 'Unknown error'}
                </div>
              ) : isRendering ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-slate-200">Video is rendering</p>
                    {data?.progress > 0 && (
                      <p className="text-sm text-slate-400">Progress: {data.progress}%</p>
                    )}
                  </div>
                </div>
              ) : data?.output ? (
                <div className="space-y-4 w-full">
                  <div className="relative w-full pt-[56.25%]">
                    <video
                      src={data.output}
                      className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                      controls
                      autoPlay
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => window.open(data.output!, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Download Video
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400">No video available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 