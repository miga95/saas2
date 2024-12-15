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
    const response = await fetch(`${API_CONFIG.CREATIFY_API_URL}/personas/`, {
      headers: {
        'X-API-ID': API_CONFIG.CREATIFY_API_ID!,
        'X-API-KEY': API_CONFIG.CREATIFY_API_KEY!,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching avatars:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Failed to fetch avatars',
      { status: 500 }
    );
  }
}