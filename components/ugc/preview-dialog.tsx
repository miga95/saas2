import { Avatar } from '@/types/avatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

interface PreviewDialogProps {
  avatar: Avatar | null;
  onClose: () => void;
  onVoiceSelect: () => void;
}

export function PreviewDialog({ avatar, onClose, onVoiceSelect }: PreviewDialogProps) {
  if (!avatar) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogTitle className="sr-only">Preview Avatar</DialogTitle>
        
        <div className="space-y-4">
          <div className="relative w-fit mx-auto">
            <video
              src={avatar.squared_preview_video || avatar.preview_video_1_1 || avatar.preview_video_16_9}
              autoPlay
              loop
              controls
              playsInline
              className="max-h-[80vh] w-auto"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">{avatar.creator_name}</h3>
              <p className="text-xs text-muted-foreground">{avatar.type}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onVoiceSelect}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Select Voice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 