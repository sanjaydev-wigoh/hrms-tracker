

// // /api/claims/submit/route.ts
// import { NextResponse } from 'next/server';
// import {prisma} from '@/lib/db'; // adjust path if needed

// export async function POST(req: Request) {
//   try {
//     const { username, month } = await req.json();

//     if (!username || !month) {
//       return NextResponse.json({ error: 'Username and month are required.' }, { status: 400 });
//     }

//     const startDate = new Date(`${month}-01`);
//     const endDate = new Date(startDate);
//     endDate.setMonth(endDate.getMonth() + 1);

//     // Fetch unclaimed eligible days
//     const attendance = await prisma.userAttendance.findMany({
//       where: {
//         username,
//         date: {
//           gte: startDate,
//           lt: endDate,
//         },
//         claimed: false,
//       },
//     });

//     const eligibleDays = attendance.filter(
//       (entry: { loginBonus: any; logoutBonus: any; }) => (entry.loginBonus || 0) + (entry.logoutBonus || 0) > 0
//     );

//     if (eligibleDays.length === 0) {
//       return NextResponse.json(
//         { error: "You don't have any claimable money or you've already claimed." },
//         { status: 400 }
//       );
//     }

//     // Calculate total claim
//     const total = eligibleDays.reduce(
//       (sum: any, entry: { loginBonus: any; logoutBonus: any; }) => sum + (entry.loginBonus || 0) + (entry.logoutBonus || 0),
//       0
//     );

//     // Mark them as claimed
//     await prisma.$transaction([
//       ...eligibleDays.map((entry: { id: any; }) =>
//         prisma.userAttendance.update({
//           where: { id: entry.id },
//           data: { claimed: true },
//         })
//       ),
//       prisma.claim.create({
//         data: {
//           username,
//           month,
//           total,
//           date: new Date(), // Add the current date or a specific date
//           morning: 0, // Provide a default or calculated value
//           evening: 0, // Provide a default or calculated value
//         },
//       }),
//     ]);

//     return NextResponse.json({ message: 'Claim successful', data: { total } });
//   } catch (error) {
//     console.error('Submit claim error:', error);
//     return NextResponse.json({ error: 'Server error while submitting claim.' }, { status: 500 });
//   }
// }
// /api/claims/submit/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // adjust import path as needed

// Define a typed interface matching your Prisma userAttendance model (adjust fields if needed)
interface UserAttendance {
  id: string; // Updated to match the actual type
  username: string;
  date: Date;
  loginBonus?: number | null;
  logoutBonus?: number | null;
  claimed: boolean;
}

export async function POST(req: Request) {
  try {
    // Explicitly type the parsed JSON input
    const { username, month }: { username: string; month: string } = await req.json();

    if (!username || !month) {
      return NextResponse.json({ error: 'Username and month are required.' }, { status: 400 });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Fetch unclaimed eligible attendance records for the user in the month
    const attendance: UserAttendance[] = await prisma.userAttendance.findMany({
      where: {
        username,
        date: {
          gte: startDate,
          lt: endDate,
        },
        claimed: false,
      },
    });

    // Filter only records where loginBonus + logoutBonus > 0
    const eligibleDays = attendance.filter(
      (entry) => (entry.loginBonus ?? 0) + (entry.logoutBonus ?? 0) > 0
    );

    if (eligibleDays.length === 0) {
      return NextResponse.json(
        { error: "You don't have any claimable money or you've already claimed." },
        { status: 400 }
      );
    }

    // Calculate total incentive sum
    const total = eligibleDays.reduce(
      (sum, entry) => sum + (entry.loginBonus ?? 0) + (entry.logoutBonus ?? 0),
      0
    );

    // Mark all eligible attendance entries as claimed and create a claim record in a transaction
    await prisma.$transaction([
      ...eligibleDays.map((entry) =>
        prisma.userAttendance.update({
          where: { id: entry.id },
          data: { claimed: true },
        })
      ),
      prisma.claim.create({
        data: {
          username,
          month,
          total,
          date: new Date(),
          morning: 0, // Adjust as per your business logic
          evening: 0, // Adjust as per your business logic
        },
      }),
    ]);

    return NextResponse.json({ message: 'Claim successful', data: { total } });
  } catch (error) {
    console.error('Submit claim error:', error);
    return NextResponse.json({ error: 'Server error while submitting claim.' }, { status: 500 });
  }
}
