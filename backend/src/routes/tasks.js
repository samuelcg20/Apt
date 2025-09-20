const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireCompany } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  domain: z.enum(['MARKETING', 'CODING', 'UIUX', 'FINANCE'], 'Invalid domain'),
  duration: z.string().min(1, 'Duration is required'),
  deliverables: z.string().min(1, 'Deliverables are required')
});

// Create task
router.post('/', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { title, description, domain, duration, deliverables } = taskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        title,
        description,
        domain,
        duration,
        deliverables,
        companyId: req.user.id
      },
      include: {
        company: {
          select: {
            id: true,
            email: true
          }
        },
        applications: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors 
      });
    }
    
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get all tasks with filtering
router.get('/', async (req, res) => {
  try {
    const { domain, status, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (domain) where.domain = domain;
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              email: true
            }
          },
          applications: {
            include: {
              student: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.task.count({ where })
    ]);

    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            email: true
          }
        },
        applications: {
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
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
});

// Update task
router.put('/:id', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, domain, duration, deliverables, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (domain) updateData.domain = domain;
    if (duration) updateData.duration = duration;
    if (deliverables) updateData.deliverables = deliverables;
    if (status) updateData.status = status;

    const task = await prisma.task.updateMany({
      where: {
        id,
        companyId: req.user.id
      },
      data: updateData
    });

    if (task.count === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.deleteMany({
      where: {
        id,
        companyId: req.user.id
      }
    });

    if (task.count === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get company's tasks
router.get('/company/my-tasks', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: { companyId: req.user.id },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          applications: {
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
          }
        }
      }),
      prisma.task.count({ where: { companyId: req.user.id } })
    ]);

    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get company tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
});

module.exports = router;
