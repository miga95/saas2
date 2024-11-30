export interface VoiceAccent {
    id: string;
    accent_name: string;
    preview_url: string;
  }
  
  export interface Voice {
    name: string;
    gender: string | null;
    accents: VoiceAccent[];
  }
  
  export type VoiceResponse = Voice[];