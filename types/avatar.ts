export interface Avatar {
  id: string;
  created_at: string;
  updated_at: string;
  gender: 'm' | 'f';
  creator_name: string;
  video_scene: string;
  keywords: string;
  preview_image_16_9: string;
  preview_image_1_1: string;
  preview_image_9_16: string;
  preview_video_16_9: string;
  preview_video_1_1: string;
  preview_video_9_16: string;
  landscape_preview_video: string;
  squared_preview_video: string;
  is_active: boolean;
  process_status: string;
  failed_reason: string;
  type: string;
}

// types/avatar.ts
export interface AvatarResponse {
  results: Avatar[];
  count: number;
  page: number;
}
