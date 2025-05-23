
// final

// import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
// import { prisma } from '@/lib/db';
// import { toZonedTime, toDate } from 'date-fns-tz';

// export async function POST() {
//   const user = await currentUser();
//   if (!user?.username || !user.id) return new NextResponse('Unauthorized', { status: 401 });

//   const now = new Date();
//   const ist = toZonedTime(now, 'Asia/Kolkata');

//   const logoutTimeStr = ist.toTimeString().slice(0, 5); // "HH:mm"
//   const logoutBonus = ist.getHours() > 19 || (ist.getHours() === 19 && ist.getMinutes() === 0) ? 100 : 0;

//   const dateOnly = new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
//   const dateUtc = toDate(dateOnly, { timeZone: 'Asia/Kolkata' });

//   const attendance = await prisma.userAttendance.upsert({
//     where: {
//       username_date: {
//         username: user.username,
//         date: dateUtc,
//       },
//     },
//     update: {
//       logoutTime: logoutTimeStr,
//       logoutBonus,
//     },
//     create: {
//       username: user.username,
//       date: dateUtc,
//       loginTime: '',
//       loginBonus: 0,
//       logoutTime: logoutTimeStr,
//       logoutBonus,
//     },
//   });

//   await prisma.userWallet.upsert({
//     where: { userId: user.id },
//     update: {
//       totalEligible: { increment: logoutBonus },
//       remainingBalance: { increment: logoutBonus },
//     },
//     create: {
//       userId: user.id,
//       totalEligible: logoutBonus,
//       totalClaimed: 0,
//       remainingBalance: logoutBonus,
//     },
//   });

//   return NextResponse.json(attendance);
// }

// import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
// import { prisma } from '@/lib/db';
// import { toZonedTime, toDate } from 'date-fns-tz';

// export async function POST() {
//   const user = await currentUser();
//   if (!user?.username || !user.id) return new NextResponse('Unauthorized', { status: 401 });

//   const now = new Date();
//   const ist = toZonedTime(now, 'Asia/Kolkata');

//   const logoutTimeStr = ist.toTimeString().slice(0, 5); // "HH:mm"
//   const logoutBonus = ist.getHours() > 19 || (ist.getHours() === 19 && ist.getMinutes() === 0) ? 100 : 0;

//   const dateOnly = new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
//   const dateUtc = toDate(dateOnly, { timeZone: 'Asia/Kolkata' });

//   // 🚫 Prevent duplicate END
//   const existing = await prisma.userAttendance.findUnique({
//     where: {
//       username_date: {
//         username: user.username,
//         date: dateUtc,
//       },
//     },
//   });

//   if (existing?.logoutTime) {
//     return NextResponse.json({ error: 'Already marked END today' }, { status: 400 });
//   }

//   const attendance = await prisma.userAttendance.upsert({
//     where: {
//       username_date: {
//         username: user.username,
//         date: dateUtc,
//       },
//     },
//     update: {
//       logoutTime: logoutTimeStr,
//       logoutBonus,
//     },
//     create: {
//       username: user.username,
//       date: dateUtc,
//       loginTime: '',
//       loginBonus: 0,
//       logoutTime: logoutTimeStr,
//       logoutBonus,
//     },
//   });

//   await prisma.userWallet.upsert({
//     where: { userId: user.id },
//     update: {
//       totalEligible: { increment: logoutBonus },
//       remainingBalance: { increment: logoutBonus },
//     },
//     create: {
//       userId: user.id,
//       totalEligible: logoutBonus,
//       totalClaimed: 0,
//       remainingBalance: logoutBonus,
//     },
//   });

//   return NextResponse.json(attendance);
// }

import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { toZonedTime, toDate } from 'date-fns-tz';
import logger from '../../utils/logger';

export async function POST() {
  const user = await currentUser();
  if (!user?.username || !user.id) {
    logger.error('Unauthorized', { status: 401 });
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const now = new Date();
  const ist = toZonedTime(now, 'Asia/Kolkata');
  const logoutTimeStr = ist.toTimeString().slice(0, 5);
  const logoutBonus = ist.getHours() > 19 || (ist.getHours() === 19 && ist.getMinutes() === 0) ? 100 : 0;
  const dateOnly = new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
  const dateUtc = toDate(dateOnly, { timeZone: 'Asia/Kolkata' });

  const existing = await prisma.userAttendance.findUnique({
    where: {
      username_date: {
        username: user.username,
        date: dateUtc,
      },
    },
  });

  if (!existing?.loginTime) {
    logger.error(JSON.stringify({ error: 'START attendance not marked yet' }), { status: 400 });
    return NextResponse.json({ error: 'START attendance not marked yet' }, { status: 400 });
  }

  if (existing.logoutTime) {
    logger.error(JSON.stringify({ error: 'Already marked END today' }), { status: 400 });
    return NextResponse.json({ error: 'Already marked END today' }, { status: 400 });
  }

  const updated = await prisma.userAttendance.update({
    where: {
      username_date: {
        username: user.username,
        date: dateUtc,
      },
    },
    data: {
      logoutTime: logoutTimeStr,
      logoutBonus,
    },
  });

  await prisma.userWallet.upsert({
    where: { userId: user.id },
    update: {
      totalEligible: { increment: logoutBonus },
      remainingBalance: { increment: logoutBonus },
    },
    create: {
      userId: user.id,
      totalEligible: logoutBonus,
      totalClaimed: 0,
      remainingBalance: logoutBonus,
    },
  });

  // ✅ Notify socket server
  await fetch('http://localhost:3001/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  });

  return NextResponse.json(updated);
}
