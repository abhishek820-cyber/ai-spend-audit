'use client'

import { getBenchmark, getCompanySizeLabel, getCompanySize } from '@/lib/benchmarkData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface BenchmarkModeProps {
  totalMonthlySpend: number
  teamSize: string
  useCase: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-sm shadow-lg">
        <p className="text-body-sm font-medium text-on-surface mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.fill }} />
            <p className="text-body-sm text-on-surface-variant">
              {entry.name}: <span className="font-medium text-on-surface">${entry.value}</span>
            </p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function BenchmarkMode({ totalMonthlySpend, teamSize, useCase }: BenchmarkModeProps) {
  const teamSizeNum = parseInt(teamSize) || 1
  const spendPerDev = Math.round(totalMonthlySpend / teamSizeNum)
  const benchmark = getBenchmark(useCase, teamSizeNum)
  const companySize = getCompanySize(teamSizeNum)

  if (!benchmark) return null

  const percentile = calculatePercentile(spendPerDev, benchmark.p25SpendPerDev, benchmark.avgSpendPerDev, benchmark.p75SpendPerDev)
  const vsAverage = spendPerDev - benchmark.avgSpendPerDev
  const vsAveragePercent = Math.round((vsAverage / benchmark.avgSpendPerDev) * 100)
  const isOverspending = spendPerDev > benchmark.avgSpendPerDev

  const chartData = [
    { name: 'Bottom 25%', value: benchmark.p25SpendPerDev, fill: '#bbcabf' },
    { name: 'Industry Avg', value: benchmark.avgSpendPerDev, fill: '#006c49' },
    { name: 'Top 25%', value: benchmark.p75SpendPerDev, fill: '#e0e3e5' },
    { name: 'Your Team', value: spendPerDev, fill: isOverspending ? '#ba1a1a' : '#10b981' },
  ]

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-stack-md border-b border-outline-variant bg-surface-bright flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shrink-0">
            <span className="material-symbols-outlined text-[18px]">leaderboard</span>
          </div>
          <div>
            <h3 className="text-h3 text-on-surface">Benchmark Mode</h3>
            <p className="text-body-sm text-on-surface-variant">
              How your AI spend compares to {getCompanySizeLabel(companySize)}s using AI for {useCase || 'general purposes'}
            </p>
          </div>
        </div>
        <span className="text-label-md text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
          {getCompanySizeLabel(companySize)}
        </span>
      </div>

      <div className="p-stack-md">
        {/* Hero metric */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-md">
          {/* Your spend per dev */}
          <div className={`rounded-xl p-stack-md border ${isOverspending ? 'bg-error-container border-error/20' : 'bg-primary border-primary-container'}`}>
            <p className={`text-body-sm mb-2 ${isOverspending ? 'text-on-error-container' : 'text-on-primary opacity-90'}`}>
              Your spend per developer
            </p>
            <p className={`text-display-sm font-bold ${isOverspending ? 'text-error' : 'text-on-primary'}`}>
              ${spendPerDev}/mo
            </p>
            <div className={`flex items-center gap-1 mt-1 ${isOverspending ? 'text-error' : 'text-primary-fixed-dim'}`}>
              <span className="material-symbols-outlined text-[16px]">
                {isOverspending ? 'trending_up' : 'trending_down'}
              </span>
              <span className="text-label-md">
                {Math.abs(vsAveragePercent)}% {isOverspending ? 'above' : 'below'} average
              </span>
            </div>
          </div>

          {/* Industry average */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md">
            <div className="flex justify-between items-start mb-4">
              <span className="text-body-sm text-on-surface-variant">Industry average</span>
              <div className="p-1.5 bg-surface-container rounded-md text-primary">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
            </div>
            <p className="text-display-sm text-on-surface font-bold">${benchmark.avgSpendPerDev}/mo</p>
            <p className="text-label-md text-on-surface-variant mt-1">per developer</p>
          </div>

          {/* Percentile */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md">
            <div className="flex justify-between items-start mb-4">
              <span className="text-body-sm text-on-surface-variant">Your percentile</span>
              <div className="p-1.5 bg-surface-container rounded-md text-primary">
                <span className="material-symbols-outlined text-[20px]">percent</span>
              </div>
            </div>
            <p className="text-display-sm text-on-surface font-bold">{percentile}th</p>
            <p className="text-label-md text-on-surface-variant mt-1">
              {percentile > 75 ? 'Top spender' : percentile > 50 ? 'Above average' : percentile > 25 ? 'Below average' : 'Low spender'}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-stack-md">
          <p className="text-body-sm font-medium text-on-surface mb-3">Monthly AI spend per developer vs industry</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#bbcabf" strokeOpacity={0.4} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#3c4a42' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#3c4a42' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="$/dev/mo" radius={[4, 4, 0, 0]} maxBarSize={64}>
                {chartData.map((entry, index) => (
                  <rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spend range indicator */}
        <div className="mb-stack-md p-stack-sm bg-surface-container-low rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-label-md text-on-surface-variant">Typical range for your segment</span>
            <span className="text-label-md text-primary font-medium">
              ${benchmark.p25SpendPerDev} — ${benchmark.p75SpendPerDev}/dev/mo
            </span>
          </div>
          <div className="relative h-3 bg-surface-container-high rounded-full overflow-hidden">
            {/* Range bar */}
            <div
              className="absolute h-full bg-primary/20 rounded-full"
              style={{
                left: `${(benchmark.p25SpendPerDev / benchmark.p75SpendPerDev) * 100 * 0.6}%`,
                width: `${((benchmark.p75SpendPerDev - benchmark.p25SpendPerDev) / benchmark.p75SpendPerDev) * 100 * 0.6}%`,
              }}
            />
            {/* Average marker */}
            <div
              className="absolute h-full w-0.5 bg-primary"
              style={{ left: `${(benchmark.avgSpendPerDev / (benchmark.p75SpendPerDev * 1.3)) * 100}%` }}
            />
            {/* Your marker */}
            <div
              className={`absolute h-full w-1 rounded-full ${isOverspending ? 'bg-error' : 'bg-primary-container'}`}
              style={{ left: `${Math.min(95, (spendPerDev / (benchmark.p75SpendPerDev * 1.3)) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-label-md text-on-surface-variant">$0</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-primary" />
              <span className="text-label-md text-on-surface-variant">Avg</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-sm ${isOverspending ? 'bg-error' : 'bg-primary-container'}`} />
              <span className="text-label-md text-on-surface-variant">You</span>
            </div>
          </div>
        </div>

        {/* Popular tools in segment */}
        <div className="mb-stack-md">
          <p className="text-body-sm font-medium text-on-surface mb-3">
            Most popular tools in your segment
          </p>
          <div className="flex flex-wrap gap-2">
            {benchmark.topTools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant text-body-sm text-on-surface"
              >
                <span className="material-symbols-outlined text-[14px] text-primary mr-1.5">check_circle</span>
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="flex items-start gap-3 p-stack-sm bg-secondary-container rounded-xl border border-outline-variant">
          <span className="material-symbols-outlined text-primary shrink-0">lightbulb</span>
          <div>
            <p className="text-body-sm font-medium text-on-surface mb-1">Industry insight</p>
            <p className="text-body-sm text-on-surface-variant">{benchmark.insight}</p>
          </div>
        </div>

        {/* Action based on result */}
        {isOverspending && (
          <div className="mt-stack-sm flex items-start gap-3 p-stack-sm bg-error-container rounded-xl border border-error/20">
            <span className="material-symbols-outlined text-error shrink-0">warning</span>
            <div>
              <p className="text-body-sm font-medium text-on-error-container mb-1">You're spending above average</p>
              <p className="text-body-sm text-on-error-container opacity-80">
                Your team spends ${Math.abs(vsAverage)} more per developer than the industry average.
                That's ${Math.abs(vsAverage) * teamSizeNum * 12}/year above benchmark.
                Consider reviewing your tool stack against our recommendations above.
              </p>
            </div>
          </div>
        )}

        {!isOverspending && spendPerDev > 0 && (
          <div className="mt-stack-sm flex items-start gap-3 p-stack-sm bg-surface-container-low rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-primary shrink-0">verified</span>
            <div>
              <p className="text-body-sm font-medium text-on-surface mb-1">You're spending efficiently</p>
              <p className="text-body-sm text-on-surface-variant">
                Your team spends ${Math.abs(vsAverage)} less per developer than the industry average.
                You're saving ${Math.abs(vsAverage) * teamSizeNum * 12}/year vs benchmark.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function calculatePercentile(value: number, p25: number, avg: number, p75: number): number {
  if (value <= p25) return Math.round((value / p25) * 25)
  if (value <= avg) return Math.round(25 + ((value - p25) / (avg - p25)) * 25)
  if (value <= p75) return Math.round(50 + ((value - avg) / (p75 - avg)) * 25)
  return Math.min(99, Math.round(75 + ((value - p75) / p75) * 25))
}