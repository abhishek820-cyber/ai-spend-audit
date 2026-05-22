'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import SpendForm from '@/components/SpendForm'
import AuditResults from '@/components/AuditResults'
import LeadCapture from '@/components/LeadCapture'
import { AuditResultsSkeleton } from '@/components/Skeleton'
import { generateAudit } from '@/lib/auditEngine'
import { generateAuditSummary } from '@/lib/generateSummary'
import { supabase } from '@/lib/supabase'
import BenchmarkMode from '@/components/BenchmarkMode'
import { useToast } from '@/components/Toast'
import DarkModeToggle from '@/components/DarkModeToggle'
import SpendTrendChart from '@/components/SpendTrendChart'
import { useAuth } from '@/context/AuthContext'
import AuthModal from '@/components/AuthModal'
import UserMenu from '@/components/UserMenu'


export default function Home() {
  const [auditData, setAuditData] = useState<any>(null)
  const [auditId, setAuditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [savedFormData, setSavedFormData] = useState<any>(null)
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { showToast } = useToast()

  const handleFormSubmit = async (formData: any) => {
    setSavedFormData(formData)
    setLoading(true)
    setSummary(null)

    try {
      const audit = generateAudit(formData.tools)
      const publicId = uuidv4().slice(0, 8)

      const { error } = await supabase.from('audits').insert([{
        public_id: publicId,
        tools: formData.tools,
        total_monthly_savings: audit.totalMonthlySavings,
        total_annual_savings: audit.totalAnnualSavings,
        user_id: user?.id || null,
      }])

      if (!error) {
        setAuditId(publicId)
        setAuditData(audit)
        showToast('Audit generated successfully!', 'success')
        setLoading(false)

        setSummaryLoading(true)
        const summaryText = await generateAuditSummary({
          tools: formData.tools,
          totalMonthlySavings: audit.totalMonthlySavings,
          totalAnnualSavings: audit.totalAnnualSavings,
          useCase: formData.useCase,
          teamSize: formData.teamSize,
        })
        setSummary(summaryText)
        setSummaryLoading(false)
      }
    } catch (err) {
      console.error('Error:', err)
      showToast('Failed to generate audit. Please try again.', 'error')
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (auditId) {
      const url = `${window.location.origin}/audit/${auditId}`
      navigator.clipboard.writeText(url)
        .then(() => showToast('Audit URL copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy URL. Please try again.', 'error'))
    }
  }

  // 1. Loading State Header
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm fixed top-0 w-full z-50">
          <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
            <div className="flex items-center gap-stack-sm">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              <span className="text-h2 font-bold text-primary tracking-tight">AI Spend Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              {user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-surface-container-low text-primary border border-outline-variant rounded-full px-4 py-2 text-label-md hover:bg-surface-variant transition-colors flex items-center gap-base"
                >
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex items-center gap-3 mb-gutter">
            <div className="w-5 h-5 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
            <p className="text-body-md text-on-surface-variant">Analyzing your AI spend...</p>
          </div>
          <AuditResultsSkeleton />
        </main>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    )
  }

  // 2. Results State Header
  if (auditData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm fixed top-0 w-full z-50">
          <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
            <div className="flex items-center gap-stack-sm">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              <span className="text-h2 font-bold text-primary tracking-tight">AI Spend Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              {user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-surface-container-low text-primary border border-outline-variant rounded-full px-4 py-2 text-label-md hover:bg-surface-variant transition-colors flex items-center gap-base"
                >
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              )}
              <button
                onClick={() => {
                  setAuditData(null)
                  setAuditId(null)
                  setSummary(null)
                  setSavedFormData(null)
                }}
                className="flex items-center gap-1 text-primary text-body-sm font-medium hover:text-on-primary-fixed-variant transition-colors ml-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                New Audit
              </button>
            </div>
          </div>
        </header>

        <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <AuditResults
            results={auditData.results}
            totalMonthlySavings={auditData.totalMonthlySavings}
            totalAnnualSavings={auditData.totalAnnualSavings}
            onShare={handleShare}
          />

          <div className="mt-gutter">
            <SpendTrendChart
              currentMonthlySpend={auditData.results.reduce(
                (sum: number, r: any) => sum + r.currentSpend, 0
              )}
              optimizedMonthlySpend={
                auditData.results.reduce((sum: number, r: any) => sum + r.currentSpend, 0) -
                auditData.totalMonthlySavings
              }
              teamSize={parseInt(savedFormData?.teamSize || '1')}
            />
          </div>

          <div className="mt-gutter">
            <BenchmarkMode
              totalMonthlySpend={auditData.results.reduce((sum: number, r: any) => sum + r.currentSpend, 0)}
              teamSize={savedFormData?.teamSize || '1'}
              useCase={savedFormData?.useCase || 'Mixed'}
            />
          </div>

          {summaryLoading ? (
            <div className="mt-gutter bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="p-stack-md border-b border-outline-variant bg-surface-bright flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-surface-container-high rounded animate-pulse" />
                  <div className="h-3 w-56 bg-surface-container-high rounded animate-pulse" />
                </div>
              </div>
              <div className="p-stack-md space-y-3">
                <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-container-high rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-surface-container-high rounded animate-pulse" />
              </div>
            </div>
          ) : summary ? (
            <div className="mt-gutter bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="p-stack-md border-b border-outline-variant bg-surface-bright flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </div>
                <div>
                  <h3 className="text-h3 text-on-surface">AI Advisor Summary</h3>
                  <p className="text-body-sm text-on-surface-variant">Personalized analysis of your AI stack</p>
                </div>
              </div>
              <div className="p-stack-md space-y-4">
                {summary.split('\n\n').filter(p => p.trim()).map((paragraph, i) => (
                  <p key={i} className="text-body-md text-on-surface-variant leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-gutter bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
            <LeadCapture auditId={auditId!} monthlySavings={auditData.totalMonthlySavings} />
          </div>
        </main>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    )
  }

  // 3. Landing Page Header
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-stack-sm cursor-pointer hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <span className="text-h2 font-bold text-primary tracking-tight">AI Spend Audit</span>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-surface-container-low text-primary border border-outline-variant rounded-full px-4 py-2 text-label-md hover:bg-surface-variant transition-colors flex items-center gap-base"
              >
                <span>Sign In</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-stack-lg">
        {/* Hero Section */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg">
          <div className="flex flex-col md:flex-row items-center gap-stack-lg">
            <div className="w-full md:w-1/2 flex flex-col gap-stack-md text-center md:text-left">
              <h1 className="text-display-sm md:text-display-lg text-on-surface">
                Take control of your <span className="text-primary">AI spending</span>
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto md:mx-0">
                Get an instant audit of your AI tool stack. See exactly where you're overspending and discover real savings opportunities.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-stack-sm justify-center md:justify-start pt-base">
                <button
                  onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-primary text-on-primary rounded-full px-8 py-4 text-label-md hover:bg-on-primary-fixed-variant active:scale-95 transition-all shadow-sm"
                >
                  Start Free Audit
                </button>
                <button className="w-full sm:w-auto bg-surface-container-lowest text-on-surface border border-outline-variant rounded-full px-8 py-4 text-label-md hover:bg-surface-container-low active:scale-95 transition-all">
                  See How It Works
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 grid grid-cols-2 gap-gutter">
              {[
                { icon: 'savings', label: 'Avg Monthly Savings', value: '$2,400', trend: '+32%' },
                { icon: 'groups', label: 'Teams Audited', value: '1,200+', trend: 'This month' },
                { icon: 'verified', label: 'Tools Tracked', value: '35+', trend: 'Major AI tools' },
                { icon: 'bolt', label: 'Audit Time', value: '< 2 min', trend: 'Instant results' },
              ].map((stat, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
                  <div className="flex justify-between items-start mb-stack-sm">
                    <span className="text-body-sm text-on-surface-variant">{stat.label}</span>
                    <div className="p-1.5 bg-surface-container rounded-md text-primary">
                      <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                    </div>
                  </div>
                  <div className="text-display-sm text-on-surface mb-1">{stat.value}</div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="text-label-md">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg border-y border-outline-variant py-stack-md bg-surface-container-lowest">
          <p className="text-label-md text-on-surface-variant text-center mb-stack-sm uppercase tracking-widest">
            Trusted by engineering teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-stack-lg opacity-60">
            {['Acme Corp', 'GlobalTech', 'NexusFlow', 'ApexData'].map((name) => (
              <span key={name} className="text-h3 font-bold text-on-surface tracking-tight">{name}</span>
            ))}
          </div>
        </section>

        <section id="audit-form" className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg">
          <div className="text-center mb-stack-lg">
            <h2 className="text-h1 text-on-surface mb-stack-sm">Run Your Free Audit</h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Add your AI tools below and get an instant breakdown of your spending with personalized optimization recommendations.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="p-stack-md border-b border-outline-variant bg-surface-bright flex justify-between items-center">
              <h3 className="text-h3 text-on-surface">Your AI Tool Stack</h3>
              <span className="text-body-sm text-on-surface-variant">Free • No signup required</span>
            </div>
            <div className="p-stack-md">
              <SpendForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        </section>

        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-stack-lg">
          <div className="text-center mb-stack-lg">
            <h2 className="text-h1 text-on-surface mb-stack-sm">Engineered for Precision</h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Move beyond generic spreadsheets. Our audit engine uses real pricing data to surface actual savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
            <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-stack-md flex flex-col gap-stack-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-base">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="text-h3 text-on-surface">Automated Analysis</h3>
              <p className="text-body-sm text-on-surface-variant">
                Our engine instantly evaluates your tool stack against current pricing and surfaces optimization opportunities.
              </p>
            </div>

            <div className="md:col-span-2 bg-primary-container text-on-primary-container border border-primary-fixed-dim shadow-sm rounded-xl p-stack-md flex flex-col md:flex-row gap-stack-md items-center overflow-hidden relative">
              <div className="flex-1 flex flex-col gap-stack-sm z-10">
                <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center mb-base">
                  <span className="material-symbols-outlined">savings</span>
                </div>
                <h3 className="text-h3">Real Savings, Real Numbers</h3>
                <p className="text-body-sm opacity-90">
                  Every recommendation is backed by official vendor pricing. No guesses, no estimates — just accurate savings calculations.
                </p>
              </div>
              <div className="flex-1 w-full h-32 bg-surface-container-lowest rounded-lg border border-outline-variant/30 flex items-end p-base gap-2 z-10 opacity-80">
                <div className="w-1/4 bg-primary h-1/3 rounded-t-sm"></div>
                <div className="w-1/4 bg-primary h-2/3 rounded-t-sm"></div>
                <div className="w-1/4 bg-primary-container h-full rounded-t-sm"></div>
                <div className="w-1/4 bg-primary h-1/2 rounded-t-sm"></div>
              </div>
            </div>

            <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-stack-md flex flex-col gap-stack-sm">
              <div className="flex items-center justify-between mb-base border-b border-outline-variant pb-stack-sm">
                <h3 className="text-h3 text-on-surface flex items-center gap-base">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  AI-Powered Recommendations
                </h3>
                <span className="text-numeric-data text-primary">Personalized</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Get a personalized summary of your AI spend with specific recommendations tailored to your team size and use case.
              </p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-stack-md flex flex-col gap-stack-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-base">
                <span className="material-symbols-outlined">share</span>
              </div>
              <h3 className="text-h3 text-on-surface">Shareable Reports</h3>
              <p className="text-body-sm text-on-surface-variant">
                Share your audit via a unique URL. Perfect for presenting to your finance team or engineering manager.
              </p>
            </div>
          </div>
        </section>

        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mt-stack-lg">
          <div className="bg-secondary-container rounded-xl p-stack-lg text-center flex flex-col items-center border border-tertiary-fixed-dim">
            <h2 className="text-h2 text-on-secondary-container mb-stack-sm">Ready to optimize your stack?</h2>
            <p className="text-body-md text-on-secondary-container/80 mb-stack-md max-w-md">
              Join hundreds of companies using AI Spend Audit to eliminate waste and optimize their AI investments.
            </p>
            <button
              onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary text-on-primary rounded-full px-8 py-3 text-label-md hover:bg-on-primary-fixed-variant active:scale-95 transition-all shadow-sm"
            >
              Start Free Audit
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-on-secondary-fixed w-full py-stack-lg border-t border-on-secondary-fixed-variant mt-stack-lg">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start gap-stack-xs">
            <span className="text-h3 font-bold text-primary-fixed tracking-tight">AI Spend Audit</span>
            <span className="text-body-sm text-on-secondary-fixed-variant">© 2025 AI Spend Audit. All rights reserved.</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-stack-md">
            {['Privacy Policy', 'Terms of Service', 'Security', 'Documentation'].map((link) => (
              <a key={link} className="text-body-sm text-on-secondary-fixed-variant hover:text-primary-fixed transition-colors cursor-pointer" href="#">
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </main>
  )
}