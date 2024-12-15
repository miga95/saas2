import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

const RENDER_COST = 5; // Coût en crédits pour le rendu

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    // Vérifier les crédits de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.credits < RENDER_COST) {
      return NextResponse.json({
        error: 'Insufficient credits',
        requiredCredits: RENDER_COST,
        currentCredits: user.credits
      }, { status: 402 });
    }

    const body = await req.json();
    const { aspect_ratio, text, creator, green_screen, accent, no_caption, background_asset_image_url } = body;

    const response = await fetch('https://api.creatify.ai/api/lipsyncs/', {
      method: 'POST',
      headers: {
        'X-API-ID': process.env.CREATIFY_API_ID!,
        'X-API-KEY': process.env.CREATIFY_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        aspect_ratio,
        text,
        creator,
        green_screen,
        accent,
        no_caption,
        background_asset_image_url
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Invalid response' }));
      console.error('[RENDER_API_ERROR]', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        requestBody: body
      });
      
      return NextResponse.json({
        error: errorData.message || 'Failed to start render',
        details: errorData
      }, { status: response.status });
    }

    const data = await response.json();

    // Créer le projet
    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        creatifyId: data.id
      }
    });
 
    // Déduire les crédits après le succès du rendu
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: user.credits - RENDER_COST }
    });

    return NextResponse.json({ ...data, projectId: project.id });
  } catch (error) {
    console.error('[RENDER_ERROR]', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json({
      error: 'Internal Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 