
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
// import { isRateLimited } from '../ratelimit/route';

// GET: Return wallet info for logged-in user
export async function GET() {
  const user = await currentUser();
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const wallet = await prisma.userWallet.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json(wallet ?? {});
}

// POST: Claim money from wallet
export async function POST(req: Request) {

  // const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  
  //   if (isRateLimited(ip)) {
  //     return NextResponse.json(
  //       { message: 'Too many requests from this IP. Please try again later.' },
  //       { status: 429 }
  //     );
  //   }
  const user = await currentUser();
  if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { amount } = await req.json();

  const wallet = await prisma.userWallet.findUnique({ where: { userId: user.id } });
  if (!wallet || amount > wallet.remainingBalance) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  const updated = await prisma.userWallet.update({
    where: { userId: user.id },
    data: {
      totalClaimed: { increment: amount },
      remainingBalance: { decrement: amount },
    },
  });

  return NextResponse.json(updated);
}
