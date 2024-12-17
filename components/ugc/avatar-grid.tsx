'use client';

import { SetStateAction, useState } from 'react';
import { ChevronRight, Wand2 } from 'lucide-react';
import { useAvatars } from '@/hooks/use-avatars';
import { useVoices } from '@/hooks/use-voices';
import { Avatar } from '@/types/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AvatarGridSkeleton } from './avatar-grid-skeleton';
import { AvatarList } from './avatar-list';
import { usePreview } from '@/hooks/use-preview';
import { PreviewDialog } from './preview-dialog';
import { VoiceDialog } from './voice-dialog';

interface AvatarGridProps {
  filters: {
    gender: string[];
    location: string[];
  };
  text: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
}

export function AvatarGrid({ filters, text, aspectRatio }: AvatarGridProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);
  const [dialogType, setDialogType] = useState<'preview' | 'voices' | null>(null);
  const [selectedAccentId, setSelectedAccentId] = useState<string | null>(null);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null);
  const [greenScreen, setGreenScreen] = useState(false);
  const { generatePreview, isGenerating } = usePreview();
  const { data: avatars, isLoading } = useAvatars(filters);
  const { data: voices } = useVoices();

  const handleGeneratePreview = async () => {
    if (!selectedAvatar || !text.trim()) return;
    try {
      generatePreview({
        avatarId: selectedAvatar.id,
        text,
        aspectRatio,
        accentId: selectedAccentId,
        greenScreen
      });
      toast.success('Preview generation started');
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  if (isLoading) return <AvatarGridSkeleton />;
  
  return (
    <div className="relative min-h-[600px]">
      <div className="space-y-8 pb-32">
        <div className="px-4">
          <div className="mb-4 flex items-center justify-end space-x-2">
            <Switch
              id="green-screen"
              checked={greenScreen}
              onCheckedChange={setGreenScreen}
            />
            <Label htmlFor="green-screen">
              {greenScreen ? 'No Background' : 'With Background'}
            </Label>
          </div>
          <AvatarList
            avatars={avatars || []}
            selectedAvatar={selectedAvatar}
            hoveredAvatar={hoveredAvatar}
            onAvatarSelect={setSelectedAvatar}
            onAvatarHover={setHoveredAvatar}
            onVoiceClick={(avatar) => {
              setSelectedAvatar(avatar);
              setDialogType('voices');
            }}
            onPreviewClick={(avatar) => {
              setSelectedAvatar(avatar);
              setDialogType('preview');
            }}
          />
        </div>
      </div>

      {selectedAvatar && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-background/0">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={selectedAvatar.preview_image_1_1} 
                alt={selectedAvatar.creator_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">{selectedAvatar.creator_name}</p>
                <button
                  onClick={() => setDialogType('voices')}
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  {selectedVoiceName ? `Selected voice : ${selectedVoiceName} • Change` : 'Select a voice (optional)'}
                </button>
              </div>
            </div>
            <Button 
              size="lg"
              onClick={handleGeneratePreview}
              disabled={isGenerating || !text.trim()}
              className={`shadow-lg px-8 min-w-[200px] transition-all duration-200 ${
                isGenerating 
                  ? 'bg-slate-700'
                  : selectedAccentId
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isGenerating ? (
                'Generating...'
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Video
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {dialogType === 'preview' && (
        <PreviewDialog
          avatar={selectedAvatar}
          onClose={() => setDialogType(null)}
          onVoiceSelect={() => setDialogType('voices')}
        />
      )}

      {dialogType === 'voices' && (
        <VoiceDialog
          onClose={() => setDialogType(null)}
          onVoiceSelect={(voiceId: SetStateAction<string | null>) => {
            setSelectedAccentId(voiceId);
            if (typeof voiceId === 'string' && voices) {
              const selectedVoice = voices.find(voice => 
                voice.accents.some(accent => accent.id === voiceId)
              );
              if (selectedVoice) {
                setSelectedVoiceName(selectedVoice.name);
              }
            }
            setDialogType(null);
          }}
        />
      )}
    </div>
  );
}