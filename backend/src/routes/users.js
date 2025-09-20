const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireStudent } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const studentProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  university: z.string().min(1, 'University is required'),
  yearOfStudy: z.number().int().min(1).max(10, 'Invalid year of study'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  bio: z.string().optional()
});

const portfolioProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url().optional().or(z.literal(''))
});

// Create or update student profile
router.put('/profile', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { name, university, yearOfStudy, skills, bio } = studentProfileSchema.parse(req.body);

    const profile = await prisma.studentProfile.upsert({
      where: { userId: req.user.id },
      update: {
        name,
        university,
        yearOfStudy,
        skills,
        bio
      },
      create: {
        name,
        university,
        yearOfStudy,
        skills,
        bio,
        userId: req.user.id
      },
      include: {
        projects: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Get student profile
router.get('/profile', authenticateToken, requireStudent, async (req, res) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        projects: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Add portfolio project
router.post('/profile/projects', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { title, description, link } = portfolioProjectSchema.parse(req.body);

    // Get student profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const project = await prisma.portfolioProject.create({
      data: {
        title,
        description,
        link: link || null,
        studentId: profile.id
      }
    });

    res.status(201).json({
      message: 'Project added successfully',
      project
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Add project error:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Update portfolio project
router.put('/profile/projects/:projectId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, link } = portfolioProjectSchema.parse(req.body);

    // Verify project belongs to user
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const project = await prisma.portfolioProject.updateMany({
      where: {
        id: projectId,
        studentId: profile.id
      },
      data: {
        title,
        description,
        link: link || null
      }
    });

    if (project.count === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete portfolio project
router.delete('/profile/projects/:projectId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project belongs to user
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const project = await prisma.portfolioProject.deleteMany({
      where: {
        id: projectId,
        studentId: profile.id
      }
    });

    if (project.count === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Get public student profile by ID
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        projects: true,
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

module.exports = router;
