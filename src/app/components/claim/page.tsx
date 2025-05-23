
'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

type WalletData = {
  eligible: number
  claimed: number
  remaining: number
}

export default function ClaimSubmitButton() {
  const { user } = useUser()
  const [status, setStatus] = useState('')
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)

  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?.username) return

      try {
        const res = await fetch(`/api/wallet/${user.username}?month=${currentMonth}`)
        const data = await res.json()
        setWallet(data)
      } catch (err) {
        console.error('Failed to fetch wallet:', err)
        setStatus('Error fetching wallet data.')
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [user, currentMonth])

  const handleClaim = async () => {
    if (!user?.username || !wallet) return

    if (wallet.remaining <= 0) {
      setStatus('❌ Sorry, you don&apost have any balance left in your wallet for this month.')
      return
    }

    setStatus('Submitting...')
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          month: currentMonth,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to submit claim')
      }

      const data = await res.json()
      setStatus(`✅ Claim submitted successfully! ₹${data.total} credited.`)
      // Optionally refresh wallet data
      setWallet((prev) =>
        prev ? { ...prev, claimed: prev.claimed + data.total, remaining: prev.remaining - data.total } : prev
      )
    } catch (err) {
      console.error(err)
      setStatus('❌ Error submitting claim.')
    }
  }

  if (loading) return <p className="text-center mt-4">Loading wallet...</p>
  if (!wallet) return <p className="text-center mt-4">No wallet data found.</p>

  return (
    <div className="mt-6 text-center space-y-3">
      <div className="bg-gray-100 p-4 rounded shadow">
        <p>🪙 <strong>Total Eligible:</strong> ₹{wallet.eligible}</p>
        <p>💸 <strong>Claimed:</strong> ₹{wallet.claimed}</p>
        <p>💰 <strong>Remaining:</strong> ₹{wallet.remaining}</p>
      </div>

      <button
        onClick={handleClaim}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit This Month&apos;s Claim
      </button>

      {status && <p className="mt-2 text-gray-800">{status}</p>}
    </div>
  )
}
