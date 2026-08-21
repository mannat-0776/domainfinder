import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// ─── Rate Limiting Middleware ───────────────────────────────────────────────────────────────
// In-memory rate limiter for the Edge runtime.
// Phase 7: replace with Redis-backed sliding window when REDIS_URL is set.
//
// Limits:
//   /api/v1/names/generate  → 10 req / 60s per IP
//   /api/v1/domains/check   → 30 req / 60s per IP
//   All other API routes    → 60 req / 60s per IP

const WINDOW_MS = 60_000;

const LIMITS: Array<{ pattern: RegExp; max: number }> = [
  { pattern: /^\/api\/v1\/names\/generate/, max: 10 },
  { pattern: /^\/api\/v1\/domains\/check/,  max: 30 },
  { pattern: /^\/api\//,                    max: 60 },
];

// Simple in-memory store: ip:route -> { count, resetAt }
// Note: this resets on cold start. Acceptable for Edge; use Redis for precision.
const store = new Map<string, { count: number; resetAt: number }>();

function getLimit(pathname: string): number {
  for (const { pattern, max } of LIMITS) {
    if (pattern.test(pathname)) return max;
  }
  return Infinity;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let response = NextResponse.next({ request: { headers: req.headers } });

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );
    await supabase.auth.getUser();
  }

  // Only rate-limit API routes
  if (!pathname.startsWith('/api/')) return response;

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const key = `${ip}:${pathname.split('/').slice(0, 4).join('/')}`;
  const limit = getLimit(pathname);
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return response;
  }

  entry.count++;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return new NextResponse(
      JSON.stringify({ code: 'RATE_LIMIT', message: 'Too many requests. Please slow down.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After':  String(retryAfter),
          'X-RateLimit-Limit':     String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset':     String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    );
  }

  const remaining = limit - entry.count;
  const res = response;
  res.headers.set('X-RateLimit-Limit',     String(limit));
  res.headers.set('X-RateLimit-Remaining', String(remaining));
  res.headers.set('X-RateLimit-Reset',     String(Math.ceil(entry.resetAt / 1000)));
  return res;
}

export const config = {
  matcher: ['/api/:path*'],
};
