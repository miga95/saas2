import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export async function GET(
  _req: Request,
  props: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await getAuthSession();
    const params = await props.params;

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;

    const response = await fetch(`https://api.creatify.ai/api/lipsyncs/${id}/`, {
      headers: {
        'X-API-ID': process.env.CREATIFY_API_ID!,
        'X-API-KEY': process.env.CREATIFY_API_KEY!,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Invalid response' }));
      console.error('[PROJECT_API_ERROR]', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      
      return new NextResponse(
        JSON.stringify({
          error: errorData.message || 'Failed to fetch project',
          details: errorData
        }), 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[PROJECT_ERROR]', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
}
