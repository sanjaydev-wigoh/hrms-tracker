'use client'
export default function WigohLoader() {
    return (
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
  }
  