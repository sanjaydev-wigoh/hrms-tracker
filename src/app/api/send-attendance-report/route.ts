import { NextResponse } from 'next/server';
import { sendAttendanceReportToAdmin } from '@/lib/sendAttendanceEmail';

export async function GET() {
  try {
    const result = await sendAttendanceReportToAdmin();
    return NextResponse.json({ message: `✅ Email sent to admin with ${result.count} records.` });
  } catch (error) {
    console.error('❌ Email failed:', error);
    return NextResponse.json({ error: 'Failed to send attendance email' }, { status: 500 });
  }
}
