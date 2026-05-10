'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import DarkModeToggle from '@/components/DarkModeToggle'

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
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm fixed top-0 w-full z-50">
          <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
            <div className="flex items-center gap-stack-sm">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              <span className="text-h2 font-bold text-primary tracking-tight">AI Spend Audit</span>
            </div>
            <DarkModeToggle />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-outline-variant border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-body-md text-on-surface-variant">Loading audit...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm fixed top-0 w-full z-50">
          <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
            <div className="flex items-center gap-stack-sm">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              <span className="text-h2 font-bold text-primary tracking-tight">AI Spend Audit</span>
            </div>
            <DarkModeToggle />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center pt-16 px-margin-mobile">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error text-[32px]">search_off</span>
            </div>
            <h1 className="text-h1 text-on-surface mb-2">Audit Not Found</h1>
            <p className="text-body-md text-on-surface-variant mb-6">
              This audit does not exist or has been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-on-primary-fixed-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Run Your Own Audit
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const savingsPercent = Math.round(
    (audit.total_monthly_savings /
      (audit.tools.reduce((sum: number, t: any) => sum + t.monthlySpend, 0) || 1)) *
      100
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-stack-sm">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <span className="text-h2 font-bold text-primary tracking-tight">AI Spend Audit</span>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Link
              href="/"
              className="flex items-center gap-2 bg-primary text-on-primary rounded-full px-4 py-2 text-label-md hover:bg-on-primary-fixed-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Run Free Audit
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">

        {/* Shared audit banner */}
        <div className="mb-gutter flex items-center gap-3 p-stack-sm bg-secondary-container rounded-xl border border-outline-variant">
          <span className="material-symbols-outlined text-primary">share</span>
          <p className="text-body-sm text-on-secondary-container">
            This is a shared AI spend audit report. Run your own free audit to see your personalized savings.
          </p>
        </div>

        {/* Hero savings */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm mb-gutter">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-stack-md mb-stack-md">
            <div>
              <h1 className="text-h1 text-on-surface mb-1">AI Spend Audit Results</h1>
              <p className="text-body-md text-on-surface-variant">
                Shared audit report • {new Date(audit.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Monthly savings hero */}
            <div className="bg-primary border border-primary-container rounded-xl p-stack-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <span className="material-symbols-outlined text-[48px] text-on-primary">savings</span>
              </div>
              <p className="text-body-sm text-on-primary opacity-90 mb-2">Monthly Savings</p>
              <p className="text-display-sm text-on-primary font-bold">
                ${audit.total_monthly_savings.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 text-primary-fixed-dim mt-1">
                <span className="material-symbols-outlined text-[16px]">trending_down</span>
                <span className="text-label-md">{savingsPercent}% cost reduction</span>
              </div>
            </div>

            {/* Annual savings */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-body-sm text-on-surface-variant">Annual Savings</span>
                <div className="p-1.5 bg-surface-container rounded-md text-primary">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
              </div>
              <p className="text-display-sm text-on-surface font-bold">
                ${audit.total_annual_savings.toFixed(2)}
              </p>
              <p className="text-label-md text-primary mt-1">Per year potential</p>
            </div>

            {/* Tools count */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-body-sm text-on-surface-variant">Tools Reviewed</span>
                <div className="p-1.5 bg-surface-container rounded-md text-primary">
                  <span className="material-symbols-outlined text-[20px]">category</span>
                </div>
              </div>
              <p className="text-display-sm text-on-surface font-bold">{audit.tools.length}</p>
              <p className="text-label-md text-on-surface-variant mt-1">AI tools analyzed</p>
            </div>
          </div>
        </div>

        {/* Tools breakdown table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-gutter">
          <div className="p-stack-md border-b border-outline-variant bg-surface-bright flex justify-between items-center">
            <h2 className="text-h3 text-on-surface">Tools Analyzed</h2>
            <span className="text-body-sm text-on-surface-variant">{audit.tools.length} tools</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="p-4 text-label-md text-on-surface-variant uppercase tracking-wider font-medium">Tool</th>
                  <th className="p-4 text-label-md text-on-surface-variant uppercase tracking-wider font-medium">Plan</th>
                  <th className="p-4 text-label-md text-on-surface-variant uppercase tracking-wider font-medium">Seats</th>
                  <th className="p-4 text-label-md text-on-surface-variant uppercase tracking-wider font-medium text-right">Monthly Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {audit.tools.map((tool: any, index: number) => (
                  <tr key={index} className="hover:bg-surface-bright transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface shrink-0">
                          <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                        </div>
                        <span className="text-numeric-data text-on-surface">{tool.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-md">
                        {tool.plan}
                      </span>
                    </td>
                    <td className="p-4 text-body-md text-on-surface-variant">{tool.seats}</td>
                    <td className="p-4 text-numeric-data text-on-surface text-right font-medium">
                      ${tool.monthlySpend.toFixed(2)}/mo
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-surface-container-low border-t border-outline-variant">
                  <td colSpan={3} className="p-4 text-body-sm font-medium text-on-surface">Total Monthly Spend</td>
                  <td className="p-4 text-numeric-data text-on-surface text-right font-bold">
                    ${audit.tools.reduce((sum: number, t: any) => sum + t.monthlySpend, 0).toFixed(2)}/mo
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary-container rounded-xl p-stack-lg text-center flex flex-col items-center border border-tertiary-fixed-dim">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary mb-stack-md">
            <span className="material-symbols-outlined text-[28px]">search</span>
          </div>
          <h2 className="text-h2 text-on-secondary-container mb-stack-sm">Want to see your savings?</h2>
          <p className="text-body-md text-on-secondary-container/80 mb-stack-md max-w-md">
            Run your own free AI spend audit in under 2 minutes. No signup required.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-full px-8 py-3 text-label-md hover:bg-on-primary-fixed-variant active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Run Your Free Audit
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-on-secondary-fixed w-full py-stack-lg border-t border-on-secondary-fixed-variant mt-stack-lg">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-4 md:space-y-0">
          <span className="text-h3 font-bold text-primary-fixed tracking-tight">AI Spend Audit</span>
          <span className="text-body-sm text-on-secondary-fixed-variant">© 2025 AI Spend Audit. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}