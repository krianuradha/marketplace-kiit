import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { db, users } from '@/lib/db';
import { loginSchema } from '@/lib/validators';
import { signToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (!user[0]) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Google OAuth users have no password
    if (!user[0].passwordHash) {
      return NextResponse.json(
        { error: 'This account uses Google sign-in. Please use the Google button.' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(
      validatedData.password,
      user[0].passwordHash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await signToken({
      userId: user[0].id,
      email: user[0].email,
      name: user[0].name,
      gender: user[0].gender,
    });

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          gender: user[0].gender,
        },
      },
      { status: 200 }
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
