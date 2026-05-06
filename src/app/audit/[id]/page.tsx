'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AuditPage() {
  const params = useParams()
  const id = params?.id as string
  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAudit = async () => {
      if (!id) return

      try {
        const { data, error: queryError } = await supabase
          .from('audits')
          .select('*')
          .eq('public_id', id)
          .single()

        if (queryError || !data) {
          setError('Audit not found')
        } else {
          setAudit(data)
        }
      } catch (err) {
        setError('Error loading audit')
      } finally {
        setLoading(false)
      }
    }

    fetchAudit()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading audit...</p>
      </main>
    )
  }

  if (error || !audit) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Not Found</h1>
          <p className="text-gray-600 mb-6">This audit does not exist or has been deleted.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Create a new audit
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
          <h1 className="text-4xl font-bold text-green-700 mb-2">AI Spend Audit Results</h1>
          <div className="mt-6">
            <p className="text-gray-600 text-sm mb-2">Potential Monthly Savings</p>
            <p className="text-5xl font-bold text-green-600">${audit.total_monthly_savings.toFixed(2)}</p>
            <p className="text-gray-600 text-sm mt-2">
              Annual savings: <span className="text-2xl font-bold text-green-600">${audit.total_annual_savings.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tools Analyzed</h2>
          <div className="space-y-4">
            {audit.tools.map((tool: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{tool.name}</h3>
                    <p className="text-sm text-gray-600">
                      Plan: {tool.plan} • Seats: {tool.seats}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Monthly Spend</p>
                    <p className="text-2xl font-bold">${tool.monthlySpend.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center p-8 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-2xl font-bold mb-4">Want detailed recommendations?</h3>
          <p className="text-gray-700 mb-6">Run your own audit to get personalized analysis.</p>
          <Link href="/" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            Run Your Own Audit
          </Link>
        </div>
      </div>
    </main>
  )
}