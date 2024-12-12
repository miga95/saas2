'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useAvatars } from '@/hooks/use-avatars';
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
  const [greenScreen, setGreenScreen] = useState(false);
  const { generatePreview, isGenerating } = usePreview();
  const { data: avatars, isLoading } = useAvatars(filters);

  const handleGeneratePreview = async () => {
    if (!selectedAvatar || !text.trim()) return;
    try {
      await generatePreview({ 
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
      <div className="space-y-8 pb-24">
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
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <Button 
            size="lg"
            onClick={handleGeneratePreview}
            disabled={isGenerating || !text.trim()}
            className="shadow-lg transition-opacity opacity-90 hover:opacity-100 px-8"
          >
            {isGenerating ? 'Generating...' : 'Next'}
            {!isGenerating && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
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
          onVoiceSelect={(voiceId) => {
            setSelectedAccentId(voiceId);
            setDialogType(null);
          }}
        />
      )}
    </div>
  );
}