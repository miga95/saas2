import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

const API_CONFIG = {
  CREATIFY_API_URL: 'https://api.creatify.ai/api',
  CREATIFY_API_ID: '01e619ce-0e5f-467d-872d-7edfb8eacd46',
  CREATIFY_API_KEY: '6c0389e16e3fbc4190ab75ee1ff3e99bd56dcf9a'
};

export async function GET() {
  try {
    const session = await getAuthSession();
    const response = await fetch(`${API_CONFIG.CREATIFY_API_URL}/personas_v2/`, {
      headers: {
        'X-API-ID': API_CONFIG.CREATIFY_API_ID,
        'X-API-KEY': API_CONFIG.CREATIFY_API_KEY,
        'Accept': 'application/json'
      },
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Custom avatars response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching custom avatars:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Failed to fetch custom avatars',
      { status: 500 }
    );
  }
} 