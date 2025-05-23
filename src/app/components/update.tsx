


'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
});

interface AttendanceRecord {
  id: string;
  username: string;
  date: string;
  loginTime?: string;
  logoutTime?: string;
  loginBonus: number;
  logoutBonus: number;
}

export default function AttendanceRealtime() {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/')
      .then((res) => res.json())
      .then(setAttendanceList);
  }, []);

  useEffect(() => {
    socket.on('attendance-update', (updated: AttendanceRecord) => {
      setAttendanceList((prev) => {
        const index = prev.findIndex((a) => a.id === updated.id);
        if (index !== -1) {
          const copy = [...prev];
          copy[index] = updated;
          return copy;
        } else {
          return [...prev, updated];
        }
      });
    });

    socket.on('attendance-delete', ({ id }: { id: string }) => {
      setAttendanceList((prev) => prev.filter((a) => a.id !== id));
    });

    return () => {
      socket.off('attendance-update');
      socket.off('attendance-delete');
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-extrabold mb-6 text-gray-800">📡 Live Attendance Updates</h1>

    {attendanceList.length === 0 ? (
      <p className="text-center text-gray-500">No attendance records found.</p>
    ) : (
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-indigo-600">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Login Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Logout Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Bonus (₹)
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {attendanceList.map((att) => (
            <tr key={att.id} className="hover:bg-indigo-50 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {att.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(att.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {att.loginTime ?? 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {att.logoutTime ?? 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-700">
                ₹{att.loginBonus + att.logoutBonus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  );
}
