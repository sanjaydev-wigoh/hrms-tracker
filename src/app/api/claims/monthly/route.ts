

// // app/api/claims/monthly/route.ts
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const username = searchParams.get('username');
//   const month = searchParams.get('month'); // e.g., "2025-05"

//   if (!username || !month) {
//     return NextResponse.json({ error: 'Missing username or month' }, { status: 400 });
//   }

//   try {
//     const startDate = new Date(`${month}-01T00:00:00.000Z`);
//     const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

//     const records = await prisma.userAttendance.findMany({
//       where: {
//         username,
//         date: {
//           gte: startDate,
//           lt: endDate,
//         },
//         claimed: false, // only show incentives that haven't been claimed
//       },
//       select: {
//         loginBonus: true,
//         logoutBonus: true,
//       },
//     });

//     const totalAmount = records.reduce((sum, r) => sum + r.loginBonus + r.logoutBonus, 0);

//     return NextResponse.json({
//       totalAmount,
//       eligibleDays: records.length,
//     });
//   } catch (error) {
//     console.error('Error fetching monthly incentive:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const month = searchParams.get('month'); // format: "2025-05"

  if (!username || !month) {
    return NextResponse.json({ error: 'Missing username or month' }, { status: 400 });
  }

  try {
    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

    // All records for the month
    const allRecords = await prisma.userAttendance.findMany({
      where: {
        username,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        loginBonus: true,
        logoutBonus: true,
        claimed: true,
      },
    });

    const totalAmount = allRecords.reduce(
      (sum, r) => sum + r.loginBonus + r.logoutBonus,
      0
    );

    const unclaimedAmount = allRecords
      .filter((r) => !r.claimed)
      .reduce((sum, r) => sum + r.loginBonus + r.logoutBonus, 0);

    const eligibleDays = allRecords.filter(r => (r.loginBonus || 0) + (r.logoutBonus || 0) > 0).length;

    return NextResponse.json({
      totalAmount,
      unclaimedAmount,
      eligibleDays,
    });
  } catch (error) {
    console.error('Error fetching monthly incentive:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
