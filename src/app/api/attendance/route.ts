
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

// GET: Return today's attendance info for logged-in user
export async function GET() {
  const user = await currentUser();
  if (!user?.username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch today's attendance based on username
  const attendance = await prisma.userAttendance.findFirst({
    where: {
      username: user.username, // Use username to fetch attendance
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's date, starting at midnight
        lte: new Date(new Date().setHours(23, 59, 59, 999)), // Today's date, ending at 11:59:59 PM
      },
    },
  });

  // If attendance exists, return it
  if (!attendance) {
    return NextResponse.json({ message: 'No attendance record found for today' }, { status: 404 });
  }

  // Return the attendance data (login/logout times and bonuses)
  return NextResponse.json(attendance);
}
