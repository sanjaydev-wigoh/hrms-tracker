
'use client';

import { useState } from 'react';

interface EligibleDay {
  date: string;
  loginBonus: number;
  logoutBonus: number;
}

interface EligibleDaysResponse {
  eligibleDays: EligibleDay[];
  total: number;
}

interface ClaimSubmitResponse {
  amount?: number;
  error?: string;
}

export default function AdminEligibleDaysPage() {
  const [username, setUsername] = useState('');
  const [month, setMonth] = useState('');
  const [data, setData] = useState<EligibleDaysResponse | null>(null);
  const [status, setStatus] = useState('');

  const fetchEligibleDays = async () => {
    setStatus('Loading...');
    try {
      const res = await fetch(`/api/admin/eligible-days?username=${username}&month=${month}`);
      const json: EligibleDaysResponse = await res.json();
      setData(json);
      setStatus('');
    } catch {
      setStatus('Error fetching eligible days');
    }
  };

  const handleCredit = async () => {
    setStatus('Crediting...');
    try {
      const res = await fetch(`/api/claims/submit`, {
        method: 'POST',
        body: JSON.stringify({ username, month }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json: ClaimSubmitResponse = await res.json();
      if (res.ok && json.amount !== undefined) {
        setStatus(`✅ Credited ₹${json.amount} successfully!`);
      } else {
        setStatus(`❌ ${json.error || 'Unknown error'}`);
      }
    } catch {
      setStatus('❌ Error submitting claim.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">🧾 Admin: View Eligible Days</h1>

      <input
        className="w-full border p-2 mb-2"
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <button
        onClick={fetchEligibleDays}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Fetch Eligible Days
      </button>

      {status && <p className="mt-4">{status}</p>}

      {data && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Eligible Dates:</h2>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {data.eligibleDays.map((entry, idx) => (
              <li key={idx}>
                {entry.date} → ₹{(entry.loginBonus || 0) + (entry.logoutBonus || 0)}
              </li>
            ))}
          </ul>
          <p><strong>Total Days:</strong> {data.eligibleDays.length}</p>
          <p><strong>Total Incentive:</strong> ₹{data.total}</p>

          <button
            onClick={handleCredit}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            💸 Credit Now
          </button>
        </div>
      )}
    </div>
  );
}
