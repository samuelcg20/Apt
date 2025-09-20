const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

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

    // Check if reviewer and reviewee are different
    if (req.user.id === revieweeId) {
      return res.status(400).json({ error: 'Cannot review yourself' });
    }

    // Check if reviewee exists
    const reviewee = await prisma.user.findUnique({
      where: { id: revieweeId }
    });

    if (!reviewee) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        reviewerId_revieweeId: {
          reviewerId: req.user.id,
          revieweeId
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this user' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        reviewerId: req.user.id,
        revieweeId,
        rating,
        comment: comment || null
      },
      include: {
        reviewer: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        reviewee: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
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
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { revieweeId: userId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      }),
      prisma.review.count({ where: { revieweeId: userId } })
    ]);

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: { revieweeId: userId },
      _avg: {
        rating: true
      }
    });

    res.json({
      reviews,
      averageRating: avgRating._avg.rating || 0,
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
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { reviewerId: req.user.id },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          reviewee: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      }),
      prisma.review.count({ where: { reviewerId: req.user.id } })
    ]);

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

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Verify review belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        reviewerId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    await prisma.review.update({
      where: { id: reviewId },
      data: updateData
    });

    res.json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Verify review belongs to user
    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        reviewerId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    await prisma.review.delete({
      where: { id: reviewId }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
