const express = require('express');
const { z } = require('zod');
const { authenticateToken, requireCompany } = require('../middleware/auth');
const { getMockTasks, getMockTask } = require('../mockData');

const router = express.Router();

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

    // Return error for new submissions as per requirements
    res.status(503).json({ 
      error: "Sorry, we are currently experiencing high traffic." 
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
    
    const filters = {};
    if (domain) filters.domain = domain;
    if (status) filters.status = status;

    const allTasks = getMockTasks(filters);
    const total = allTasks.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const tasks = allTasks.slice(skip, skip + parseInt(limit));

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

    const task = getMockTask(id);

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

    // Return error for new submissions as per requirements
    res.status(503).json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { id } = req.params;

    // Return error for new submissions as per requirements
    res.status(503).json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get company's tasks
router.get('/company/my-tasks', authenticateToken, requireCompany, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Filter tasks by company ID (using mock data)
    const companyTasks = getMockTasks().filter(task => task.companyId === req.user.id);
    const total = companyTasks.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const tasks = companyTasks.slice(skip, skip + parseInt(limit));

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
