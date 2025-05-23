// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';
// import { parseISO, startOfMonth, endOfMonth } from 'date-fns';

// export async function GET(req: NextRequest) {
//   const month = req.nextUrl.searchParams.get('month'); // e.g. "2025-05"
//   if (!month) return new NextResponse('Month is required', { status: 400 });

//   const start = parseISO(`${month}-01`);
//   const end = endOfMonth(start);

//   try {
//     const records = await prisma.userAttendance.findMany({
//       where: {
//         date: {
//           gte: start,
//           lte: end,
//         },
//       },
//       orderBy: {
//         date: 'asc',
//       },
//     });

//     // Format output for admin table
//     const formatted = records.map((rec) => ({
//       username: rec.username,
//       date: rec.date.toISOString().split('T')[0],
//       loginTime: rec.loginTime || '—',
//       logoutTime: rec.logoutTime || '—',
//       morningBonus: rec.loginBonus || 0,
//       eveningBonus: rec.logoutBonus || 0,
//       total: (rec.loginBonus || 0) + (rec.logoutBonus || 0),
//     }));

//     return NextResponse.json({ data: formatted });
//   } catch (error) {
//     console.error('Admin attendance fetch failed:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/attendance?username=misham&month=2025-07
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const month = searchParams.get('month'); // YYYY-MM format

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  if (!month) {
    return NextResponse.json({ error: 'Month is required (YYYY-MM)' }, { status: 400 });
  }

  try {
    // Parse month into start and end dates
    const [year, monthPart] = month.split('-');
    const startDate = new Date(`${year}-${monthPart}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // First day of next month

    const attendance = await prisma.userAttendance.findMany({
      where: {
        username,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

