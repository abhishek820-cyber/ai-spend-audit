'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'
import Link from 'next/link'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    showToast('Signed out successfully', 'info')
    setOpen(false)
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-md font-medium hover:bg-on-primary-fixed-variant transition-colors"
      >
        {initials}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden">
            {/* User info */}
            <div className="p-3 border-b border-outline-variant bg-surface-bright">
              <p className="text-body-sm font-medium text-on-surface truncate">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-label-md text-on-surface-variant truncate">{user?.email}</p>
            </div>

            {/* Menu items */}
            <div className="p-1">
              <Link
                href="/history"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">history</span>
                My Audits
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm text-error hover:bg-error-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}