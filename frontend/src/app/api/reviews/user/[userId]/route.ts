import { NextRequest, NextResponse } from 'next/server';
import { getMockReviews } from '@/lib/mockData';

// GET - Get reviews for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Get mock reviews for the user
    const allReviews = getMockReviews({ revieweeId: userId });
    const total = allReviews.length;
    const skip = (page - 1) * limit;
    const reviews = allReviews.slice(skip, skip + limit);

    // Calculate average rating
    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
      : 0;

    return NextResponse.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: total,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json({ error: 'Failed to get reviews' }, { status: 500 });
  }
}
