'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const { showToast } = useToast()

  const inputClass = "w-full px-4 py-2.5 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
  const labelClass = "block text-label-md text-on-surface-variant uppercase tracking-wider mb-1.5"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          showToast(error.message || 'Sign in failed', 'error')
        } else {
          showToast('Welcome back!', 'success')
          onClose()
        }
      } else {
        if (!fullName.trim()) {
          showToast('Please enter your full name', 'error')
          setLoading(false)
          return
        }
        const { error } = await signUpWithEmail(email, password, fullName)
        if (error) {
          showToast(error.message || 'Sign up failed', 'error')
        } else {
          showToast('Account created! Check your email to verify.', 'success')
          onClose()
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle()
    if (error) showToast('Google sign in failed', 'error')
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-stack-md border-b border-outline-variant bg-surface-bright flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
            </div>
            <div>
              <h2 className="text-h3 text-on-surface">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                {mode === 'signin' ? 'Access your saved audits' : 'Save and revisit your audits'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="p-stack-md">
          {/* Google sign in */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors mb-stack-md"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            <span className="text-body-md text-on-surface font-medium">Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 mb-stack-md">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-label-md text-on-surface-variant">or</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="John Smith"
                />
              </div>
            )}

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Min. 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-on-primary font-medium rounded-lg hover:bg-on-primary-fixed-variant transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-body-sm text-on-surface-variant mt-4">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-primary font-medium hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}