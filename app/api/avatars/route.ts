import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

const API_CONFIG = {
  CREATIFY_API_URL: process.env.CREATIFY_API_URL || 'https://api.creatify.ai/api',
  CREATIFY_API_ID: process.env.CREATIFY_API_ID,
  CREATIFY_API_KEY: process.env.CREATIFY_API_KEY,
};

export async function GET(req: NextRequest) {
  try {
    if (!API_CONFIG.CREATIFY_API_ID || !API_CONFIG.CREATIFY_API_KEY) {
      console.error('Missing Creatify API credentials');
      return new NextResponse(
        'API configuration missing',
        { status: 500 }
      );
    }

    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';

    const response = await fetch(
      `${API_CONFIG.CREATIFY_API_URL}/personas/?page=${page}`,
      {
        headers: {
          'X-API-ID': API_CONFIG.CREATIFY_API_ID,
          'X-API-KEY': API_CONFIG.CREATIFY_API_KEY,
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      results: data,
      count: Array.isArray(data) ? data.length : 0,
      page: parseInt(page),
    });
  } catch (error) {
    console.error('Avatar API error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Failed to fetch avatars',
      { status: 500 }
    );
  }
}