import jwt from 'jsonwebtoken';
import { verifyAccessToken } from './jwt';
import { getMockUser } from './mockData';

export const authenticateToken = async (request: Request) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { success: false, error: 'Access token required', status: 401 };
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return { success: false, error: 'Invalid or expired token', status: 403 };
  }

  try {
    // For demo purposes, always return a mock user
    const user = getMockUser(decoded.userId || 'user_1');
    return { success: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed', status: 500 };
  }
};

// Export is already done above
