'use client'

import { AuditResult } from '@/lib/auditEngine'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AuditResultsProps {
  results: AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  onShare: () => void
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-sm shadow-lg">
        <p className="text-body-sm font-medium text-on-surface mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <p className="text-body-sm text-on-surface-variant">
              {entry.name}: <span className="font-medium text-on-surface">${entry.value.toFixed(2)}</span>
            </p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function AuditResults({
  results,
  totalMonthlySavings,
  totalAnnualSavings,
  onShare,
}: AuditResultsProps) {
  const getRecommendationColor = (rec: string) => {
    if (rec === 'Optimal') return 'bg-surface-container text-on-surface-variant'
    if (rec.includes('Switch') || rec.includes('Downgrade')) return 'bg-error-container text-on-error-container'
    if (rec.includes('Review') || rec.includes('Monitor')) return 'bg-secondary-container text-on-secondary-container'
    return 'bg-surface-container text-on-surface-variant'
  }

  // Chart data
  const chartData = results.map((r) => ({
    name: r.toolName.length > 12 ? r.toolName.slice(0, 12) + '…' : r.toolName,
    fullName: r.toolName,
    'Current Spend': r.currentSpend,
    'Optimized Spend': Math.max(0, r.currentSpend - r.monthlySavings),
    Savings: r.monthlySavings,
  }))

  const hasAnySavings = totalMonthlySavings > 0

  return (
    <div className="space-y-gutter">
      {/* Hero savings card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-stack-md">
          <div>
            <h1 className="text-h1 text-on-surface mb-1">Your AI Spend Audit</h1>
            <p className="text-body-md text-on-surface-variant">Here's where you can optimize your spending</p>
          </div>
          <div className="flex gap-stack-sm">
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-4 py-2.5 border border-primary text-primary rounded-lg text-body-sm font-medium hover:bg-primary hover:text-on-primary transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Audit
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant text-on-surface-variant rounded-lg text-body-sm hover:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export PDF
            </button>
          </div>
        </div>

        {/* Savings metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-stack-md">
          <div className="bg-primary border border-primary-container rounded-xl p-stack-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <span className="material-symbols-outlined text-[48px] text-on-primary">savings</span>
            </div>
            <p className="text-body-sm text-on-primary opacity-90 mb-2">Potential Monthly Savings</p>
            <p className="text-display-sm text-on-primary font-bold">${totalMonthlySavings.toFixed(2)}</p>
            <div className="flex items-center gap-1 text-primary-fixed-dim mt-1">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span className="text-label-md">{results.length} tools analyzed</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-body-sm text-on-surface-variant">Annual Savings</span>
              <div className="p-1.5 bg-surface-container rounded-md text-primary">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
            </div>
            <p className="text-display-sm text-on-surface font-bold">${totalAnnualSavings.toFixed(2)}</p>
            <p className="text-label-md text-primary mt-1">Per year potential</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-body-sm text-on-surface-variant">Tools Reviewed</span>
              <div className="p-1.5 bg-surface-container rounded-md text-primary">
                <span className="material-symbols-outlined text-[20px]">category</span>
              </div>
            </div>
            <p className="text-display-sm text-on-surface font-bold">{results.length}</p>
            <p className="text-label-md text-on-surface-variant mt-1">AI tools in your stack</p>
          </div>
        </div>
      </div>

      {/* Chart section */}
      {hasAnySavings && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-stack-md border-b border-outline-variant bg-surface-bright flex justify-between items-center">
            <div>
              <h2 className="text-h3 text-on-surface">Savings Breakdown</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Current vs optimized spend per tool
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#bbcabf]" />
                <span className="text-label-md text-on-surface-variant">Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#006c49]" />
                <span className="text-label-md text-on-surface-variant">Optimized</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#10b981]" />
                <span className="text-label-md text-on-surface-variant">Savings</span>
              </div>
            </div>
          </div>

          <div className="p-stack-md">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                barGap={4}
                barCategoryGap="30%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#bbcabf"
                  strokeOpacity={0.4}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#3c4a42' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#3c4a42' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="Current Spend"
                  fill="#e0e3e5"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="Optimized Spend"
                  fill="#006c49"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="Savings"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Per-tool breakdown */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-stack-md border-b border-outline-variant bg-surface-bright flex justify-between items-center">
          <h2 className="text-h3 text-on-surface">Breakdown by Tool</h2>
          <span className="text-body-sm text-on-surface-variant">{results.length} tools</span>
        </div>

        <div className="divide-y divide-outline-variant">
          {results.map((result, index) => (
            <div key={index} className="p-stack-md hover:bg-surface-bright transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                  <div>
                    <h3 className="text-numeric-data text-on-surface">{result.toolName}</h3>
                    <p className="text-body-sm text-on-surface-variant">${result.currentSpend.toFixed(2)}/mo current</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-label-md font-medium ${getRecommendationColor(result.recommendation)}`}>
                  {result.recommendation}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-label-md text-on-surface-variant uppercase mb-1">Current Spend</p>
                  <p className="text-numeric-data text-on-surface">${result.currentSpend.toFixed(2)}/mo</p>
                </div>
                <div>
                  <p className="text-label-md text-on-surface-variant uppercase mb-1">Monthly Savings</p>
                  <p className="text-numeric-data text-primary">${result.monthlySavings.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-label-md text-on-surface-variant uppercase mb-1">Annual Savings</p>
                  <p className="text-numeric-data text-primary">${result.annualSavings.toFixed(2)}</p>
                </div>
              </div>

              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (result.monthlySavings / (result.currentSpend || 1)) * 100)}%` }}
                />
              </div>

              <p className="text-body-sm text-on-surface-variant">{result.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credex CTA */}
      {totalMonthlySavings > 500 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm flex items-start gap-4">
          <div className="p-2 bg-primary text-on-primary rounded-lg shrink-0">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <div className="flex-1">
            <h3 className="text-h3 text-on-surface mb-1">Ready to capture these savings?</h3>
            <p className="text-body-sm text-on-surface-variant mb-3">
              Credex helps companies secure AI credits at substantial discounts. Our team can help you implement these changes immediately.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-numeric-data text-primary">Save ${totalMonthlySavings.toFixed(2)}/mo</span>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-medium hover:bg-on-primary-fixed-variant transition-colors">
                Book a Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {totalMonthlySavings < 100 && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm flex items-start gap-4">
          <div className="p-2 bg-surface-container-high text-primary rounded-lg shrink-0">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <div>
            <h3 className="text-h3 text-on-surface mb-1">You're spending wisely.</h3>
            <p className="text-body-sm text-on-surface-variant">
              Your current AI tool spend is well-optimized. We'll notify you when new optimization opportunities apply to your stack.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}