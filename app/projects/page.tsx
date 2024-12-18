'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Video, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface Project {
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

export default function ProjectsPage() {
  const router = useRouter();

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      return data;
    },
    select: (data: any) => data?.state?.data || data,
    refetchInterval: 5000, // Rafraîchir toutes les 5 secondes pour voir les nouveaux projets
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">My Projects</h1>
          <Button
            onClick={() => router.push('/create')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create New Video
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            <AlertCircle className="h-6 w-6 mr-2" />
            Failed to load projects
          </div>
        ) : !projects?.length ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Video className="h-12 w-12 mb-4" />
            <p>No projects yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                onClick={() => {
                  if (project.progress === 0) {
                    router.push(`/preview?previewId=${project.id}`);
                  } else {
                    router.push(`/project/${project.id}`);
                  }
                }}
              >
                <div className="aspect-video bg-slate-800 relative">
                  {project.output ? (
                    <video
                      src={project.output}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="h-12 w-12 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-slate-900/80 ${getStatusColor(project.status)}`}>
                      {project.status === 'pending' ? `${project.progress}%` : project.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-400 mb-1">
                    {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                  </p>
                  <p className="text-sm text-slate-200 line-clamp-2">
                    {project.text || 'Untitled Project'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 