import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { previewId: string } }
) {
  try {
    const session = await getAuthSession();
    const { previewId } = await params;

    const response = await fetch(`${process.env.CREATIFY_API_URL}/lipsyncs/${previewId}`, {
      headers: {
        'X-API-ID': process.env.CREATIFY_API_ID!,
        'X-API-KEY': process.env.CREATIFY_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch preview status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) { 
    console.error('[PREVIEW_STATUS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 