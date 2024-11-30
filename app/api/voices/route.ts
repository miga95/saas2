import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

const API_CONFIG = {
  CREATIFY_API_URL: process.env.CREATIFY_API_URL || 'https://api.creatify.ai/api',
  CREATIFY_API_ID: process.env.CREATIFY_API_ID,
  CREATIFY_API_KEY: process.env.CREATIFY_API_KEY,
};

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!API_CONFIG.CREATIFY_API_ID || !API_CONFIG.CREATIFY_API_KEY) {
      console.error('Missing API configuration');
      return new NextResponse(
        'API configuration missing',
        { status: 500 }
      );
    }

    const response = await fetch(
      `${API_CONFIG.CREATIFY_API_URL}/voices/`,
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
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Voices API error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Failed to fetch voices',
      { status: 500 }
    );
  }
}