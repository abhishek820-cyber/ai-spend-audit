'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/Toast'

interface LeadCaptureProps {
  auditId: string
  monthlySavings: number
}

export default function LeadCapture({ auditId, monthlySavings }: LeadCaptureProps) {
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [honeypot, setHoneypot] = useState('') // ← bot trap
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitCount, setSubmitCount] = useState(0)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)

  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check — bots fill hidden fields, humans don't
    if (honeypot) {
      console.warn('Bot detected via honeypot')
      setSubmitted(true) // fake success so bots don't retry
      return
    }

    // Rate limiting — max 3 submissions per 60 seconds
    const now = Date.now()
    if (submitCount >= 3 && now - lastSubmitTime < 60000) {
      const rateLimitMsg = 'Too many attempts. Please wait a minute.'
      setError(rateLimitMsg)
      showToast(rateLimitMsg, 'error')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const emailMsg = 'Please enter a valid email address.'
      setError(emailMsg)
      showToast(emailMsg, 'error')
      return
    }

    setLoading(true)
    setError(null)
    setSubmitCount((c) => c + 1)
    setLastSubmitTime(now)

    try {
      const { error: insertError } = await supabase.from('leads').insert([{
        audit_id: auditId,
        email,
        company_name: companyName || null,
        role: role || null,
        team_size: teamSize || null,
      }])

      if (insertError) {
        setError(`Error: ${insertError.message}`)
        showToast('Failed to save report. Please try again.', 'error')
      } else {
        setSubmitted(true)
        showToast('Report saved! Check your inbox shortly.', 'success')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      showToast('Connection error. Please check your internet.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
  const labelClass = "block text-label-md text-on-surface-variant uppercase tracking-wider mb-1.5"

  if (submitted) {
    return (
      <div className="flex items-center gap-4 p-stack-md bg-surface-container-low rounded-xl border border-outline-variant">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
          <span className="material-symbols-outlined">check</span>
        </div>
        <div>
          <h3 className="text-h3 text-on-surface mb-1">You're all set!</h3>
          <p className="text-body-sm text-on-surface-variant">
            We've saved your audit.{' '}
            {monthlySavings > 500 && 'Our team will reach out shortly to discuss your savings opportunities.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-stack-md pb-stack-sm border-b border-outline-variant">
        <span className="material-symbols-outlined text-primary">mail</span>
        <div>
          <h3 className="text-h3 text-on-surface">Get Your Full Report</h3>
          <p className="text-body-sm text-on-surface-variant">
            Enter your email to receive the complete audit and recommendations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Honeypot field — hidden from humans, visible to bots */}
        <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@company.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClass}
              placeholder="Acme Inc"
            />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
              placeholder="Engineering Lead"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Team Size</label>
          <input
            type="text"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className={inputClass}
            placeholder="e.g., 5-10"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-error-container rounded-lg">
            <span className="material-symbols-outlined text-error text-[18px]">error</span>
            <p className="text-body-sm text-on-error-container">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3.5 bg-primary text-on-primary font-medium rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">send</span>
              Get Full Report
            </>
          )}
        </button>

        <p className="text-label-md text-on-surface-variant text-center">
          No spam. Unsubscribe anytime.
        </p>
      </form>
    </div>
  )
}