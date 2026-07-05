import { NextRequest, NextResponse } from 'next/server';
import { db, chats, products, users, messages } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { eq, and, or } from 'drizzle-orm';

// GET - Get all chats for current user
export async function GET(request: NextRequest) {
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

    // Get chats where user is buyer or seller
    const userChats = await db
      .select({
        id: chats.id,
        product: {
          id: products.id,
          title: products.title,
          imageUrl: products.imageUrl,
          price: products.price,
        },
        otherUser: {
          id: users.id,
          name: users.name,
        },
        createdAt: chats.createdAt,
      })
      .from(chats)
      .innerJoin(products, eq(chats.productId, products.id))
      .innerJoin(
        users,
        or(
          and(
            eq(chats.buyerId, user.userId),
            eq(users.id, chats.sellerId)
          ),
          and(
            eq(chats.sellerId, user.userId),
            eq(users.id, chats.buyerId)
          )
        )
      )
      .where(
        or(
          eq(chats.buyerId, user.userId),
          eq(chats.sellerId, user.userId)
        )
      )
      .orderBy(chats.createdAt);

    return NextResponse.json({ chats: userChats }, { status: 200 });
  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

// POST - Create or get chat room
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
    const { productId, buyerId } = body;

    if (!productId || !buyerId) {
      return NextResponse.json(
        { error: 'Missing productId or buyerId' },
        { status: 400 }
      );
    }

    // Get product and verify seller
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product[0]) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if chat already exists
    const existingChat = await db
      .select()
      .from(chats)
      .where(
        and(
          eq(chats.productId, productId),
          eq(chats.buyerId, buyerId),
          eq(chats.sellerId, product[0].userId)
        )
      )
      .limit(1);

    if (existingChat[0]) {
      return NextResponse.json(
        { chat: existingChat[0] },
        { status: 200 }
      );
    }

    // Create new chat
    const newChat = await db
      .insert(chats)
      .values({
        buyerId,
        sellerId: product[0].userId,
        productId,
      })
      .returning();

    return NextResponse.json(
      { chat: newChat[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create chat error:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}
