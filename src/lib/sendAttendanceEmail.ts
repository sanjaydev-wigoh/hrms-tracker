
// import { PrismaClient } from '@prisma/client';
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();
// const prisma = new PrismaClient();

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });

// export async function sendAttendanceReportToAdmin() {
//   const attendanceRecords = await prisma.userAttendance.findMany({
//     where: {
//       logoutTime: { not: null },
//     },
//   });


//   const htmlContent = `
//       <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 24px; background-color: #f9f9f9; color: #333;">
//     <h2 style="text-align: center; color: #4CAF50;">🗓️ Daily Attendance Report</h2>
//     <table style="width: 100%; border-collapse: collapse; background-color: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
//       <thead>
//         <tr style="background-color: #4CAF50; color: white;">
//           <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Username</th>
//           <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Date</th>
//           <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Login Time</th>
//           <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Logout Time</th>
//           <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Incentive</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${attendanceRecords.map(record => `
//           <tr style="border-bottom: 1px solid #ddd;">
//             <td style="padding: 10px; border: 1px solid #eee;">${record.username}</td>
//             <td style="padding: 10px; border: 1px solid #eee;">${record.date}</td>
//             <td style="padding: 10px; border: 1px solid #eee;">${record.loginTime}</td>
//             <td style="padding: 10px; border: 1px solid #eee;">${record.logoutTime}</td>
//             <td style="padding: 10px; border: 1px solid #eee;">₹${record.loginBonus + record.logoutBonus}</td>
//           </tr>
//         `).join('')}
//       </tbody>
//     </table>
//     <p style="text-align: center; margin-top: 24px; font-size: 14px;">Total Records: <strong>${attendanceRecords.length}</strong></p>
//   </div>
//   `;

//   await transporter.sendMail({
//     from: process.env.MAIL_USER,
//     to: 'sanjay@wigoh.ai',
//     subject: '🗓️ Daily Attendance Report',
//     html: htmlContent,
//   });

//   console.log(`✅ Sent attendance report with ${attendanceRecords.length} records.`);
//   return { count: attendanceRecords.length };
// }
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendAttendanceReportToAdmin() {
  const now = new Date();
  const nowIST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

  const yyyy = nowIST.getFullYear();
  const mm = String(nowIST.getMonth() + 1).padStart(2, '0');
  const dd = String(nowIST.getDate()).padStart(2, '0');

  const startOfDayIST = new Date(`${yyyy}-${mm}-${dd}T00:00:00+05:30`);
  const endOfDayIST = new Date(`${yyyy}-${mm}-${dd}T23:59:59+05:30`);

  const attendanceRecords = await prisma.userAttendance.findMany({
    where: {
      date: {
        gte: startOfDayIST,
        lte: endOfDayIST,
      },
      logoutTime: { not: null },
    },
  });

  if (attendanceRecords.length === 0) {
    console.log('No records to send today.');
    return { count: 0 };
  }

  // CSV data generation
  const csvFields = ['Username', 'Date', 'Login Time', 'Logout Time', 'Incentive'];
  const csvData = attendanceRecords.map((r) => ({
    'Username': r.username.padEnd(20),
    'Date': r.date.toISOString().split('T')[0],
    'Login Time': r.loginTime,
    'Logout Time': r.logoutTime,
    'Incentive': `₹${r.loginBonus + r.logoutBonus}`,
  }));

  const json2csvParser = new Parser({ fields: csvFields });
  const csv = json2csvParser.parse(csvData);

  const filePath = path.join('/tmp', `attendance-${yyyy}-${mm}-${dd}.csv`);
  fs.writeFileSync(filePath, csv);

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: 'sanjay@wigoh.ai',
    subject: `🗓️ Attendance Report - ${yyyy}-${mm}-${dd}`,
    html: `<p>Please find attached today's attendance report.</p>`,
    attachments: [
      {
        filename: `attendance-${yyyy}-${mm}-${dd}.csv`,
        path: filePath,
      },
    ],
  });

  console.log(`✅ Sent attendance report with ${attendanceRecords.length} records.`);
  return { count: attendanceRecords.length };
}
