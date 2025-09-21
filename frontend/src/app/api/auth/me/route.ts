import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth';
import { getMockUser, getMockStudentProfile } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const user = getMockUser(authResult.user.id);
    const studentProfile = getMockStudentProfile(authResult.user.id);
    
    const userWithProfile = {
      ...user,
      studentProfile
    };

    return NextResponse.json({ user: userWithProfile });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}
