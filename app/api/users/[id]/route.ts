import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

function getSql() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString || ['undefined', 'null', 'none'].includes(connectionString.toLowerCase())) {
    return null;
  }

  return neon(connectionString);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sql = getSql();
    if (!sql) {
      return NextResponse.json(
        { error: 'Database is not configured' },
        { status: 503 }
      );
    }

    const user = await sql`
      SELECT id, name, email, avatar_url, gender, created_at
      FROM users
      WHERE id = ${id}
      LIMIT 1;
    `;

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
