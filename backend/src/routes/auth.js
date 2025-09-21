const express = require('express');
const { z } = require('zod');
const { generateTokens, verifyRefreshToken } = require('../utils/jwt');
const { authenticateToken } = require('../middleware/auth');
const { getMockUser, getMockStudentProfile } = require('../mockData');

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'COMPANY'], 'Invalid role')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = registerSchema.parse(req.body);

    // For demo purposes, always return success with mock user
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      role,
      createdAt: new Date().toISOString()
    };

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(mockUser.id, mockUser.role);

    res.status(201).json({
      message: 'User created successfully',
      user: mockUser,
      accessToken,
      refreshToken
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // For demo purposes, always return successful login with mock user
    const mockUser = getMockUser('user_1'); // Default to first mock user

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(mockUser.id, mockUser.role);

    res.json({
      message: 'Login successful',
      user: mockUser,
      accessToken,
      refreshToken
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // For demo purposes, always return mock user
    const mockUser = getMockUser(decoded.userId || 'user_1');

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(mockUser.id, mockUser.role);

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = getMockUser(req.user.id);
    const studentProfile = getMockStudentProfile(req.user.id);
    
    const userWithProfile = {
      ...user,
      studentProfile
    };

    res.json({ user: userWithProfile });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
