import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting: in-memory store (per process, resets on cold start)
// For production, use Redis/Upstash. This guards dev & demo environments.
const rateMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_SUBMIT_PER_WINDOW = 5;         // max 5 submissions per IP per minute

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_SUBMIT_PER_WINDOW - 1 };
  }

  if (entry.count >= MAX_SUBMIT_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_SUBMIT_PER_WINDOW - entry.count };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Rate limit: POST /api/aspirations (submit) ---
  if (pathname === '/api/aspirations' && request.method === 'POST') {
    const ip = getClientIP(request);
    const { allowed, remaining } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Terlalu banyak permintaan. Mohon tunggu beberapa saat sebelum mengirim aspirasi kembali.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': String(MAX_SUBMIT_PER_WINDOW),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(MAX_SUBMIT_PER_WINDOW));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    return response;
  }

  // --- Admin route protection ---
  // Guard /admin/dashboard and /api/admin/* from unauthenticated access.
  // Note: /api/admin/auth is public so admins can log in and out.
  if (
    pathname.startsWith('/admin/dashboard') ||
    (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth'))
  ) {
    const sessionToken = request.cookies.get('suaratk_session')?.value;
    const expectedSecret = process.env.ADMIN_SESSION_SECRET || 'suaratk-demo-session-2026';

    if (!sessionToken || sessionToken !== expectedSecret) {
      // For page routes → redirect to login
      if (!pathname.startsWith('/api/')) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      // For API routes → 401
      return NextResponse.json(
        { success: false, message: 'Akses tidak diizinkan. Silakan login sebagai admin.' },
        { status: 401 }
      );
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  return response;
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/api/admin/:path*',
    '/api/aspirations',
  ],
};
