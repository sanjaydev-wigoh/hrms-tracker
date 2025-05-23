
'use client';

import { useEffect, useState, useRef } from 'react';

const Loader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#f97316] to-[#9333ea]">
    <h1 className="text-6xl font-extrabold text-white tracking-widest animate-pulse">
      WIGOH
    </h1>
    <p className="text-xl text-white mt-2 italic font-medium">
      We all grow together
    </p>
    <div className="mt-8 flex space-x-2">
      <div
        className="w-4 h-4 bg-white rounded-full animate-bounce"
        style={{ animationDelay: '0s' }}
      ></div>
      <div
        className="w-4 h-4 bg-white rounded-full animate-bounce"
        style={{ animationDelay: '0.2s' }}
      ></div>
      <div
        className="w-4 h-4 bg-white rounded-full animate-bounce"
        style={{ animationDelay: '0.4s' }}
      ></div>
    </div>
  </div>
);

const TickAnimation = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions silently
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-[#f97316] to-[#9333ea]">
      <svg
        className="w-24 h-24 text-white stroke-white"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="stroke-white"
          cx="26"
          cy="26"
          r="25"
          fill="none"
          strokeWidth="2"
          strokeDasharray="166"
          strokeDashoffset="166"
          style={{ animation: 'dash 0.7s ease forwards' }}
        />
        <path
          className="stroke-white"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="48"
          strokeDashoffset="48"
          d="M14 27l7 7 16-16"
          style={{ animation: 'dashCheck 0.7s 0.7s ease forwards' }}
        />
      </svg>
      <p className="text-2xl text-white mt-4 font-semibold">Claim Sent!</p>

      <audio
        ref={audioRef}
        src="/sucess.mp3"
        preload="auto"
      />

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes dashCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<{
    username: string;
    totalEligible: number;
    totalClaimed: number;
    remainingBalance: number;
  } | null>(null);
  const [claimAmount, setClaimAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      const res = await fetch('/api/wallet');
      const data = await res.json();
      setWallet(data);
    };
    fetchWallet();
  }, []);

  const handleClaim = async () => {
    setMessage('');
    setError('');
    setLoading(true);
    setSuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const res = await fetch('/api/claim-request-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(claimAmount) }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setClaimAmount(0);

      setTimeout(() => {
        setSuccess(false);
        // setMessage('📧 Claim request sent to admin!');
      }, 2000);
    } else {
      setError(data.error || 'Something went wrong while sending the request.');
    }
  };

  if (loading) return <Loader />;
  if (success) return <TickAnimation />;

  if (!wallet)
    return (
      <Loader />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f97316] to-[#9333ea] p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl border-2 border-[#9333ea] p-8">
        <h1 className="text-3xl font-extrabold text-center text-[#f97316] mb-8 tracking-tight">
          🎯 Wallet Summary
        </h1>

        <table className="w-full table-auto text-left mb-6 border border-[#f97316] rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-[#f97316] text-white">
            <tr>
              <th className="py-3 px-5">Username</th>
              <th className="py-3 px-5">Total Eligible</th>
              <th className="py-3 px-5">Claimed</th>
              <th className="py-3 px-5">Remaining</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
            <tr className="border-t border-gray-200">
              <td className="py-3 px-5">{wallet.username}</td>
              <td className="py-3 px-5 font-semibold text-green-600">₹{wallet.totalEligible}</td>
              <td className="py-3 px-5 font-semibold text-blue-600">₹{wallet.totalClaimed}</td>
              <td className="py-3 px-5 font-semibold text-yellow-600">₹{wallet.remainingBalance}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <input
            type="number"
            min="0"
            value={claimAmount}
            onChange={(e) => setClaimAmount(Number(e.target.value))}
            className="border-2 border-[#9333ea] rounded-md px-4 py-2 w-52 focus:outline-none focus:ring-2 focus:ring-[#f97316] text-gray-800"
            placeholder="Enter claim amount"
          />
          <button
            onClick={handleClaim}
            disabled={loading}
            className={`${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#7e22ce]'
            } bg-[#9333ea] transition duration-200 text-white font-semibold px-6 py-2 rounded-md shadow-lg`}
          >
            Request Claim
          </button>
        </div>

        {message && <p className="mt-2 text-green-600 font-medium">{message}</p>}
        {error && <p className="mt-2 text-red-600 font-medium">{error}</p>}
      </div>
    </div>
  );
}
