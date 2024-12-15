import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    const body = await req.json();
    const { avatarId, text, aspectRatio, backgroundAssetImageUrl, accentId, greenScreen } = body;

    const formattedRatio = aspectRatio?.replace(':', 'x') || '9x16';
    const response = await fetch('https://api.creatify.ai/api/lipsyncs/preview/', {
      method: 'POST',
      headers: {
        'X-API-ID': process.env.CREATIFY_API_ID!,
        'X-API-KEY': process.env.CREATIFY_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        aspect_ratio: formattedRatio,
        text: text,
        creator: avatarId,
        name: null,
        audio: null,
        green_screen: greenScreen || false,
        webhook_url: null,
        accent: accentId,
        no_caption: false,
        no_music: false,
        caption_style: 'normal-white',
        caption_position: 'center',
        caption_offset_x: '0',
        caption_offset_y: '-0.4',
        background_asset_image_url: backgroundAssetImageUrl
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Invalid response' }));
      console.error('[PREVIEW_API_ERROR]', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        requestBody: body
      });
      
      return NextResponse.json({
        error: errorData.message || 'Failed to generate preview',
        details: errorData
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[PREVIEW_ERROR]', error);
    return NextResponse.json({
      error: 'Internal Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}