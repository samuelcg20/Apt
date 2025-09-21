import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth';

// POST - Apply to task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
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
    console.error('Apply to task error:', error);
    return NextResponse.json({ error: 'Failed to apply to task' }, { status: 500 });
  }
}
