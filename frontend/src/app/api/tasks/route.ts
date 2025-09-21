import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateToken } from '@/lib/auth';
import { getMockTasks, getMockTask } from '@/lib/mockData';

// Validation schema
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  domain: z.enum(['MARKETING', 'CODING', 'UIUX', 'FINANCE'], 'Invalid domain'),
  duration: z.string().min(1, 'Duration is required'),
  deliverables: z.string().min(1, 'Deliverables are required')
});

// POST - Create task
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (authResult.user.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, domain, duration, deliverables } = taskSchema.parse(body);

    // Return error for new submissions as per requirements
    return NextResponse.json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    }, { status: 503 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error',
        details: error.errors 
      }, { status: 400 });
    }
    
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// GET - Get all tasks with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const filters: { domain?: string; status?: string } = {};
    if (domain) filters.domain = domain;
    if (status) filters.status = status;

    const allTasks = getMockTasks(filters);
    const total = allTasks.length;
    const skip = (page - 1) * limit;
    const tasks = allTasks.slice(skip, skip + limit);

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'Failed to get tasks' }, { status: 500 });
  }
}
