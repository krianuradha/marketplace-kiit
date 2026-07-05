import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getSql() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString || ['undefined', 'null', 'none'].includes(connectionString.toLowerCase())) {
    return null;
  }

  return neon(connectionString);
}

export async function POST(request: NextRequest) {
  try {
    const { sellerId, buyerId, productId, rating, review } = await request.json();

    if (!sellerId || !buyerId || !productId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const sql = getSql();
    if (!sql) {
      return NextResponse.json(
        { error: 'Database is not configured' },
        { status: 503 }
      );
    }

    const result = await sql`
      INSERT INTO ratings (seller_id, buyer_id, product_id, rating, review)
      VALUES (${sellerId}, ${buyerId}, ${productId}, ${rating}, ${review})
      RETURNING *;
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Rating creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create rating' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json(
        { error: 'sellerId is required' },
        { status: 400 }
      );
    }

    const sql = getSql();
    if (!sql) {
      return NextResponse.json(
        { error: 'Database is not configured' },
        { status: 503 }
      );
    }

    const ratings = await sql`
      SELECT r.*, u.name as buyer_name, u.avatar_url, p.title as product_title
      FROM ratings r
      JOIN users u ON r.buyer_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE r.seller_id = ${sellerId}
      ORDER BY r.created_at DESC;
    `;

    const averageResult = await sql`
      SELECT AVG(rating) as average_rating, COUNT(*) as total_ratings
      FROM ratings
      WHERE seller_id = ${sellerId};
    `;

    const { average_rating, total_ratings } = averageResult[0];

    return NextResponse.json({
      ratings,
      stats: {
        averageRating: average_rating ? parseFloat(average_rating) : 0,
        totalRatings: parseInt(total_ratings),
      },
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}
