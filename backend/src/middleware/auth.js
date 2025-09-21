const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../utils/jwt');
const { getMockUser } = require('../mockData');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  try {
    // For demo purposes, always return a mock user
    let userId = 'user_1'; // default mock user ID
    if (typeof decoded !== 'string' && decoded.userId) {
      userId = decoded.userId;
    }

    const user = getMockUser(userId);
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

const requireStudent = requireRole(['STUDENT']);
const requireCompany = requireRole(['COMPANY']);

module.exports = {
  authenticateToken,
  requireRole,
  requireStudent,
  requireCompany
};
