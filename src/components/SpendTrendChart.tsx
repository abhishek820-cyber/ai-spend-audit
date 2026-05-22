'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts'

interface SpendTrendProps {
  currentMonthlySpend: number
  optimizedMonthlySpend: number
  teamSize: number
}

function generateTrendData(currentSpend: number, optimizedSpend: number) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()

  // Generate past 6 months of mock data with natural growth
  const past = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12
    const growthFactor = 1 + (i * 0.08) + (Math.random() * 0.05 - 0.025)
    const historicalBase = currentSpend * 0.65
    return {
      month: months[monthIndex],
      actual: Math.round(historicalBase * growthFactor),
      projected: null,
      optimized: null,
      type: 'past',
    }
  })

  // Current month
  const currentData = {
    month: months[currentMonth] + ' (now)',
    actual: Math.round(currentSpend),
    projected: Math.round(currentSpend),
    optimized: Math.round(currentSpend),
    type: 'current',
  }

  // Generate next 6 months projected data
  const future = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth + i + 1) % 12
    const growthFactor = 1 + ((i + 1) * 0.06)
    return {
      month: months[monthIndex],
      actual: null,
      projected: Math.round(currentSpend * growthFactor),
      optimized: Math.round(optimizedSpend * (1 + (i * 0.03))),
      type: 'future',
    }
  })

  return [...past, currentData, ...future]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-sm shadow-lg min-w-[180px]">
        <p className="text-body-sm font-medium text-on-surface mb-2">{label}</p>
        {payload.map((entry: any, i: number) => {
          if (entry.value === null) return null
          return (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-label-md text-on-surface-variant">{entry.name}</span>
              </div>
              <span className="text-body-sm font-medium text-on-surface">
                ${entry.value.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

export default function SpendTrendChart({
  currentMonthlySpend,
  optimizedMonthlySpend,
  teamSize,
}: SpendTrendProps) {
  const data = generateTrendData(currentMonthlySpend, optimizedMonthlySpend)

  const projectedAnnual = data
    .filter((d) => d.projected !== null)
    .reduce((sum, d) => sum + (d.projected || 0), 0)

  const optimizedAnnual = data
    .filter((d) => d.optimized !== null)
    .reduce((sum, d) => sum + (d.optimized || 0), 0)

  const potentialSavings = projectedAnnual - optimizedAnnual
  const savingsPercent = Math.round((potentialSavings / projectedAnnual) * 100)

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-stack-md border-b border-outline-variant bg-surface-bright">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shrink-0">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
            <div>
              <h3 className="text-h3 text-on-surface">Spend Trend</h3>
              <p className="text-body-sm text-on-surface-variant">
                Historical spend + 6-month projection
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-outline-variant rounded-full" />
              <span className="text-label-md text-on-surface-variant">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-error rounded-full" style={{ borderTop: '2px dashed #ba1a1a' }} />
              <span className="text-label-md text-on-surface-variant">Projected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-primary rounded-full" />
              <span className="text-label-md text-on-surface-variant">Optimized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-stack-md">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#006c49" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#bbcabf"
              strokeOpacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#3c4a42' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#3c4a42' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Current month reference line */}
            <ReferenceLine
              x={data[6]?.month}
              stroke="#bbcabf"
              strokeDasharray="4 4"
              label={{
                value: 'Today',
                position: 'top',
                fontSize: 10,
                fill: '#6c7a71',
              }}
            />

            {/* Actual spend (past) */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#6c7a71"
              strokeWidth={2}
              dot={{ fill: '#6c7a71', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#6c7a71' }}
              connectNulls={false}
            />

            {/* Projected spend (future) */}
            <Line
              type="monotone"
              dataKey="projected"
              name="Projected"
              stroke="#ba1a1a"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#ba1a1a', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#ba1a1a' }}
              connectNulls={false}
            />

            {/* Optimized spend (future) */}
            <Line
              type="monotone"
              dataKey="optimized"
              name="Optimized"
              stroke="#006c49"
              strokeWidth={2.5}
              dot={{ fill: '#006c49', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#006c49' }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 divide-x divide-outline-variant border-t border-outline-variant">
        <div className="p-stack-sm text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-1">
            Current/mo
          </p>
          <p className="text-numeric-data text-on-surface font-bold">
            ${currentMonthlySpend.toLocaleString()}
          </p>
        </div>
        <div className="p-stack-sm text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-1">
            Projected 6mo
          </p>
          <p className="text-numeric-data text-error font-bold">
            ${projectedAnnual.toLocaleString()}
          </p>
        </div>
        <div className="p-stack-sm text-center">
          <p className="text-label-md text-on-surface-variant uppercase mb-1">
            Optimized 6mo
          </p>
          <p className="text-numeric-data text-primary font-bold">
            ${optimizedAnnual.toLocaleString()}
            <span className="text-label-md font-normal ml-1">
              ({savingsPercent}% less)
            </span>
          </p>
        </div>
      </div>

      {/* Insight banner */}
      <div className="p-stack-sm border-t border-outline-variant bg-surface-container-low flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
          lightbulb
        </span>
        <p className="text-body-sm text-on-surface-variant">
          If you implement our recommendations today, your team of {teamSize} could save{' '}
          <span className="font-medium text-primary">
            ${potentialSavings.toLocaleString()}
          </span>{' '}
          over the next 6 months compared to your current trajectory.
        </p>
      </div>
    </div>
  )
}