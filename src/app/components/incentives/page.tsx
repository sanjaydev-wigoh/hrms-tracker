
'use client';
import { useEffect, useState } from 'react';

interface AttendanceData {
  username: string;
  loginTime: string | null;
  logoutTime: string | null;
  loginBonus: number;
  logoutBonus: number;
}
import WigohLoader from '../wigohLoader';
// import HamburgerMenu from '../HamburgerMenu';

export default function DailyIncentiveSummary() {
  // const [attendance, setAttendance] = useState<any>(null);
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);

  useEffect(() => {
    async function fetchAttendance() {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (data.error) {
        setAttendance(null);
      } else {
        setAttendance(data);
      }
    }

    fetchAttendance();
  }, []);

  if (!attendance)
    return (
      
      <WigohLoader />
    );

  return (
 <>
 {/* <HamburgerMenu/> */}
<div className="min-h-screen bg-gradient-to-br from-white via-[#f97316] to-[#9333ea] p-6 flex items-center justify-center">
  <div className="max-w-2xl w-full bg-white border-2 border-[#9333ea] rounded-2xl shadow-2xl p-8 space-y-6">
    <h1 className="text-3xl font-extrabold text-center text-[#f97316] mb-4 tracking-tight">
      💸 Daily Incentive Summary
    </h1>

    {attendance ? (
      <>
        <div className="text-base sm:text-lg text-gray-800">
          <span className="font-semibold text-[#f97316]">👤 User:</span>{' '}
          <span className="text-[#9333ea] font-medium">{attendance.username}</span>
        </div>

        <div className="text-gray-800">
          <span className="font-semibold text-[#f97316]">🕒 Login Time:</span>{' '}
          {attendance.loginTime || '—'}
        </div>

        <div className="text-gray-800">
          <span className="font-semibold text-[#f97316]">🏁 Logout Time:</span>{' '}
          {attendance.logoutTime || '—'}
        </div>

        <div className="text-gray-800">
          <span className="font-semibold text-[#f97316]">🌅 Morning Incentive:</span>{' '}
          ₹<span className="font-semibold">{attendance.loginBonus}</span>
        </div>

        <div className="text-gray-800">
          <span className="font-semibold text-[#9333ea]">🌇 Evening Incentive:</span>{' '}
          ₹<span className="font-semibold">{attendance.logoutBonus}</span>
        </div>

        <div className="pt-4 border-t border-dashed border-[#9333ea]">
          <p className="text-xl text-center font-bold text-[#f97316]">
            💰 Total Incentive: ₹{attendance.loginBonus + attendance.logoutBonus}
          </p>
        </div>
      </>
    ) : (
      <p className="text-center text-gray-600 text-lg italic">
        No attendance data available for today.
      </p>
    )}
  </div>
</div>
</>

  );
}
