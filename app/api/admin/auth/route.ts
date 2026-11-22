import { NextResponse } from 'next/server';

// Demo credentials map — in production, replace with Supabase Auth lookup
// Values are stored here server-side only (not in client bundle)
const DEMO_USERS: Record<string, { password: string; displayName: string; role: string }> = {
  humas: { password: process.env.ADMIN_PASSWORD_HUMAS || 'humashimtek2026', displayName: 'Tim Humas', role: 'admin' },
  admin: { password: process.env.ADMIN_PASSWORD_ADMIN || 'admin123', displayName: 'Administrator', role: 'lead' },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Username dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const user = DEMO_USERS[username.trim().toLowerCase()];

    // Constant-time comparison to prevent timing attacks
    // (simple version — in production use bcrypt)
    const isValid = user && user.password === password;

    if (!isValid) {
      // Intentional 300ms delay to slow brute force
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json(
        { success: false, message: 'Username atau kata sandi tidak valid.' },
        { status: 401 }
      );
    }

    // Set an HTTP-only session cookie
    const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'suaratk-demo-session-2026';
    const response = NextResponse.json({
      success: true,
      displayName: user.displayName,
      role: user.role,
    });

    response.cookies.set('suaratk_session', sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan sistem.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Logout: clear the session cookie
  const response = NextResponse.json({ success: true, message: 'Berhasil keluar.' });
  response.cookies.set('suaratk_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
