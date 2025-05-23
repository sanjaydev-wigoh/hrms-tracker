
// 'use client';

// import { useEffect, useState } from 'react';

// interface MonthlyClaimFormProps {
//   username: string;
//   month: string; // format: '2025-05'
// }

// export default function MonthlyClaimForm({ username, month }: MonthlyClaimFormProps) {
//   const [upiId, setUpiId] = useState('');
//   const [totalAmount, setTotalAmount] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [claimMessage, setClaimMessage] = useState('');
//   const [isClaimDay, setIsClaimDay] = useState(false);

//   useEffect(() => {
//     const today = new Date();
//     setIsClaimDay(today.getDate() === 25);

//     const fetchMonthlyAmount = async () => {
//       try {
//         const res = await fetch(`/api/claims/monthly?username=${username}&month=${month}`);
//         const data = await res.json();
    
//         if (res.ok) {
//           setTotalAmount(data.totalAmount);
//         } else {
//           setClaimMessage('❌ Failed to fetch monthly incentive.');
//         }
//       } catch (error) {
//         setClaimMessage('❌ Error while fetching incentive.');
//       } finally {
//         setLoading(false);
//       }
//     };
    

//     fetchMonthlyAmount();
//   }, [username, month]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!upiId || !totalAmount) {
//       setClaimMessage('⚠️ UPI ID and valid amount are required.');
//       return;
//     }

//     setSubmitting(true);
//     setClaimMessage('⏳ Submitting claim...');

//     try {
//       const res = await fetch('/api/claims/admin-submit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, month, amount: totalAmount, upiId }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setClaimMessage(`✅ Monthly claim submitted for ₹${data.data.amount}`);
//         setTotalAmount(0); // Reflect claimed state
//       } else {
//         setClaimMessage(`❌ Error: ${data.error}`);
//       }
//     } catch (err) {
//       setClaimMessage('❌ Submission failed.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <p className="text-center">🔄 Loading monthly claim data...</p>;

//   return (
//     <div className="max-w-xl mx-auto mt-8 border p-6 rounded-xl shadow bg-white">
//       <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">📅 Monthly Incentive Claim</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">Username</label>
//           <input
//             value={username}
//             readOnly
//             className="w-full mt-1 px-4 py-2 border rounded bg-gray-100"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Month</label>
//           <input
//             value={month}
//             readOnly
//             className="w-full mt-1 px-4 py-2 border rounded bg-gray-100"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">Total Incentive</label>
//           <input
//             value={totalAmount !== null ? `₹${totalAmount}` : '₹0'}
//             readOnly
//             className="w-full mt-1 px-4 py-2 border rounded bg-green-100 font-bold"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">UPI ID</label>
//           <input
//             type="text"
//             placeholder="e.g. example@upi"
//             value={upiId}
//             onChange={(e) => setUpiId(e.target.value)}
//             required
//             className="w-full mt-1 px-4 py-2 border rounded"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={!isClaimDay || submitting || totalAmount === 0}
//           className={`w-full py-2 px-4 rounded text-white font-semibold ${
//             !isClaimDay || totalAmount === 0
//               ? 'bg-gray-400 cursor-not-allowed'
//               : submitting
//                 ? 'bg-gray-500'
//                 : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {submitting
//             ? 'Submitting...'
//             : !isClaimDay
//               ? '⛔ Claim Not Available Today'
//               : totalAmount === 0
//                 ? 'No Incentive to Claim'
//                 : '📩 Submit Monthly Claim'}
//         </button>

//         {!isClaimDay && (
//           <p className="text-sm text-center text-red-500">
//             Claims can only be submitted on the 25th of each month.
//           </p>
//         )}

//         {claimMessage && (
//           <p className="text-center mt-4 text-sm font-medium text-gray-700">{claimMessage}</p>
//         )}
//       </form>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';

export default function MonthlyClaimForm() {
  const [usernames, setUsernames] = useState<string[]>([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  // const [month, setMonth] = useState(() => {
  //   const now = new Date();
  //   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  // });
  const [month] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  

  const [upiId, setUpiId] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [isClaimDay, setIsClaimDay] = useState(false);

  useEffect(() => {
    fetch('/api/users/list')
      .then((res) => res.json())
      .then((data) => setUsernames(data.usernames || []));
  }, []);

  useEffect(() => {
    const today = new Date();
    setIsClaimDay(today.getDate() === 25);
  }, []);

  const handleSearch = async () => {
    if (!selectedUsername) return;
    setLoading(true);
    setClaimMessage('');
    setTotalAmount(null);

    try {
      const res = await fetch(`/api/claims/monthly?username=${selectedUsername}&month=${month}`);
      const data = await res.json();

      if (res.ok) {
        setTotalAmount(data.totalAmount);
      } else {
        setClaimMessage('❌ No data found for selected user.');
      }
    } catch {
      setClaimMessage('❌ Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!upiId || !totalAmount || !selectedUsername) {
      setClaimMessage('⚠️ UPI ID and valid amount are required.');
      return;
    }

    setSubmitting(true);
    setClaimMessage('⏳ Submitting claim...');

    try {
      const res = await fetch('/api/claims/admin-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: selectedUsername, month, amount: totalAmount, upiId }),
      });

      const data = await res.json();

      if (res.ok) {
        setClaimMessage(`✅ Claim submitted for ₹${data.data.amount}`);
        setTotalAmount(0);
      } else {
        setClaimMessage(`❌ Error: ${data.error}`);
      }
    } catch {
      setClaimMessage('❌ Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 rounded-2xl shadow-xl bg-white border-2 border-purple-100">
    <h2 className="text-3xl font-extrabold text-center mb-8 text-purple-700 tracking-tight">
       Admin Monthly Claim
    </h2>

    <div className="mb-6 space-y-2">
      <label className="block text-sm font-medium text-purple-800">Select Username</label>
      <select
        className="w-full px-4 py-2 rounded-lg border border-purple-300 bg-white text-purple-900 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        value={selectedUsername}
        onChange={(e) => setSelectedUsername(e.target.value)}
      >
        <option value="">-- Choose User --</option>
        {usernames.map((uname) => (
          <option key={uname} value={uname}>
            {uname}
          </option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        disabled={!selectedUsername || loading}
        className={`mt-2 w-full py-2 font-semibold text-white rounded-lg transition cursor-pointer ${
          loading
            ? 'bg-gray-400'
            : 'bg-orange-500 hover:bg-orange-600'
        }`}
      >
        {loading ? 'Loading...' : ' Fetch Claim Info'}
      </button>
    </div>

    {totalAmount !== null && (
      <form onSubmit={handleSubmit} className="space-y-5 mt-6">
        <div>
          <label className="block text-sm font-medium text-purple-800">Month</label>
          <input
            value={month}
            readOnly
            className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-purple-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-800">Total Incentive</label>
          <input
            value={`₹${totalAmount}`}
            readOnly
            className="w-full px-4 py-2 bg-purple-100 text-purple-800 font-bold rounded-lg border border-purple-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-800">UPI ID</label>
          <input
            type="text"
            placeholder="e.g. example@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={!isClaimDay || submitting || totalAmount === 0}
          className={`w-full py-2 text-lg font-semibold rounded-lg cursor-pointer transition text-white ${
            !isClaimDay || totalAmount === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : submitting
                ? 'bg-purple-400'
                : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {submitting
            ? 'Submitting...'
            : !isClaimDay
              ? '⛔ Not Claim Day'
              : totalAmount === 0
                ? 'No Incentive to Claim'
                : ' Submit Claim'}
        </button>
      </form>
    )}

    {claimMessage && (
      <p className="mt-6 text-center text-sm font-medium text-orange-600">{claimMessage}</p>
    )}
  </div>
  );
}

