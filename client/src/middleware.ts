import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/api/analyze',
  '/api/user/(.*)',
  '/api/result/(.*)',
  '/analysis(.*)',
  '/history(.*)'
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect API routes và protected pages
  if (isProtectedRoute(req)) {
    auth.protect();
  }
  
  // Redirect authenticated users away from auth pages
  const session = await auth();
  if (session.userId && (req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!.*\\..*|_next).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};