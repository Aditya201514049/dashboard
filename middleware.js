import { NextResponse } from 'next/server';

// Define public paths that don't require authentication
const publicPaths = [
  '/signin',
  '/signup',
  // Add other public paths as needed
];

export function middleware(request) {
  // Check if the path is a public path
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Get the Firebase auth token from the cookie if it exists
  const authCookie = request.cookies.get('__session')?.value;

  // If path requires authentication and no auth cookie exists, redirect to signin
  if (!isPublicPath && !authCookie) {
    // Return to signin with a redirect back to the original URL after successful login
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If the user is authenticated and trying to access an auth page, redirect to dashboard
  if (isPublicPath && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure the middleware to run only on these paths
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}; 