
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
// import { Menu, X } from 'lucide-react'
// import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs';
import SegmentDiagram from '../segments/page'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  // const router = useRouter()
    const { user } = useUser();

  const toggleMenu = () => setIsOpen(!isOpen)

  // Fetch user role on mount
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
    <div>
      <nav >
        {/* <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="text-2xl font-bold">Admin</div>

          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <ul className="hidden md:flex space-x-6 font-medium">
            {isAdmin && (
              <>
                <div>About</div>
                
              </>
            )}
            <li>
              <Link href="/blog">Blog</Link>
            </li>
          </ul>
        </div> */}

        {/* Mobile menu */}
        {isOpen && (
          <ul className="md:hidden mt-4 space-y-3 text-lg font-medium">
            {isAdmin && (
              <>
                <li>
                  <Link
                    href="/components/monthlyclaim/AdminClaimPanel"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={toggleMenu}>
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/services" onClick={toggleMenu}>
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" onClick={toggleMenu}>
                    Contact
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href="/blog" onClick={toggleMenu}>
                Blog
              </Link>
            </li>
          </ul>
        )}
      </nav>

      {/* Admin-only message */}
      <div className="bg-#f5f5f5">
  {isAdmin && (
    <div className="text-center py-3 text-xl bg-white font-semibold text-orange-600 relative z-3">
      <h1 className="text-4xl font-extrabold drop-shadow-sm mb-2">
        Have a Good Day!
      </h1>
      <p className="text-base text-gray-800 mb-4">
        👋 Hello Admin <span className="font-semibold text-[#8b5e3c]">{user?.firstName || user?.username || 'Guest'}</span>, welcome to <span className="font-semibold text-[#8b5e3c]">wigoh.tech</span> — we’re glad you’re here!
      </p>
    </div>
  )}

  <SegmentDiagram />
</div>

     
    </div>
  )
}
