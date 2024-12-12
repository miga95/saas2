import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const response = await fetch('https://api.creatify.ai/api/lipsyncs/', {
      headers: {
        'X-API-ID': process.env.CREATIFY_API_ID!,
        'X-API-KEY': process.env.CREATIFY_API_KEY!,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Invalid response' }));
      console.error('[PROJECTS_API_ERROR]', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      
      return new NextResponse(
        JSON.stringify({
          error: errorData.message || 'Failed to fetch projects',
          details: errorData
        }), 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[PROJECTS_ERROR]', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
} 