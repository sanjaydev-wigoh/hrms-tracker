import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dotenv.config();
dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendWeeklyReportToAdmin() {
  const now = dayjs().tz('Asia/Kolkata');
  const startOfWeek = now.startOf('week').add(1, 'day'); // Monday IST
  const endOfWeek = now.endOf('week').subtract(1, 'day'); // Friday IST

  const report = await prisma.userAttendance.groupBy({
    by: ['username'],
    where: {
      date: {
        gte: startOfWeek.toDate(),
        lte: endOfWeek.toDate(),
      },
    },
    _sum: {
      loginBonus: true,
      logoutBonus: true,
    },
  });

  const rows = report.map((user) => {
    const total = (user._sum.loginBonus || 0) + (user._sum.logoutBonus || 0);
    return `
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">${user.username}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">₹${total}</td>
      </tr>
    `;
  }).join('');

  const emailHTML = `
    <h2>📊 Weekly Incentive Report (${startOfWeek.format('DD MMM')} - ${endOfWeek.format('DD MMM')})</h2>
    <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; border: 1px solid #ccc;">Username</th>
          <th style="padding: 8px; border: 1px solid #ccc;">Total ₹ Incentive</th>
        </tr>
      </thead>
      <tbody>
        ${rows || '<tr><td colspan="2">No data available</td></tr>'}
      </tbody>
    </table>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: 'sanjay@wigoh.ai',
    subject: '📅 Weekly Attendance Incentive Summary',
    html: emailHTML,
  });

  console.log(`✅ Sent weekly report for ${report.length} users`);
}
