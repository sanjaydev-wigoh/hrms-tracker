
'use client';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
 

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
 const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = async (type: 'start' | 'end') => {
    const toastId = toast.loading('Submitting...');
    try {
      const res = await fetch(`/api/attendance/${type}`, { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        toast.update(toastId, {
          render: `❌ ${data.error || 'Something went wrong'}`,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
        return;
      }

      const isBonus = type === 'start' ? data.loginBonus === 100 : data.logoutBonus === 100;
      const bonusText = isBonus
        ? '🎉 ₹100 added to your wallet!'
        : '😔 Not eligible for bonus today.';

      toast.update(toastId, {
        render: `✅ ${type === 'start' ? 'Logged IN' : 'Logged OUT'} successfully!\n${bonusText}`,
        type: isBonus ? 'success' : 'info',
        isLoading: false,
        autoClose: 5000,
      });
    } catch {
      toast.update(toastId, {
        render: '❌ Network error. Try again.',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const timeString = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="min-h-screen  from-purple-50 to-orange-50 flex justify-center px-4">
      <ToastContainer position="top-center" />

      <div className="w-full max-w-xl text-center space-y-12">
        {/* Clock */}
        <div>
          <h1 className="text-6xl font-extrabold text-purple-700 drop-shadow-sm tracking-widest">
            {timeString}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Indian Standard Time</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-12">
          <button
            onClick={() => handleClick('start')}
            className="group relative w-24 h-24 rounded-full border-4 border-purple-600 text-purple-700 font-semibold text-xl flex items-center justify-center transition-all duration-300 hover:bg-purple-100 hover:shadow-xl"
          >
            IN
            <span className="absolute inset-0 rounded-full border border-purple-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></span>
          </button>

          <button
            onClick={() => handleClick('end')}
            className="group relative w-24 h-24 rounded-full border-4 border-orange-500 text-orange-600 font-semibold text-xl flex items-center justify-center transition-all duration-300 hover:bg-orange-100 hover:shadow-xl"
          >
            OUT
            <span className="absolute inset-0 rounded-full border border-orange-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></span>
          </button>
        </div>

        {/* Footer Message */}
        <p className="text-lg text-gray-700 font-medium">
          Earn ₹100 for logging in before 8:00 AM and another ₹100 for logging out after 7:00 PM!
        </p>
    <div className="flex justify-center items-center gap-4 mt-6">
  <button     onClick={() => router.push('/components/incentives')}
    className="px-6 py-2 rounded-full text-white font-medium bg-gradient-to-r from-orange-500 to-purple-600 shadow-md hover:from-orange-600 hover:to-purple-700 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-300"
  >
    Daily Incentives
  </button>
  <button   onClick={() => router.push('/components/wallet')}
    className="px-6 py-2 rounded-full text-white font-medium bg-gradient-to-r from-purple-600 to-orange-500 shadow-md hover:from-purple-700 hover:to-orange-600 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-300"
  >
    Wallet
  </button>
</div>
      </div>
     

    </div>
  );
}
