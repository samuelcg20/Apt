import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateToken } from '@/lib/auth';
import { getMockStudentProfile } from '@/lib/mockData';

// Validation schemas
const studentProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  university: z.string().min(1, 'University is required'),
  yearOfStudy: z.number().int().min(1).max(10, 'Invalid year of study'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  bio: z.string().optional()
});

// PUT - Create or update student profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (authResult.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { name, university, yearOfStudy, skills, bio } = studentProfileSchema.parse(body);

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
    
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Profile update failed' }, { status: 500 });
  }
}

// GET - Get student profile
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    if (authResult.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const profile = getMockStudentProfile(authResult.user.id);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}
