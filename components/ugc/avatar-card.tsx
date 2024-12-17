import { memo } from 'react';
import { Avatar } from '@/types/avatar';
import { Button } from '@/components/ui/button';
import { Volume2, Maximize2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarCardProps {
  avatar: Avatar;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (avatar: Avatar) => void;
  onHover: (id: string | null) => void;
  onVoiceClick: (avatar: Avatar) => void;
  onPreviewClick: (avatar: Avatar) => void;
}

export const AvatarCard = memo(({ 
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
      className={cn(
        "relative group aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-200",
        isSelected ? "ring-2 ring-green-500" : "bg-slate-900"
      )}
      onMouseEnter={() => onHover(avatar.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(avatar)}
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
          onClick={(e) => {
            e.stopPropagation();
            onVoiceClick(avatar);
          }}
        >
          <Volume2 className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onPreviewClick(avatar);
          }}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
});

AvatarCard.displayName = 'AvatarCard'; 