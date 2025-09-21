import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateTokens } from '@/lib/jwt';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'COMPANY'], 'Invalid role')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = registerSchema.parse(body);

    // For demo purposes, always return success with mock user
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      role,
      createdAt: new Date().toISOString()
    };

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(mockUser.id, mockUser.role);

    return NextResponse.json({
      message: 'User created successfully',
      user: mockUser,
      accessToken,
      refreshToken
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error',
        details: error.issues
      }, { status: 400 });
    }
    
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
