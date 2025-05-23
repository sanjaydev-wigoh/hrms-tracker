// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';
// import {  endOfMonth } from 'date-fns';

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const username = searchParams.get('username');
//   const month = searchParams.get('month');

//   if (!username || !month) {
//     return NextResponse.json({ error: 'Missing username or month' }, { status: 400 });
//   }

//   const start = new Date(`${month}-01T00:00:00Z`);
//   const end = endOfMonth(start);

//   const attendance = await prisma.userAttendance.findMany({
//     where: {
//       username,
//       date: {
//         gte: start,
//         lte: end,
//       },
//     },
//   });

//   const eligibleDays = attendance.filter((a) => (a.loginBonus || 0) + (a.logoutBonus || 0) > 0);
//   const total = eligibleDays.reduce(
//     (sum, a) => sum + (a.loginBonus || 0) + (a.logoutBonus || 0),
//     0
//   );

//   return NextResponse.json({ eligibleDays, total });
// }
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { endOfMonth } from 'date-fns';
import { UserAttendance } from '@prisma/client'; // Import type from Prisma

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const month = searchParams.get('month');

  if (!username || !month) {
    return NextResponse.json({ error: 'Missing username or month' }, { status: 400 });
  }

  const start = new Date(`${month}-01T00:00:00Z`);
  const end = endOfMonth(start);

  const attendance = await prisma.userAttendance.findMany({
    where: {
      username,
      date: {
        gte: start,
        lte: end,
      },
    },
  });

  // 👇 Type `a` as UserAttendance
  const eligibleDays = attendance.filter((a: UserAttendance) =>
    (a.loginBonus ?? 0) + (a.logoutBonus ?? 0) > 0
  );

  // 👇 Type both `sum` and `a`
  const total = eligibleDays.reduce(
    (sum: number, a: UserAttendance) => sum + (a.loginBonus ?? 0) + (a.logoutBonus ?? 0),
    0
  );

  return NextResponse.json({ eligibleDays, total });
}
