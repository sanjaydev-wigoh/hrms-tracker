
// src/app/api/claims/route.ts

import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user?.id || !user.username) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month'); // Format: "2025-05"

  if (!month) {
    return new NextResponse('Missing month parameter', { status: 400 });
  }

  const attendance = await prisma.userAttendance.findMany({
    where: {
      username: user.username,
      date: {
        gte: new Date(`${month}-01`),
        lt: new Date(`${month}-31`),
      },
    },
    select: {
      date: true,
      loginBonus: true,
      logoutBonus: true,
    },
  });

  const claimed = await prisma.claimMonth.findUnique({
    where: {
      userId_month: {
        userId: user.id,
        month,
      },
    },
  });

  return NextResponse.json({
    attendance,
    claimed: !!claimed,
    amount: claimed?.amount || 0,
  });
}
