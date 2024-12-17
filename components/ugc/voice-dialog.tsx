'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Star, Search, ChevronDown } from 'lucide-react';
import { useVoices } from '@/hooks/use-voices';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoiceDialogProps {
  onClose: () => void;
  onVoiceSelect: (voiceId: string) => void;
}

export function VoiceDialog({ onClose, onVoiceSelect }: VoiceDialogProps) {
  const { data: voices } = useVoices();
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
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

  const filteredVoices = voices?.filter(voice => {
    const matchesSearch = 
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.accents.some(accent => 
        accent.accent_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesGender = selectedGender === 'all' || voice.gender === selectedGender;
    
    return matchesSearch && matchesGender;
  });

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Choose voice</h2>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Select
                value={selectedGender}
                onValueChange={setSelectedGender}
              >
                <SelectTrigger className="w-[120px] bg-secondary/50">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Star className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search voice by key words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto border-t border-border">
          <div className="grid grid-cols-1 divide-y divide-border">
            {filteredVoices?.map((voice) => (
              voice.accents.map((accent) => (
                <div 
                  key={accent.id}
                  className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePlayVoice(accent.id, accent.preview_url)}
                    >
                      {isPlaying === accent.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <p className="font-medium">{voice.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {voice.gender === 'male' ? 'Male' : 'Female'}, {accent.accent_name}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onVoiceSelect(accent.id)}
                  >
                    Use this voice
                  </Button>
                </div>
              ))
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-between">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-indigo-500 hover:bg-indigo-600" 
            onClick={onClose}
            disabled={!isPlaying}
          >
            Use this voice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 