
// 'use client';
// import { useEffect, useState } from 'react';

// export default function AdminAttendancePage() {
//   const [data, setData] = useState<any[]>([]);
//   const [month, setMonth] = useState(() => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
//   });
//   const [loading, setLoading] = useState(false);
//   const [username, setUsername] = useState<string>('');
//   const [onlyEligible, setOnlyEligible] = useState(false);
//   const [filteredData, setFilteredData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/admin/attendance?month=${month}`);
//         if (!res.ok) throw new Error('Failed to fetch');
//         const json = await res.json();
//         setData(json.data || []);
//         setFilteredData(json.data || []);
//       } catch (err) {
//         console.error(err);
//         setData([]);
//         setFilteredData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAttendance();
//   }, [month]);

//   useEffect(() => {
//     let filtered = data;

//     if (username) {
//       filtered = filtered.filter((entry: any) =>
//         entry.username.toLowerCase().includes(username.toLowerCase())
//       );
//     }

//     if (onlyEligible) {
//       filtered = filtered.filter(
//         (entry: any) => (entry.morningBonus || 0) + (entry.eveningBonus || 0) >= 100
//       );
//     }

//     setFilteredData(filtered);
//   }, [username, onlyEligible, data]);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">📊 Admin Attendance Dashboard</h1>

//       <div className="mb-4 flex flex-col sm:flex-row justify-center gap-4 items-center">
//         <input
//           type="month"
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           className="border border-gray-300 rounded p-2"
//         />
//         <input
//           type="text"
//           placeholder="Enter username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="border border-gray-300 rounded p-2"
//         />
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={onlyEligible}
//             onChange={(e) => setOnlyEligible(e.target.checked)}
//           />
//           Show Eligible Days (₹100+)
//         </label>
//       </div>

//       {loading ? (
//         <p className="text-center">Loading attendance data...</p>
//       ) : filteredData.length === 0 ? (
//         <p className="text-center text-red-600">No records found for {month}</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 text-sm text-left">
//             <thead className="bg-gray-100 text-gray-800">
//               <tr>
//                 <th className="p-2 border">Username</th>
//                 <th className="p-2 border">Date</th>
//                 <th className="p-2 border">Login Time</th>
//                 <th className="p-2 border">Logout Time</th>
//                 <th className="p-2 border">Morning Bonus</th>
//                 <th className="p-2 border">Evening Bonus</th>
//                 <th className="p-2 border font-bold">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((entry, i) => (
//                 <tr key={i} className="border-t">
//                   <td className="p-2 border">{entry.username}</td>
//                   <td className="p-2 border">{entry.date}</td>
//                   <td className="p-2 border">{entry.loginTime}</td>
//                   <td className="p-2 border">{entry.logoutTime}</td>
//                   <td className="p-2 border text-green-700">₹{entry.morningBonus}</td>
//                   <td className="p-2 border text-green-700">₹{entry.eveningBonus}</td>
//                   <td className="p-2 border font-bold text-indigo-700">
//                     ₹{(entry.morningBonus || 0) + (entry.eveningBonus || 0)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';

interface AttendanceEntry {
  username: string;
  date: string;
  loginTime: string | null;
  logoutTime: string | null;
  morningBonus: number | null;
  eveningBonus: number | null;
}

export default function AdminAttendancePage() {
  const [data, setData] = useState<AttendanceEntry[]>([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [filteredData, setFilteredData] = useState<AttendanceEntry[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/attendance?month=${month}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json.data || []);
        setFilteredData(json.data || []);
      } catch (err) {
        console.error(err);
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [month]);

  useEffect(() => {
    let filtered = data;

    if (username) {
      filtered = filtered.filter((entry) =>
        entry.username.toLowerCase().includes(username.toLowerCase())
      );
    }

    if (onlyEligible) {
      filtered = filtered.filter(
        (entry) => (entry.morningBonus || 0) + (entry.eveningBonus || 0) >= 100
      );
    }

    setFilteredData(filtered);
  }, [username, onlyEligible, data]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        📊 Admin Attendance Dashboard
      </h1>

      <div className="mb-4 flex flex-col sm:flex-row justify-center gap-4 items-center">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyEligible}
            onChange={(e) => setOnlyEligible(e.target.checked)}
          />
          Show Eligible Days (₹100+)
        </label>
      </div>

      {loading ? (
        <p className="text-center">Loading attendance data...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-red-600">No records found for {month}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="p-2 border">Username</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Login Time</th>
                <th className="p-2 border">Logout Time</th>
                <th className="p-2 border">Morning Bonus</th>
                <th className="p-2 border">Evening Bonus</th>
                <th className="p-2 border font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 border">{entry.username}</td>
                  <td className="p-2 border">{entry.date}</td>
                  <td className="p-2 border">{entry.loginTime ?? '-'}</td>
                  <td className="p-2 border">{entry.logoutTime ?? '-'}</td>
                  <td className="p-2 border text-green-700">₹{entry.morningBonus ?? 0}</td>
                  <td className="p-2 border text-green-700">₹{entry.eveningBonus ?? 0}</td>
                  <td className="p-2 border font-bold text-indigo-700">
                    ₹{(entry.morningBonus ?? 0) + (entry.eveningBonus ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
