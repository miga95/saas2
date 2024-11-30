'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Maximize2, X, Volume2, Play, Pause } from 'lucide-react';
import { useAvatars } from '@/hooks/use-avatars';
import { useVoices } from '@/hooks/use-voices';
import { Avatar } from '@/types/avatar';
import { Voice, VoiceAccent } from '@/types/voice';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface AvatarGridProps {
  filters: {
    gender: string[];
    location: string[];
  };
}

export function AvatarGrid({ filters }: AvatarGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<'preview' | 'voices' | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useAvatars(filters);

  const {
    data: voices,
    isLoading: isLoadingVoices,
    isError: isErrorVoices,
  } = useVoices();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleDialogClose = () => {
    setDialogType(null);
    setSelectedAvatar(null);
    stopCurrentAudio();
  };

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(null);
    }
  };

  const handlePlayVoice = async (accent: VoiceAccent) => {
    try {
      if (isPlaying === accent.id) {
        stopCurrentAudio();
        return;
      }

      stopCurrentAudio();

      const audio = new Audio(accent.preview_url);
      audioRef.current = audio;

      audio.addEventListener('ended', () => {
        setIsPlaying(null);
        audioRef.current = null;
      });

      audio.addEventListener('error', (e) => {
        console.error('Erreur de lecture audio:', e);
        toast.error('Impossible de lire l\'aperçu vocal');
        setIsPlaying(null);
        audioRef.current = null;
      });

      setIsPlaying(accent.id);
      await audio.play();
    } catch (error) {
      console.error('Erreur de lecture vocale:', error);
      toast.error('Impossible de lire l\'aperçu vocal');
      setIsPlaying(null);
      audioRef.current = null;
    }
  };

  const filteredVoices = voices?.filter(voice => {
    if (selectedGender === 'all') return true;
    return voice.gender?.toLowerCase() === selectedGender;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError || isErrorVoices) {
    return (
      <div className="text-center text-red-500 py-8">
        Impossible de charger le contenu. Veuillez réessayer plus tard.
      </div>
    );
  }

  const allAvatars = data?.pages.flatMap(page => page.results) || [];
  
  return (
    <div className="h-[calc(100vh-300px)] overflow-y-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {allAvatars.map((avatar) => (
          <div key={avatar.id} className="relative">
            <div
              className="group relative aspect-[3/4] rounded-lg bg-slate-900/50 border border-slate-800 overflow-hidden hover:border-indigo-600 cursor-pointer transition-all"
              onMouseEnter={() => setHoveredAvatar(avatar.id)}
              onMouseLeave={() => setHoveredAvatar(null)}
            >
              {hoveredAvatar === avatar.id ? (
                <video
                  src={avatar.squared_preview_video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={avatar.preview_image_1_1}
                  alt={avatar.creator_name || ''}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              
              <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-black/60 border-0 hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAvatar(avatar);
                    setDialogType('voices');
                  }}
                >
                  <Volume2 className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-black/60 border-0 hover:bg-black/80"
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setDialogType('preview');
                  }}
                >
                  <Maximize2 className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogType !== null} onOpenChange={(open) => {
        if (!open) handleDialogClose();
      }}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <DialogTitle className="sr-only">
            {dialogType === 'voices' ? 'Sélectionner une voix' : selectedAvatar?.creator_name || 'Aperçu de l\'avatar'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {dialogType === 'voices' ? 'Choisissez une voix pour votre avatar' : 'Prévisualiser la vidéo de l\'avatar'}
          </DialogDescription>
          <div className="relative bg-black">
          <div className="absolute top-4 left-4 text-xl font-semibold text-white z-10">
              {dialogType === 'voices' ? 'Sélectionner une voix' : selectedAvatar?.creator_name || ''}
            </div>
            <div className="absolute top-4 right-4 z-10">
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>

            {dialogType === 'voices' ? (
              <div className="p-6 bg-slate-900 min-h-[60vh]">
                <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedGender}>
                  <TabsList className="bg-slate-800">
                    <TabsTrigger value="all">Toutes les voix</TabsTrigger>
                    <TabsTrigger value="male">Homme</TabsTrigger>
                    <TabsTrigger value="female">Femme</TabsTrigger>
                  </TabsList>
                  
                  <ScrollArea className="h-[60vh] mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                      {isLoadingVoices ? (
                        <div className="col-span-full flex justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      ) : filteredVoices?.map((voice) => (
                        voice.accents.map((accent) => (
                          <div
                            key={accent.id}
                            className="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"
                            onClick={() => handlePlayVoice(accent)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-white">{voice.name}</h3>
                                <p className="text-sm text-slate-400">
                                  {accent.accent_name}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={isPlaying === accent.id ? "text-indigo-500" : "text-white"}
                              >
                                {isPlaying === accent.id ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))
                      ))}
                    </div>
                  </ScrollArea>
                </Tabs>
              </div>
            ) : (
              selectedAvatar && (
                <video
                  src={selectedAvatar.squared_preview_video}
                  controls
                  controlsList="nodownload"
                  preload="metadata"
                  className="w-full h-auto"
                  style={{ maxHeight: '90vh' }}
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>

      {(hasNextPage || isFetchingNextPage) && (
        <div 
          ref={loadMoreRef}
          className="flex justify-center py-4"
        >
          {isFetchingNextPage && (
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          )}
        </div>
      )}
    </div>
  );
}