import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateToken } from '@/lib/auth';

// Validation schema
const reviewSchema = z.object({
  revieweeId: z.string().min(1, 'Reviewee ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().optional()
});

// POST - Create review
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { revieweeId, rating, comment } = reviewSchema.parse(body);

    // Return error for new submissions as per requirements
    return NextResponse.json({ 
      error: "Sorry, we are currently experiencing high traffic." 
    }, { status: 503 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error',
        details: error.issues 
      }, { status: 400 });
    }
    
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
