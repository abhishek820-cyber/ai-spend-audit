'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const [audits, setAudits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return

    const fetchAudits = async () => {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data) setAudits(data)
      setLoading(false)
    }

    fetchAudits()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-outline-variant border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
          <Link href="/" className="flex items-center gap-stack-sm">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <span className="text-h2 font-bold text-primary tracking-tight">AI Spend Audit</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-primary text-body-sm font-medium hover:text-on-primary-fixed-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            New Audit
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="mb-stack-lg">
          <h1 className="text-h1 text-on-surface mb-1">My Audits</h1>
          <p className="text-body-md text-on-surface-variant">
            Your saved audit history — {audits.length} audit{audits.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {audits.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-xl">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4 block">
              history
            </span>
            <h2 className="text-h3 text-on-surface mb-2">No audits yet</h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Run your first audit to start tracking your AI spend
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-on-primary-fixed-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Run First Audit
            </Link>
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="p-stack-md border-b border-outline-variant bg-surface-bright">
              <h2 className="text-h3 text-on-surface">Audit History</h2>
            </div>

            <div className="divide-y divide-outline-variant">
              {audits.map((audit) => {
                const toolCount = audit.tools?.length || 0
                const date = new Date(audit.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })
                const time = new Date(audit.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit', minute: '2-digit',
                })

                return (
                  <div key={audit.id} className="p-stack-md hover:bg-surface-bright transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-numeric-data text-on-surface mb-1">
                          {toolCount} tool{toolCount !== 1 ? 's' : ''} analyzed
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {audit.tools?.slice(0, 3).map((t: any) => (
                            <span key={t.name} className="text-label-md text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                              {t.name}
                            </span>
                          ))}
                          {toolCount > 3 && (
                            <span className="text-label-md text-on-surface-variant">
                              +{toolCount - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-stack-md shrink-0">
                      <div className="text-right hidden md:block">
                        <p className="text-numeric-data text-primary font-bold">
                          ${audit.total_monthly_savings?.toFixed(0)}/mo saved
                        </p>
                        <p className="text-label-md text-on-surface-variant">
                          {date} at {time}
                        </p>
                      </div>

                      <Link
                        href={`/audit/${audit.public_id}`}
                        className="flex items-center gap-1.5 px-3 py-2 border border-primary text-primary rounded-lg text-body-sm font-medium hover:bg-primary hover:text-on-primary transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        View
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}