'use client'

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Sidebar from "../sidebar/page";

export default function Header() {
  return (
    <div className="flex items-center justify-between px-6 py-6 shadow-lg rounded-b-2xl">
      {/* Logo / Title */}
      {/* <div className="text-lg font-semibold tracking-wide">WigohTech Dashboard</div> */}
<img className="cursor-pointer" src="/wigoh.png" alt="wigoh-logo" width={80} height={60}/>
      {/* Navigation Items */}
      <nav className="flex items-center space-x-8 text-sm md:text-base">
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="px-5 py-2 rounded-full border border-sky-600 text-sky-700 font-semibold hover:bg-sky-100 active:scale-95 transition-all duration-150">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-5 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 active:scale-95 transition-all duration-150 shadow-md">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
           
        </div>
       <Sidebar/>
      </nav>
    </div>
  );
}
