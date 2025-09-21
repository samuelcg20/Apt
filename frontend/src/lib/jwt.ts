import jwt from 'jsonwebtoken';

export const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'demo-jwt-secret-key-for-apt-platform',
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'demo-jwt-secret-key-for-apt-platform', // Using same secret for demo
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'demo-jwt-secret-key-for-apt-platform');
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'demo-jwt-secret-key-for-apt-platform'); // Using same secret for demo
  } catch (error) {
    return null;
  }
};
