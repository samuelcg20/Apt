const express = require('express');
const { z } = require('zod');
const { authenticateToken } = require('../middleware/auth');
const { getMockReviews } = require('../mockData');

const router = express.Router();

// Validation schema
const reviewSchema = z.object({
  revieweeId: z.string().min(1, 'Reviewee ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().optional()
});

// Create review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { revieweeId, rating, comment } = reviewSchema.parse(req.body);

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
    
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Get mock reviews for the user
    const allReviews = getMockReviews({ revieweeId: userId });
    const total = allReviews.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = allReviews.slice(skip, skip + parseInt(limit));

    // Calculate average rating
    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
      : 0;

    res.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// Get reviews given by current user
router.get('/my-reviews', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Get mock reviews given by the user
    const allReviews = getMockReviews({ reviewerId: req.user.id });
    const total = allReviews.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = allReviews.slice(skip, skip + parseInt(limit));

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// Update review
router.put('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Return error for new submissions as per requirements
    res.status(503).json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Return error for new submissions as per requirements
    res.status(503).json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
