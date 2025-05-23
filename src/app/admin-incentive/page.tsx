
'use client';
import { useState, useEffect } from 'react';

;
export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [month, setMonth] = useState('');
  // const [attendance, setAttendance] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<
  { date: string; loginTime?: string; logoutTime?: string; loginBonus?: number; logoutBonus?: number }[]
>([]);
  // const [eligibleDays, setEligibleDays] = useState<any[]>([]);
  const [eligibleDays, setEligibleDays] = useState<
  { date: string; loginBonus?: number; logoutBonus?: number }[]
>([]);
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState('');
  const [showEligible, setShowEligible] = useState(false);
  const [viewOption, setViewOption] = useState('all');
  const [claimMessage, setClaimMessage] = useState('');
const [submitting, setSubmitting] = useState(false);

  // interface Request {
  //   id: string;
  //   user: { username: string };
  //   amount: number;
  //   status: string;
  // }

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    setMonth(currentMonth);
  }, []);

  const fetchAttendance = async () => {
    if (!month) {
      setStatus('⚠️ Please select a month.');
      return;
    }
    setStatus('⏳ Loading attendance...');
    try {
      const res = await fetch(`/api/admin/attendance?username=${username}&month=${month}`);
      if (!res.ok) {
        const error = await res.text();
        setStatus(`❌ Error: ${error}`);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.attendance) && data.attendance.length > 0) {
        setAttendance(data.attendance);

        const eligible = data.attendance.filter(
          (a: { loginBonus?: number; logoutBonus?: number }) =>
            (a.loginBonus || 0) + (a.logoutBonus || 0) > 0
        );
        setTotalDays(eligible.length);
        const amount = eligible.reduce(
          (sum: number, a: { loginBonus: number; logoutBonus: number; }) => sum + (a.loginBonus || 0) + (a.logoutBonus || 0),
          0
        );
        setTotalAmount(amount);
        setStatus('');
      } else {
        setStatus('ℹ️ No attendance available for this month.');
        setAttendance([]);
        setEligibleDays([]);
      }
    } catch (err) {
      console.error(err); 
      setStatus('❌ Failed to load attendance.');
    }
  };

  const fetchEligibleDays = async () => {
    if (!month) {
      setStatus('⚠️ Please select a month.');
      return;
    }
    setStatus('⏳ Loading eligible days...');
    try {
      const res = await fetch(`/api/admin/attendance?username=${username}&month=${month}`);
      if (!res.ok) {
        const error = await res.text();
        setStatus(`❌ Error: ${error}`);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data.attendance)) {
        const eligible = data.attendance.filter(
          (a: { loginBonus?: number; logoutBonus?: number }) =>
            (a.loginBonus || 0) >= 100 || (a.logoutBonus || 0) >= 100
        );
        setEligibleDays(eligible);
        setStatus('');
        setShowEligible(true);
      } else {
        setStatus('ℹ️ No eligible days found.');
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to load eligible days.');
    }
  };

  const handleViewChange = (view: string) => {
    setViewOption(view);
    if (view === 'eligible') {
      fetchEligibleDays();
    } else {
      setEligibleDays([]);
      setShowEligible(false);
    }
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-xl font-semibold text-indigo-700 border-b pb-1 mb-3">{title}</h3>
  );

  const StatsSummary = ({ days, amount }: { days: number; amount: number }) => (
    <div className="mt-4 text-center text-base font-medium bg-gray-50 border p-4 rounded">
      <p>
        ✅ Eligible Days: <span className="text-blue-600 font-semibold">{days}</span>
      </p>
      <p>
        💰 Total Incentive: <span className="text-green-600 font-bold">₹{amount}</span>
      </p>
    </div>
  );
  const submitClaim = async () => {
    if (!username || !month) {
      setClaimMessage('⚠️ Username and month are required.');
      return;
    }
  
    setSubmitting(true);
    setClaimMessage('⏳ Submitting claim...');
  
    try {
      const res = await fetch('/api/claims/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, month }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setClaimMessage(`✅ Claim submitted: ₹${data.data.total}`);
      } else {
        setClaimMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setClaimMessage('❌ Failed to submit claim.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl mt-20 mx-auto px-6 py-10 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-800">🛠️ Admin: Attendance Claim Viewer</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
        <button
          onClick={fetchAttendance}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer"
        >
          Fetch
        </button>
      </div>

      {status && <p className="text-sm text-red-600 font-medium mb-4">{status}</p>}

      <div className="mb-4 flex gap-6">
        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
          <input
            type="radio"
            name="viewOption"
            value="all"
            checked={viewOption === 'all'}
            onChange={() => handleViewChange('all')}
          />
          View All Attendance
        </label>
        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
          <input
            type="radio"
            name="viewOption"
            value="eligible"
            checked={viewOption === 'eligible'}
            onChange={() => handleViewChange('eligible')}
          />
          View Eligible Days (₹100+)
        </label>
      </div>

      {viewOption === 'all' && attendance.length > 0 && (
        <>
          <SectionTitle title="📅 All Attendance Records" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Login</th>
                  <th className="p-2 border">Logout</th>
                  <th className="p-2 border text-green-700">Login Bonus</th>
                  <th className="p-2 border text-green-700">Logout Bonus</th>
                  <th className="p-2 border text-green-800">Total Bonus</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((entry, i) => (
                  <tr key={i} className="text-center hover:bg-gray-50">
                    <td className="p-2 border">{new Date(entry.date).toLocaleDateString('en-IN')}</td>
                    <td className="p-2 border">{entry.loginTime || '—'}</td>
                    <td className="p-2 border">{entry.logoutTime || '—'}</td>
                    <td className="p-2 border text-green-600">
                      {entry.loginBonus ? `₹${entry.loginBonus}` : '—'}
                    </td>
                    <td className="p-2 border text-green-600">
                      {entry.logoutBonus ? `₹${entry.logoutBonus}` : '—'}
                    </td>
                    <td className="p-2 border font-semibold text-green-800">
                      ₹{(entry.loginBonus || 0) + (entry.logoutBonus || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StatsSummary days={totalDays} amount={totalAmount} />
        </>
      )}

      {showEligible && viewOption === 'eligible' && eligibleDays.length > 0 && (
        <>
          <SectionTitle title="✅ Eligible Days with Bonuses" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300 rounded">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Login Bonus</th>
                  <th className="p-2 border">Logout Bonus</th>
                  <th className="p-2 border">Total Bonus</th>
                </tr>
              </thead>
              <tbody>
                {eligibleDays.map((entry, i) => (
                  <tr key={i} className="text-center hover:bg-green-50">
                    <td className="p-2 border">{new Date(entry.date).toLocaleDateString('en-IN')}</td>
                    <td className="p-2 border text-green-600">
                      {entry.loginBonus ? `₹${entry.loginBonus}` : '—'}
                    </td>
                    <td className="p-2 border text-green-600">
                      {entry.logoutBonus ? `₹${entry.logoutBonus}` : '—'}
                    </td>
                    <td className="p-2 border font-semibold text-green-800">
                      ₹{(entry.loginBonus || 0) + (entry.logoutBonus || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StatsSummary
            days={eligibleDays.length}
            amount={eligibleDays.reduce(
              (sum, a) => sum + (a.loginBonus || 0) + (a.logoutBonus || 0),
              0
            )}
          />
        </>
      )}

      <div className="text-center">
        <button
          className="mt-8 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 cursor-pointer" 
          onClick={fetchEligibleDays}
        >
          🔍 Refresh Eligible Days
        </button>
      </div>

      <div className="text-center mt-6">
  <button
    onClick={submitClaim}
    disabled={submitting}
    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
  >
    📤 {submitting ? 'Submitting...' : 'Submit Claim'}
  </button>
  {claimMessage && (
    <p className="mt-3 text-sm font-medium text-gray-800">{claimMessage}</p>
  )}
</div>
<div>
  {/* <MonthlyClaimForm username={username} month={month}/> */}
{/* <MonthlyClaimForm/> */}
</div>

    </div>
    
  );
}