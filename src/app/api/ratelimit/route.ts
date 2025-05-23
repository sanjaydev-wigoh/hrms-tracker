// const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

// const RATE_LIMIT_WINDOW_MS = 60 * 1000; 
// const MAX_REQUESTS = 4;

// export function isRateLimited(ip: string): boolean {
//   const currentTime = Date.now();
//   const entry = ipRequestCounts.get(ip);

//   if (!entry || currentTime - entry.timestamp > RATE_LIMIT_WINDOW_MS) {
//     ipRequestCounts.set(ip, { count: 1, timestamp: currentTime });
//     return false;
//   }

//   if (entry.count >= MAX_REQUESTS) {
//     return true;
//   }

//   entry.count += 1;
//   ipRequestCounts.set(ip, entry);
//   return false;
// }

import { NextResponse } from 'next/server';
import { isRateLimited } from '@/lib/ratelimit'; // Adjust the import path as needed

export async function GET(req: Request) {
  // Example: get client IP (if behind proxy, you might get it differently)
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  return NextResponse.json({ message: 'Request allowed' });
}