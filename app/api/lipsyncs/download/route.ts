import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

const API_CONFIG = {
  CREATIFY_API_URL: process.env.CREATIFY_API_URL || 'https://api.creatify.ai/api',
  CREATIFY_API_ID: process.env.CREATIFY_API_ID,
  CREATIFY_API_KEY: process.env.CREATIFY_API_KEY,
};

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return new NextResponse('URL manquante', { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        'X-API-ID': API_CONFIG.CREATIFY_API_ID!,
        'X-API-KEY': API_CONFIG.CREATIFY_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`Échec du téléchargement: ${response.status}`);
    }

    const blob = await response.blob();
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="video-${Date.now()}.mp4"`,
      },
    });
  } catch (error) {
    console.error('Erreur de téléchargement:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Échec du téléchargement',
      { status: 500 }
    );
  }
} 