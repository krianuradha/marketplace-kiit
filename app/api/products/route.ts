import { NextRequest, NextResponse } from 'next/server';
import { db, products, users } from '@/lib/db';
import { createProductSchema } from '@/lib/validators';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { eq, and, or } from 'drizzle-orm';

// GET - List products with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get('section');
    const category = searchParams.get('category');
    const sold = searchParams.get('sold');

    let query = db.select({
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
    }).from(products)
      .innerJoin(users, eq(products.userId, users.id));

    // Apply filters
    const filters = [];

    if (section) {
      filters.push(eq(products.section, section as any));
    }

    if (category) {
      filters.push(eq(products.category, category as any));
    }

    if (sold === 'false') {
      filters.push(eq(products.isSold, false));
    }

    if (filters.length > 0) {
      query = query.where(and(...filters));
    }

    const result = await query.orderBy(products.createdAt);

    return NextResponse.json({ products: result }, { status: 200 });
  } catch (error) {
    console.error('Products list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create product
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Create product with price in cents
    const newProduct = await db
      .insert(products)
      .values({
        userId: user.userId,
        title: validatedData.title,
        description: validatedData.description,
        price: Math.round(validatedData.price * 100), // Convert to cents
        negotiable: validatedData.negotiable,
        usedTime: validatedData.usedTime,
        imageUrl: validatedData.imageUrl,
        category: validatedData.category,
        section: validatedData.section,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        product: newProduct[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 400 }
    );
  }
}
