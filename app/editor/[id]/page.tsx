'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Pause, RotateCcw, Download, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { use } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const { id } = use(params);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('voice-over');
  const [script, setScript] = useState('');

  const { data: video } = useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      const response = await fetch(`/api/lipsyncs?id=${id}`);
      if (!response.ok) {
        throw new Error('Échec du chargement de la vidéo');
      }
      return response.json();
    },
  });

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = async () => {
    if (!video?.output) return;

    try {
      toast.loading('Préparation du téléchargement...');

      const response = await fetch(`/api/lipsyncs/download?url=${encodeURIComponent(video.output)}`);
      
      if (!response.ok) {
        throw new Error('Échec du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `video-${Date.now()}.mp4`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Téléchargement démarré');
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Barre latérale gauche */}
      <div className="w-[300px] border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-semibold">Edit</h1>
        </div>
        
        <div className="flex-1 p-4 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="voice-over" className="flex-1">Voice over</TabsTrigger>
              <TabsTrigger value="script-caption" className="flex-1">Script caption</TabsTrigger>
            </TabsList>
          </Tabs>

          <Textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Entrez votre script ici..."
            className="min-h-[200px] bg-slate-900 border-slate-800"
          />

          {/* Section voix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Voice over</span>
              <Button variant="outline" size="sm">
                <Volume2 className="h-4 w-4 mr-2" />
                Female
              </Button>
            </div>
            
            {/* Sélecteur de voix */}
            <div className="bg-slate-900 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Camilla</span>
                <Button variant="ghost" size="sm">
                  American accent
                </Button>
              </div>
            </div>
          </div>

          {/* Bouton de rendu */}
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
            Render audio
          </Button>
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Prévisualisation vidéo */}
          <div className="aspect-[9/16] bg-slate-900 rounded-lg overflow-hidden">
            {video?.output && (
              <video
                ref={videoRef}
                src={video.output}
                className="w-full h-full"
                onEnded={() => setIsPlaying(false)}
              />
            )}
          </div>

          {/* Contrôles vidéo */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className="w-12 h-12"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRestart}
              className="w-12 h-12"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 