'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import SpendForm from '@/components/SpendForm'
import AuditResults from '@/components/AuditResults'
import LeadCapture from '@/components/LeadCapture'
import { generateAudit, type ToolInput } from '@/lib/auditEngine'
import { generateAuditSummary } from '@/lib/generateSummary'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [auditData, setAuditData] = useState<any>(null)
  const [auditId, setAuditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)

  const handleFormSubmit = async (formData: any) => {
    setLoading(true)
    setSummary(null)

    try {
      // Generate audit
      const audit = generateAudit(formData.tools)

      // Save to database
      const publicId = uuidv4().slice(0, 8)
      const { error } = await supabase.from('audits').insert([
        {
          public_id: publicId,
          tools: formData.tools,
          total_monthly_savings: audit.totalMonthlySavings,
          total_annual_savings: audit.totalAnnualSavings,
        },
      ])

      if (error) {
        console.error('Error saving audit:', error)
      } else {
        setAuditId(publicId)
        setAuditData(audit)

        // Generate summary
        const summaryText = await generateAuditSummary({
          tools: formData.tools,
          totalMonthlySavings: audit.totalMonthlySavings,
          totalAnnualSavings: audit.totalAnnualSavings,
          useCase: formData.useCase,
          teamSize: formData.teamSize,
        })
        console.log('Summary generated:', summaryText)
        setSummary(summaryText)
      }
    } catch (err) {
      console.error('Error generating audit:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (auditId) {
      const url = `${window.location.origin}/audit/${auditId}`
      navigator.clipboard.writeText(url)
      alert('Audit URL copied to clipboard!')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">AI Spend Audit</h1>
          <p className="text-xl text-gray-300">
            See where you're overspending on AI tools and discover real savings opportunities.
          </p>
        </div>

        {!auditData ? (
          <div className="bg-white rounded-lg shadow-xl p-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Analyzing your spend...</p>
              </div>
            ) : (
              <SpendForm onSubmit={handleFormSubmit} />
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <AuditResults
              results={auditData.results}
              totalMonthlySavings={auditData.totalMonthlySavings}
              totalAnnualSavings={auditData.totalAnnualSavings}
              onShare={handleShare}
            />

            {summary && (
              <div className="bg-white rounded-lg shadow-xl p-8 border-l-4 border-blue-500">
                <h3 className="text-lg font-bold mb-3 text-gray-900">AI Advisor Summary</h3>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-xl p-8">
              <LeadCapture auditId={auditId!} monthlySavings={auditData.totalMonthlySavings} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}