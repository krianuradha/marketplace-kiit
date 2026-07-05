import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { db, users } from '@/lib/db';
import { signupSchema } from '@/lib/validators';
import { setAuthCookie, signToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = signupSchema.parse(body);

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(validatedData.password, 10);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        gender: validatedData.gender,
      })
      .returning();

    if (!newUser[0]) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create JWT token
    const token = await signToken({
      userId: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
      gender: newUser[0].gender,
    });

    // Set auth cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: newUser[0].id,
          name: newUser[0].name,
          email: newUser[0].email,
          gender: newUser[0].gender,
        },
      },
      { status: 201 }
    );

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
