
// 'use client';

// import useSWR from 'swr';
// import { useState } from 'react';

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

// export default function ClaimPage() {
//   const month = '2025-05';
//   const { data, error, isLoading, mutate } = useSWR(`/api/claims?month=${month}`, fetcher);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitMsg, setSubmitMsg] = useState('');

//   if (isLoading) return <p className="text-center mt-10">Loading...</p>;
//   if (error) return <p className="text-center mt-10 text-red-600">Failed to load data</p>;

//   const attendance = data?.attendance ?? [];
//   const alreadyClaimed = data?.claimed;
//   const claimedAmount = data?.amount || 0;

//   const total = attendance.reduce(
//     (sum: number, entry: any) => sum + (entry.loginBonus || 0) + (entry.logoutBonus || 0),
//     0
//   );

//   const handleClaim = async () => {
//     setSubmitting(true);
//     setSubmitMsg('');
//     try {
//       const res = await fetch('/api/claims/submit', {
//         method: 'POST',
//         body: JSON.stringify({ month }),
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const result = await res.json();

//       if (!res.ok || result.error) {
//         setSubmitMsg(result.error || 'Failed to submit claim.');
//       } else {
//         setSubmitMsg(`✅ Claimed ₹${result.amount} successfully!`);
//         mutate(); // revalidate
//       }
//     } catch (err) {
//       console.error(err);
//       setSubmitMsg('Something went wrong. Try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
//       <h1 className="text-2xl font-bold text-indigo-600 mb-4">💰 Claim Your Incentive</h1>
//       <p className="mb-2">Month: <strong>{month}</strong></p>
//       <p className="mb-2">Total Eligible Incentive: <strong>₹{total}</strong></p>
//       <p className="mb-4">
//         Status:{' '}
//         {alreadyClaimed ? (
//           <span className="text-green-600 font-semibold">✅ Claimed ₹{claimedAmount}</span>
//         ) : (
//           <span className="text-red-600 font-semibold">❌ Not Yet Claimed</span>
//         )}
//       </p>

//       <button
//         disabled={alreadyClaimed || total === 0 || submitting}
//         onClick={handleClaim}
//         className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
//       >
//         {submitting ? 'Submitting...' : 'Submit Claim'}
//       </button>

//       {submitMsg && <p className="mt-4 text-center font-medium">{submitMsg}</p>}
//     </div>
//   );
// }
'use client';

import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AttendanceEntry {
  loginBonus?: number;
  logoutBonus?: number;
  // add other fields if needed
}

export default function ClaimPage() {
  const month = '2025-05';
  const { data, error, isLoading, mutate } = useSWR(`/api/claims?month=${month}`, fetcher);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Failed to load data</p>;

  const attendance: AttendanceEntry[] = data?.attendance ?? [];
  const alreadyClaimed = data?.claimed;
  const claimedAmount = data?.amount || 0;

  const total = attendance.reduce(
    (sum: number, entry: AttendanceEntry) => sum + (entry.loginBonus || 0) + (entry.logoutBonus || 0),
    0
  );

  const handleClaim = async () => {
    setSubmitting(true);
    setSubmitMsg('');
    try {
      const res = await fetch('/api/claims/submit', {
        method: 'POST',
        body: JSON.stringify({ month }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (!res.ok || result.error) {
        setSubmitMsg(result.error || 'Failed to submit claim.');
      } else {
        setSubmitMsg(`✅ Claimed ₹${result.amount} successfully!`);
        mutate(); // revalidate
      }
    } catch (err) {
      console.error(err);
      setSubmitMsg('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">💰 Claim Your Incentive</h1>
      <p className="mb-2">Month: <strong>{month}</strong></p>
      <p className="mb-2">Total Eligible Incentive: <strong>₹{total}</strong></p>
      <p className="mb-4">
        Status:{' '}
        {alreadyClaimed ? (
          <span className="text-green-600 font-semibold">✅ Claimed ₹{claimedAmount}</span>
        ) : (
          <span className="text-red-600 font-semibold">❌ Not Yet Claimed</span>
        )}
      </p>

      <button
        disabled={alreadyClaimed || total === 0 || submitting}
        onClick={handleClaim}
        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Claim'}
      </button>

      {submitMsg && <p className="mt-4 text-center font-medium">{submitMsg}</p>}
    </div>
  );
}
