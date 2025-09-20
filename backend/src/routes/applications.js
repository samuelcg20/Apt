const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireStudent, requireCompany } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply to task
router.post('/apply/:taskId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check if task exists and is open
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.status !== 'OPEN') {
      return res.status(400).json({ error: 'Task is not open for applications' });
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!studentProfile) {
      return res.status(400).json({ error: 'Student profile not found. Please create your profile first.' });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        taskId_studentId: {
          taskId,
          studentId: studentProfile.id
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this task' });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        taskId,
        studentId: studentProfile.id
      },
      include: {
        task: {
          include: {
            company: {
              select: {
                id: true,
                email: true
              }
            }
          }
        },
        student: {
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            },
            projects: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply to task error:', error);
    res.status(500).json({ error: 'Failed to apply to task' });
  }
});

// Get student's applications
router.get('/my-applications', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!studentProfile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { studentId: studentProfile.id },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          task: {
            include: {
              company: {
                select: {
                  id: true,
                  email: true
                }
              }
            }
          }
        }
      }),
      prisma.application.count({ where: { studentId: studentProfile.id } })
    ]);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to get applications' });
  }
});

// Get applications for a task (company view)
router.get('/task/:taskId', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Verify task belongs to company
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        companyId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { taskId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true
                }
              },
              projects: true
            }
          }
        }
      }),
      prisma.application.count({ where: { taskId } })
    ]);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get task applications error:', error);
    res.status(500).json({ error: 'Failed to get applications' });
  }
});

// Update application status (company action)
router.put('/:applicationId/status', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!['APPLIED', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Verify application belongs to company's task
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        task: {
          companyId: req.user.id
        }
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { status }
    });

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Withdraw application (student action)
router.delete('/:applicationId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!studentProfile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Verify application belongs to student
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        studentId: studentProfile.id
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }

    await prisma.application.delete({
      where: { id: applicationId }
    });

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ error: 'Failed to withdraw application' });
  }
});

module.exports = router;
