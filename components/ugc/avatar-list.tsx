import { memo } from 'react';
import { Avatar } from '@/types/avatar';
import { AvatarCard } from './avatar-card';

interface AvatarListProps {
  avatars: Avatar[];
  selectedAvatar: Avatar | null;
  hoveredAvatar: string | null;
  onAvatarSelect: (avatar: Avatar) => void;
  onAvatarHover: (id: string | null) => void;
  onVoiceClick: (avatar: Avatar) => void;
  onPreviewClick: (avatar: Avatar) => void;
}

export const AvatarList = memo(({ 
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