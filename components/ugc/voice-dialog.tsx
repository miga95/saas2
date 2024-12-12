import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useVoices } from '@/hooks/use-voices';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

interface VoiceDialogProps {
  onClose: () => void;
  onVoiceSelect: (voiceId: string) => void;
}

export function VoiceDialog({ onClose, onVoiceSelect }: VoiceDialogProps) {
  const { data: voices } = useVoices();
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayVoice = async (voiceId: string, previewUrl: string) => {
    try {
      if (isPlaying === voiceId) {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(null);
        }
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(previewUrl);
      audioRef.current = audio;

      await audio.play();
      setIsPlaying(voiceId);

      audio.onended = () => {
        setIsPlaying(null);
      };
    } catch (error) {
      console.error('Error playing voice:', error);
      toast.error('Failed to play voice preview');
      setIsPlaying(null);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogTitle className="sr-only">Select Voice</DialogTitle>
        
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
                    onClick={() => handlePlayVoice(voice.accents[0].id, voice.accents[0].preview_url)}
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
                  onClick={() => onVoiceSelect(voice.accents[0].id)}
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 