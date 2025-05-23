import { NextResponse } from 'next/server';
import { sendWeeklyReportToAdmin } from '@/lib/sendWeeklyReport';

export async function GET() {
  try {
    await sendWeeklyReportToAdmin();
    return NextResponse.json({ message: 'Weekly report sent successfully.' });
  } catch (error) {
    console.error('Error sending weekly report:', error);
    return NextResponse.json({ error: 'Failed to send weekly report' }, { status: 500 });
  }
}
