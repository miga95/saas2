import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Récupérer les projets de l'utilisateur depuis Prisma
    const userProjects = await prisma.project.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!userProjects.length) {
      return NextResponse.json([]);
    }

    const projectsWithDetails = await Promise.all(
      userProjects.map(async (project) => {
        try {
          const response = await fetch(`https://api.creatify.ai/api/lipsyncs/${project.creatifyProjectId}`, {
            headers: {
              'X-API-ID': process.env.CREATIFY_API_ID!,
              'X-API-KEY': process.env.CREATIFY_API_KEY!,
            },
          });

          if (!response.ok) {
            console.error(`Failed to fetch project ${project.creatifyProjectId}:`, response.status);
            return null;
          }

          const projectData = await response.json();
          return projectData;
        } catch (error) {
          console.error(`Error fetching project ${project.creatifyProjectId}:`, error);
          return null;
        }
      })
    );

    const validProjects = projectsWithDetails.filter(Boolean);
    return NextResponse.json(validProjects);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[PROJECTS_ERROR]', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Internal Error', 
        details: errorMessage 
      }, 
      { status: 500 }
    );
  }
} 