'use client';

import dynamic from 'next/dynamic';
import { Suspense, memo, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Loader2, Maximize2, X, Volume2, Play, Pause, Check, FolderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAvatars } from '@/hooks/use-avatars';
import { useVoices } from '@/hooks/use-voices';
import { useLipsync } from '@/hooks/use-lipsync';
import { useCustomAvatars } from '@/hooks/use-custom-avatars';
import { Avatar, CustomAvatar } from '@/types/avatar';
import { Voice, VoiceAccent } from '@/types/voice';
import { useInView } from 'react-intersection-observer';
// import { Dialog as DialogComponent, DialogContent as DialogContentComponent, DialogTitle as DialogTitleComponent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TabNavigation } from './tab-navigation';
import { AvatarGridSkeleton } from './avatar-grid-skeleton';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

// Interfaces
interface AvatarCardProps {
  avatar: Avatar | CustomAvatar;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (avatar: Avatar | CustomAvatar) => void;
  onHover: (id: string | null) => void;
  onVoiceClick: (avatar: Avatar | CustomAvatar) => void;
  onPreviewClick: (avatar: Avatar | CustomAvatar) => void;
}

interface AvatarListProps {
  avatars: (Avatar | CustomAvatar)[];
  selectedAvatar: Avatar | CustomAvatar | null;
  hoveredAvatar: string | null;
  onAvatarSelect: (avatar: Avatar | CustomAvatar) => void;
  onAvatarHover: (id: string | null) => void;
  onVoiceClick: (avatar: Avatar | CustomAvatar) => void;
  onPreviewClick: (avatar: Avatar | CustomAvatar) => void;
}

interface CustomAvatarSectionProps {
  isLoading: boolean;
  avatars: CustomAvatar[] | undefined;
  selectedAvatar: Avatar | CustomAvatar | null;
  hoveredAvatar: string | null;
  onAvatarSelect: (avatar: CustomAvatar) => void;
  onAvatarHover: (id: string | null) => void;
}

// Composant pour la section des avatars personnalisés
const CustomAvatarSection = ({
  isLoading,
  avatars,
  selectedAvatar,
  hoveredAvatar,
  onAvatarSelect,
  onAvatarHover
}: CustomAvatarSectionProps) => {
  if (isLoading) {
    return <AvatarGridSkeleton />;
  }

  if (!avatars?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center">
          <FolderIcon className="w-10 h-10 text-slate-400" />
        </div>
        <p className="text-slate-400">Empty</p>
        <Button variant="outline" size="sm">
          Create your own avatar
        </Button>
      </div>
    );
  }

  return (
    <AvatarList
      avatars={avatars}
      selectedAvatar={selectedAvatar}
      hoveredAvatar={hoveredAvatar}
      onAvatarSelect={onAvatarSelect}
      onAvatarHover={onAvatarHover}
      onVoiceClick={() => {}}
      onPreviewClick={() => {}}
    />
  );
};

// Composant mémorisé pour l'avatar
const AvatarCard = memo(({ 
  avatar, 
  isSelected, 
  isHovered,
  onSelect,
  onHover,
  onVoiceClick,
  onPreviewClick
}: AvatarCardProps) => {
  return (
    <div
      className="relative group aspect-square rounded-lg overflow-hidden bg-slate-900"
      onMouseEnter={() => onHover(avatar.id)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={avatar.preview_image_1_1}
        alt={avatar.creator_name}
        className="w-full h-full object-cover"
      />

      {isHovered && (
        <>
          <video
            src={avatar.preview_video_1_1}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <p className="text-sm text-white font-medium truncate">
              {avatar.creator_name}
            </p>
          </div>
        </>
      )}

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onVoiceClick(avatar)}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onPreviewClick(avatar)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
});
AvatarCard.displayName = 'AvatarCard';

// Composant mémorisé pour la grille d'avatars
const AvatarList = memo(({ 
  avatars, 
  selectedAvatar,
  hoveredAvatar,
  onAvatarSelect,
  onAvatarHover,
  onVoiceClick,
  onPreviewClick
}: AvatarListProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {avatars.map((avatar) => (
        <AvatarCard
          key={avatar.id}
          avatar={avatar}
          isSelected={selectedAvatar?.id === avatar.id}
          isHovered={hoveredAvatar === avatar.id}
          onSelect={onAvatarSelect}
          onHover={onAvatarHover}
          onVoiceClick={onVoiceClick}
          onPreviewClick={onPreviewClick}
        />
      ))}
    </div>
  );
});
AvatarList.displayName = 'AvatarList';

interface AvatarGridProps {
  filters: {
    gender: string[];
    location: string[];
  };
}

interface LipsyncStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: string;
  progress?: number;
  failed_reason?: string;
  preview?: string;
  audio_url?: string;
}

export function AvatarGrid({ filters }: AvatarGridProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<'preview' | 'voices' | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedAvatars, setSelectedAvatars] = useState<Avatar[]>([]);
  const [selectedVoiceIds, setSelectedVoiceIds] = useState<string[]>([]);
  const [texts, setTexts] = useState<string[]>(['']);
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [activeTab, setActiveTab] = useState<'realistic' | 'styled' | 'custom'>('realistic');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  
  // Utiliser useCallback pour la fonction d'intersection
  const handleIntersect = useCallback((inView: boolean) => {
    if (inView) {
      setVisibleCount(prev => prev + 12);
    }
  }, []);

  // Utiliser useInView avec le callback
  const { ref: loadMoreRef } = useInView({
    onChange: handleIntersect,
    threshold: 0.1,
  });

  const {
    data: avatarsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingAvatars,
    isError: isErrorAvatars,
  } = useAvatars({ 
    ...filters, 
    type: activeTab === 'custom' ? undefined : activeTab 
  });

  const {
    data: voices,
    isLoading: isLoadingVoices,
    isError: isErrorVoices,
  } = useVoices();
 
  const { generateLipsync, checkLipsyncStatus } = useLipsync();
  const videoStatus = checkLipsyncStatus(generatedVideoId || '');
  const router = useRouter();

  const {
    data: customAvatars,
    isLoading: isLoadingCustom,
    isError: isErrorCustom
  } = useCustomAvatars();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (videoStatus.data?.status === 'done' || videoStatus.data?.status === 'completed') {
      console.log('Redirecting to editor with ID:', videoStatus.data.id);
      router.push(`/editor/${generatedVideoId}`);
    } else if (videoStatus.data?.status) {
      console.log('Current status:', videoStatus.data.status);
    }
  }, [videoStatus.data, router, generatedVideoId]);

  useEffect(() => {
    if (!generatedVideoId) return;

    const interval = setInterval(() => {
      videoStatus.refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [generatedVideoId, videoStatus]);

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
        // Si déjà en lecture, arrêter
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(null);
        }
        return;
      }

      // Arrêter la lecture précédente si elle existe
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Créer un nouvel élément audio
      const audio = new Audio(accent.preview_url);
      audioRef.current = audio;

      // Démarrer la lecture
      await audio.play();
      setIsPlaying(accent.id);

      // Réinitialiser quand la lecture est terminée
      audio.onended = () => {
        setIsPlaying(null);
      };
    } catch (error) {
      console.error('Error playing voice:', error);
      toast.error('Failed to play voice preview');
      setIsPlaying(null);
    }
  };

  const filteredVoices = voices?.filter(voice => {
    if (selectedGender === 'all') return true;
    return voice.gender?.toLowerCase() === selectedGender;
  });

  // Optimisation des callbacks avec useCallback
  const handleAvatarSelect = useCallback((avatar: Avatar) => {
    setSelectedAvatar(selectedAvatar?.id === avatar.id ? null : avatar);
  }, [selectedAvatar]);

  const handleAvatarHover = useCallback((id: string | null) => {
    setHoveredAvatar(id);
  }, []);

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    setDialogType(null);
  };

  const handleTextChange = (text: string, index: number) => {
    setTexts(prev => {
      const newTexts = [...prev];
      newTexts[index] = text;
      return newTexts;
    });
  };

  const allAvatars = avatarsData || [];
  const displayedAvatars = useMemo(() => 
    allAvatars.slice(0, visibleCount),
    [allAvatars, visibleCount]
  );

  if (isLoadingAvatars || isLoadingVoices || isLoadingCustom) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isErrorAvatars || isErrorVoices || isErrorCustom) {
    return (
      <div className="text-center text-red-500 py-8">
        Unable to load content. Please try again later.
      </div>
    );
  }


  return (
    <div className="h-[calc(100vh-300px)] overflow-y-auto px-4 space-y-6">
      {/* Navigation tabs */}
      <Suspense fallback={<div className="h-12 bg-slate-800 animate-pulse" />}>
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Suspense>

      {/* Avatar content */}
      {activeTab === 'custom' ? (
        <CustomAvatarSection
          isLoading={isLoadingCustom}
          avatars={customAvatars}
          selectedAvatar={selectedAvatar}
          hoveredAvatar={hoveredAvatar}
          onAvatarSelect={handleAvatarSelect}
          onAvatarHover={handleAvatarHover}
        />
      ) : (
        <Suspense fallback={<AvatarGridSkeleton />}>
          <AvatarList
            avatars={displayedAvatars}
            selectedAvatar={selectedAvatar}
            hoveredAvatar={hoveredAvatar}
            onAvatarSelect={handleAvatarSelect}
            onAvatarHover={handleAvatarHover}
            onVoiceClick={(avatar) => {
              setSelectedAvatar(avatar);
              setDialogType('voices');
            }}
            onPreviewClick={(avatar) => {
              setSelectedAvatar(avatar);
              setDialogType('preview');
            }}
          />
          
          {visibleCount < allAvatars.length && (
            <div ref={loadMoreRef} className="h-20" />
          )}
        </Suspense>
      )}

      {/* Dialog */}
      <Suspense fallback={null}>
        {dialogType && (
          <Dialog open={true} onOpenChange={(open) =>{
            !open && handleDialogClose()
            }}>
            <DialogContent className="max-w-4xl">
              <DialogTitle className="sr-only">
                {dialogType === 'voices' ? 'Select Voice' : 'Preview Avatar'}
              </DialogTitle>
              
              {dialogType === 'preview' && selectedAvatar && (
                <div className="space-y-4">
                  <div className="relative w-fit mx-auto">
                    <video
                      src={selectedAvatar.squared_preview_video || selectedAvatar.preview_video_1_1 || selectedAvatar.preview_video_16_9}
                      autoPlay
                      loop
                      controls
                      playsInline
                      className="max-h-[80vh] w-auto"
                      onError={(e) => {
                        console.error('Video load error:', e);
                        // Essayer une autre source si disponible
                        const video = e.currentTarget;
                        if (video.src === selectedAvatar.squared_preview_video && selectedAvatar.preview_video_1_1) {
                          video.src = selectedAvatar.preview_video_1_1;
                        } else if (video.src === selectedAvatar.preview_video_1_1 && selectedAvatar.preview_video_16_9) {
                          video.src = selectedAvatar.preview_video_16_9;
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{selectedAvatar.creator_name}</h3>
                      <p className="text-xs text-muted-foreground">{selectedAvatar.type}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialogType('voices')}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Select Voice
                    </Button>
                  </div>
                </div>
              )}

              {dialogType === 'voices' && (
                <div className="flex flex-col space-y-2 max-h-[70vh] overflow-y-auto">
                  <div className="sticky top-0 z-10 bg-background p-3 border-b">
                    <input
                      type="search"
                      placeholder="Search"
                      className="w-full bg-secondary/50 border-0 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="flex flex-col divide-y divide-border">
                    {voices?.map((voice) => (
                      <div 
                        key={`${voice.name}-${voice.accents[0].id}`} 
                        className="flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handlePlayVoice(voice.accents[0])}
                          >
                            {isPlaying === voice.accents[0].id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">{voice.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {voice.gender === 'male' ? 'Male' : 'Female'} Adult,{' '}
                              {voice.accents[0].accent_name}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVoiceSelect(voice.accents[0].id)}
                        >
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </Suspense>
    </div>
  );
}