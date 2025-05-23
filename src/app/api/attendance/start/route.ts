
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

//   const loginTimeStr = ist.toTimeString().slice(0, 5); // "HH:mm"
//   const loginBonus = ist.getHours() < 20 || (ist.getHours() === 20 && ist.getMinutes() === 0) ? 100 : 0;

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
//       loginTime: loginTimeStr,
//       loginBonus,
//     },
//     create: {
//       username: user.username,
//       date: dateUtc,
//       loginTime: loginTimeStr,
//       loginBonus,
//       logoutTime: '',
//       logoutBonus: 0,
//     },
//   });

//   await prisma.userWallet.upsert({
//     where: { userId: user.id },
//     update: {
//       totalEligible: { increment: loginBonus },
//       remainingBalance: { increment: loginBonus },
//     },
//     create: {
//       userId: user.id,
//       totalEligible: loginBonus,
//       totalClaimed: 0,
//       remainingBalance: loginBonus,
//     },
//   });

//   return NextResponse.json(attendance);
// }

// import { NextResponse } from 'next/server';
// import { currentUser } from '@clerk/nextjs/server';
// import { prisma } from '@/lib/db';
// import { toZonedTime, toDate } from 'date-fns-tz';
// // import '@/lib/init-cron';

// export async function POST() {
//   const user = await currentUser();
//   if (!user?.username || !user.id) return new NextResponse('Unauthorized', { status: 401 });

//   const now = new Date();
//   const ist = toZonedTime(now, 'Asia/Kolkata');

//   const loginTimeStr = ist.toTimeString().slice(0, 5); // "HH:mm"
//   const loginBonus = ist.getHours() < 8 || (ist.getHours() === 8 && ist.getMinutes() === 0) ? 100 : 0;

//   const dateOnly = new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
//   const dateUtc = toDate(dateOnly, { timeZone: 'Asia/Kolkata' });

//   // 🚫 Prevent duplicate START
//   const existing = await prisma.userAttendance.findUnique({
//     where: {
//       username_date: {
//         username: user.username,
//         date: dateUtc,
//       },
//     },
//   });

//   if (existing?.loginTime) {
//     return NextResponse.json({ error: 'Already marked START today' }, { status: 400 });
//   }

//   const attendance = await prisma.userAttendance.upsert({
//     where: {
//       username_date: {
//         username: user.username,
//         date: dateUtc,
//       },
//     },
//     update: {
//       loginTime: loginTimeStr,
//       loginBonus,
//     },
//     create: {
//       username: user.username,
//       date: dateUtc,
//       loginTime: loginTimeStr,
//       loginBonus,
//       logoutTime: '',
//       logoutBonus: 0,
//     },
//   });

//   await prisma.userWallet.upsert({
//     where: { userId: user.id },
//     update: {
//       totalEligible: { increment: loginBonus },
//       remainingBalance: { increment: loginBonus },
//     },
//     create: {
//       userId: user.id,
//       totalEligible: loginBonus,
//       totalClaimed: 0,
//       remainingBalance: loginBonus,
//     },
//   });

//   return NextResponse.json(attendance);
// }

import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { toZonedTime, toDate } from 'date-fns-tz';

// import logger from '../../utils/logger';



export async function POST() {

  // const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  // if (isRateLimited(ip)) {
  //   // logger.error('Rate limit exceeded', { status: 429 });
  //   return NextResponse.json(
  //     { message: 'Too many requests from this IP. Please try again later.' },
  //     { status: 429 }
  //   );
  // }
  
  const user = await currentUser();
  if (!user?.username || !user.id) {
    // logger.error('Unauthorized', { status: 401 });
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const now = new Date();
  const ist = toZonedTime(now, 'Asia/Kolkata');
  const loginTimeStr = ist.toTimeString().slice(0, 5);
  const loginBonus = ist.getHours() < 8 || (ist.getHours() === 8 && ist.getMinutes() === 0) ? 100 : 0;
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

  if (existing?.loginTime) {
    // logger.error(JSON.stringify({ error: 'Already marked START today' }), { status: 400 });
    return NextResponse.json({ error: 'Already marked START today' }, { status: 400 });
  }

  const attendance = await prisma.userAttendance.upsert({
    where: {
      username_date: {
        username: user.username,
        date: dateUtc,
      },
    },
    update: { loginTime: loginTimeStr, loginBonus },
    create: {
      username: user.username,
      date: dateUtc,
      loginTime: loginTimeStr,
      loginBonus,
      logoutTime: '',
      logoutBonus: 0,
    },
  });

  await prisma.userWallet.upsert({
    where: { userId: user.id },
    update: {
      totalEligible: { increment: loginBonus },
      remainingBalance: { increment: loginBonus },
    },
    create: {
      userId: user.id,
      totalEligible: loginBonus,
      totalClaimed: 0,
      remainingBalance: loginBonus,
    },
  });


  await fetch('http://localhost:3001/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(attendance),
  });
  
  return NextResponse.json(attendance);
}


