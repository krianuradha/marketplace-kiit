import { NextRequest, NextResponse } from 'next/server';
import { db, products, users } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

// GET - Get product details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        negotiable: products.negotiable,
        usedTime: products.usedTime,
        imageUrl: products.imageUrl,
        category: products.category,
        section: products.section,
        isSold: products.isSold,
        createdAt: products.createdAt,
        seller: {
          id: users.id,
          name: users.name,
          gender: users.gender,
        },
      })
      .from(products)
      .innerJoin(users, eq(products.userId, users.id))
      .where(eq(products.id, id))
      .limit(1);

    if (!product[0]) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: product[0] }, { status: 200 });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (only owner can delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if product exists and belongs to user
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product[0]) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product[0].userId !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete product
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
