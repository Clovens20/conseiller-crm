import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — always accessible
  const publicRoutes = [
    '/',
    '/devenir-client',
    '/devenir-representant',
    '/login', // Add login to public routes
  ];

  // Firm pages — always accessible
  if (pathname.startsWith('/f/')) {
    return NextResponse.next();
  }

  // Public routes check
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Admin routes — check auth
  if (pathname.startsWith('/admin')) {
    // Note: In Next.js App Router, it's better to check for a cookie or session token here.
    // For now, we let the client-side AdminLayout/Page handle the redirect if session is missing,
    // as Supabase auth is primarily client-side without a custom server-side session helper yet.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
