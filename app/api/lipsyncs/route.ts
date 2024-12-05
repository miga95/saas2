import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

const API_CONFIG = {
  CREATIFY_API_URL: process.env.CREATIFY_API_URL || 'https://api.creatify.ai/api',
  CREATIFY_API_ID: process.env.CREATIFY_API_ID,
  CREATIFY_API_KEY: process.env.CREATIFY_API_KEY,
};

interface LipsyncStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: string;
  progress?: number;
  failed_reason?: string;
  preview?: string;
  audio_url?: string;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('ID manquant', { status: 400 });
    }

    const response = await fetch(
      `${API_CONFIG.CREATIFY_API_URL}/lipsyncs/${id}/`,
      {
        headers: {
          'X-API-ID': API_CONFIG.CREATIFY_API_ID!,
          'X-API-KEY': API_CONFIG.CREATIFY_API_KEY!,
          'Accept': 'application/json',
        },
        cache: 'no-store', // Désactiver le cache pour obtenir le statut en temps réel
      }
    );

    if (!response.ok) {
      throw new Error(`L'API a répondu avec le statut ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data); // Pour déboguer
    
    // Transformer la réponse pour correspondre à notre interface
    const status: LipsyncStatus = {
      id: data.id,
      status: data.status || 'pending',
      output: data.output || undefined,
      progress: data.progress || 0,
      failed_reason: data.failed_reason,
      preview: data.preview,
      audio_url: data.audio_url,
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Erreur de vérification du statut:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Échec de la vérification du statut',
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const body = await req.json();
    const { text, avatarId, aspectRatio } = body;

    // Log les données reçues
    console.log('Received data:', { text, avatarId, aspectRatio });

    const payload = {
      text: text,
      creator: avatarId,
      aspect_ratio: aspectRatio.replace(':', 'x'),
      name: "Generated video", // Ajout du champ name requis
      green_screen: false, // Ajout des champs optionnels
      no_caption: true,
      no_music: true,
      caption_style: "normal-black",
      caption_position: "center",
      caption_offset_x: "0",
      caption_offset_y: "0.45"
    };

    // Log le payload final
    console.log('Sending payload:', payload);

    const response = await fetch(
      `${API_CONFIG.CREATIFY_API_URL}/lipsyncs/`,
      {
        method: 'POST',
        headers: {
          'X-API-ID': API_CONFIG.CREATIFY_API_ID!,
          'X-API-KEY': API_CONFIG.CREATIFY_API_KEY!,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Erreur API détaillée:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(
        errorData?.detail || errorData?.message || 
        `L'API a répondu avec le statut ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API Lipsync complète:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Échec de la génération de la vidéo',
      { status: 500 }
    );
  }
} 