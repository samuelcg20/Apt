import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateToken } from '@/lib/auth';

// Validation schema
const portfolioProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url().optional().or(z.literal(''))
});

// PUT - Update portfolio project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (authResult.user?.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, link } = portfolioProjectSchema.parse(body);

    // Return error for new submissions as per requirements
    return NextResponse.json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    }, { status: 503 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error',
        details: error.issues 
      }, { status: 400 });
    }
    
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE - Delete portfolio project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (authResult.user?.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Return error for new submissions as per requirements
    return NextResponse.json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    }, { status: 503 });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
