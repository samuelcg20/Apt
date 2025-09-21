import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth';
import { getMockApplications, getMockTask } from '@/lib/mockData';

// GET - Get applications for a task (company view)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (authResult.user?.role !== 'COMPANY') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { taskId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Verify task belongs to company
    const task = getMockTask(taskId);
    if (!task || task.companyId !== authResult.user?.id) {
      return NextResponse.json({ error: 'Task not found or unauthorized' }, { status: 404 });
    }

    // Get mock applications for the task
    const allApplications = getMockApplications({ taskId });
    const total = allApplications.length;
    const skip = (page - 1) * limit;
    const applications = allApplications.slice(skip, skip + limit);

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get task applications error:', error);
    return NextResponse.json({ error: 'Failed to get applications' }, { status: 500 });
  }
}
