import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Protect everything except static files and _next
    '/api/(.*)',              // Protect all API routes
  ],
};
