import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateTokens } from '@/lib/jwt';
import { getMockUser } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 401 });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
    }

    // For demo purposes, always return mock user
    // decoded may be a string or JwtPayload; userId is only on JwtPayload
    const userId =
      typeof decoded === 'object' && decoded !== null && 'userId' in decoded
        ? (decoded as { userId: string }).userId
        : 'user_1';
    const mockUser = getMockUser(userId);

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(mockUser.id, mockUser.role);

    return NextResponse.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 });
  }
}
