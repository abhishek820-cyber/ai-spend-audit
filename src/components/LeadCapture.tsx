'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface LeadCaptureProps {
  auditId: string
  monthlySavings: number
}

export default function LeadCapture({ auditId, monthlySavings }: LeadCaptureProps) {
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Submitting lead with auditId:', auditId)
      
      const { data, error: insertError } = await supabase.from('leads').insert([
        {
          audit_id: auditId,
          email: email,
          company_name: companyName || null,
          role: role || null,
          team_size: teamSize || null,
        },
      ]).select()

      console.log('Response:', { data, insertError })

      if (insertError) {
        console.error('Insert error details:', insertError)
        setError(`Error: ${insertError.message}`)
      } else {
        setSubmitted(true)
        setEmail('')
        setCompanyName('')
        setRole('')
        setTeamSize('')
      }
    } catch (err) {
      console.error('Catch error:', err)
      setError('An error occurred. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-bold text-green-900 mb-2">Thanks for your interest!</h3>
        <p className="text-green-800">
          We have saved your audit. {monthlySavings > 500 && 'Our team will reach out shortly to discuss your savings opportunities.'}
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Get Your Full Report</h3>
      <p className="text-gray-600 mb-4">Enter your email to receive the complete audit and recommendations.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="you@company.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Acme Inc"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Engineering Lead"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Team Size</label>
          <input
            type="text"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., 5-10"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading ? 'Saving...' : 'Get Full Report'}
        </button>
      </form>
    </div>
  )
}