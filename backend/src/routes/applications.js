const express = require('express');
const { authenticateToken, requireStudent, requireCompany } = require('../middleware/auth');
const { getMockApplications, getMockTask } = require('../mockData');

const router = express.Router();

// Apply to task
router.post('/apply/:taskId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { taskId } = req.params;

    // Return error for new submissions as per requirements
    res.status(503).json({ 
      error: "Sorry, we are currently experiencing high traffic." 
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
    
    // Get mock applications for the user
    const allApplications = getMockApplications({ studentId: 'profile_1' }); // Using first profile for demo
    const total = allApplications.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const applications = allApplications.slice(skip, skip + parseInt(limit));

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
    
    // Verify task belongs to company
    const task = getMockTask(taskId);
    if (!task || task.companyId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Get mock applications for the task
    const allApplications = getMockApplications({ taskId });
    const total = allApplications.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const applications = allApplications.slice(skip, skip + parseInt(limit));

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

    // Return error for new submissions as per requirements
    res.status(503).json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Withdraw application (student action)
router.delete('/:applicationId', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Return error for new submissions as per requirements
    res.status(503).json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ error: 'Failed to withdraw application' });
  }
});

module.exports = router;
