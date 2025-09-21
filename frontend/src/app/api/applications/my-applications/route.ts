import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth';
import { getMockApplications } from '@/lib/mockData';

// GET - Get student's applications
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (authResult.user?.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Get mock applications for the user
    const allApplications = getMockApplications({ studentId: 'profile_1' }); // Using first profile for demo
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
    console.error('Get applications error:', error);
    return NextResponse.json({ error: 'Failed to get applications' }, { status: 500 });
  }
}
