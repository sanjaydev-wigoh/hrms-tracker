
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Dashboard from "./dashboard/page";
import Navbar from "./navbar/page";
import WigohLoader from "./wigohLoader";
// import HamburgerMenu from "./HamburgerMenu";
// import Image from "next/image";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);


  useEffect(() => {
    // Minimum loading delay to prevent flicker
    const timer = setTimeout(() => setMinLoadingTimePassed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user role on mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        console.log("🔍 Attempting to fetch user role...");
        const res = await fetch("/api/user-role");
        console.log("✅ Fetched user role response:", res.status);

        if (!res.ok) throw new Error("Could not get role");

        const data = await res.json();
        console.log("🎯 Role fetched:", data.role);

        setIsAdmin(data.role === "admin");
      } catch (err) {
        console.error("❌ Error fetching role:", err);
        setIsAdmin(false);
      }
    };

    if (isLoaded && user) {
      console.log("👤 Clerk user loaded:", user.id);
      fetchUserRole();
    }
  }, [isLoaded, user]);
  // useEffect(() => {
  //   const cachedRole = localStorage.getItem("userRole");
  //   if (cachedRole) {
  //     setIsAdmin(cachedRole === "admin");
  //   } else if (isLoaded && user) {
  //     const fetchUserRole = async () => {
  //       const res = await fetch("/api/user-role");
  //       if (res.ok) {
  //         const data = await res.json();
  //         setIsAdmin(data.role === "admin");
  //         localStorage.setItem("userRole", data.role);
  //       } else {
  //         setIsAdmin(false);
  //       }
  //     };
  //     fetchUserRole();
  //   }
  // }, [isLoaded, user]);
  

  if (!isLoaded || isAdmin === null || !minLoadingTimePassed) {
    return (
<WigohLoader/>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="bg-white/90 p-10 rounded-2xl shadow-2xl text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-3">
            ⚠️ Access Denied
          </h1>
          <p className="text-lg text-gray-700">
            Please <span className="text-[#6b4226] font-semibold">sign in</span>{" "}
            or <span className="text-[#6b4226] font-semibold">sign up</span> to
            continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!isAdmin && (
          <div className="min-h-screen bg-gradient-to-br from-white via-orange-600 to-purple-600 p-6 flex flex-col items-center justify-start">
            {/* Blurred background shapes */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* Dashboard Container */}
            <div className="relative z-10 w-full max-w-4xl bg-white px-10 py-12 text-center mt-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] h-[750px] border border-gray-100">
              {/* Profile Image */}
              {user.imageUrl && (
                <div className="flex justify-center mb-6">
                  <img
                    src={user.imageUrl}
                    alt="User Profile"
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-[#8b5e3c] shadow-lg"
                  />
                </div>
              )}

              {/* Welcome Message */}
              <h1 className="text-5xl font-extrabold text-gray-900 mb-3 drop-shadow-md">
                Have a Good Day!
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                👋 Hi{" "}
                <span className="font-semibold text-[#8b5e3c]">
                  {user.firstName || user.username}
                </span>
                , welcome to{" "}
                <span className="font-semibold text-[#8b5e3c]">wigoh.tech</span>{" "}
                — we’re glad you’re here!
              </p>

              {/* Dashboard Embed */}
              <Dashboard />
            </div>

            {/* Optional subtle grid pattern */}
            <div className="absolute inset-0 z-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none"></div>
          </div>
        // </div>
      )}
      {isAdmin && <Navbar />}
    </div>
  );
}
