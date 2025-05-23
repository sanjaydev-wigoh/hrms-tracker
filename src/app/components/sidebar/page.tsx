"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
export default function Sidebar () {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
    const toggleSidebar = () => setIsOpen(!isOpen)

    useEffect(() => {
        const fetchUserRole = async () => {
          try {
            const res = await fetch('/api/user-role')
            if (!res.ok) throw new Error('Could not get role')
            const data = await res.json()
            setIsAdmin(data.role === 'admin')
          } catch (err) {
            console.error('Error fetching role:', err)
            setIsAdmin(false)
          }
        }
    
        fetchUserRole()
      }, [])

  return (
    <div> <nav>
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleSidebar}
        className="p-2 text-gray-700 hover:text-orange-600 focus:outline-none"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </div>
  </nav>

  {/* Sidebar - no overlay, fixed left */}
  <div
  className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
>
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-bold text-orange-600">Menu</h2>
      <button
        onClick={toggleSidebar}
        className="text-gray-700 hover:text-red-600"
      >
        <X size={24} />
      </button>
    </div>

    <nav className="flex flex-col gap-3 p-4 font-medium text-white bg-[#6b2eb7] h-full">
  {isAdmin && (
    <>
      <Link
        href="/admin-incentive"
        onClick={toggleSidebar}
        className="transition-all duration-200 ease-in-out px-4 py-5 rounded-md hover:bg-orange-500 hover:text-white active:scale-95 shadow-sm"
      >
        Get Attendance
      </Link>
      <Link
        href="/components/monthlyclaim"
        onClick={toggleSidebar}
        className="transition-all duration-200 ease-in-out px-4 py-5 rounded-md hover:bg-orange-500 hover:text-white active:scale-95 shadow-sm"
      >
         Monthly Incentives
      </Link>
      <Link
        href="/components/settings"
        onClick={toggleSidebar}
        className="transition-all duration-200 ease-in-out px-4 py-5 rounded-md hover:bg-orange-500 hover:text-white active:scale-95 shadow-sm"
      >
        View Live Attendance
      </Link>
      <Link
        href="/components/contact-mail"
        onClick={toggleSidebar}
        className="transition-all duration-200 ease-in-out px-4 py-5 rounded-md hover:bg-orange-500 hover:text-white active:scale-95 shadow-sm"
      >
        Contact Users
      </Link>
    </>
  )}

  <Link
    href="/components/contact-mail"
    onClick={toggleSidebar}
    className="transition-all duration-200 ease-in-out px-4 py-5 rounded-md hover:bg-orange-500 hover:text-white active:scale-95 shadow-sm"
  >
    Settings
  </Link>
</nav>
  </div>
</div>
  )
}