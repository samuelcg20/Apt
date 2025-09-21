import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateTokens } from '@/lib/jwt';
import { getMockUser } from '@/lib/mockData';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // For demo purposes, always return successful login with mock user
    const mockUser = getMockUser('user_1'); // Default to first mock user

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(mockUser.id, mockUser.role);

    return NextResponse.json({
      message: 'Login successful',
      user: mockUser,
      accessToken,
      refreshToken
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error',
        details: error.errors 
      }, { status: 400 });
    }
    
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
