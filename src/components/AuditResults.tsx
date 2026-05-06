'use client'

import { AuditResult } from '@/lib/auditEngine'

interface AuditResultsProps {
  results: AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  onShare: () => void
}

export default function AuditResults({
  results,
  totalMonthlySavings,
  totalAnnualSavings,
  onShare,
}: AuditResultsProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Hero section with savings */}
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
        <h1 className="text-4xl font-bold text-green-700 mb-2">Your AI Spend Audit</h1>
        <div className="mt-6">
          <p className="text-gray-600 text-sm mb-2">Potential Monthly Savings</p>
          <p className="text-5xl font-bold text-green-600">${totalMonthlySavings.toFixed(2)}</p>
          <p className="text-gray-600 text-sm mt-2">
            Annual savings: <span className="text-2xl font-bold text-green-600">${totalAnnualSavings.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Per-tool breakdown */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Breakdown by Tool</h2>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{result.toolName}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {result.recommendation}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-gray-600 text-sm">Current Spend</p>
                  <p className="text-xl font-bold">${result.currentSpend.toFixed(2)}/mo</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Monthly Savings</p>
                  <p className="text-xl font-bold text-green-600">${result.monthlySavings.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Annual Savings</p>
                  <p className="text-xl font-bold text-green-600">${result.annualSavings.toFixed(2)}</p>
                </div>
              </div>

              <p className="text-gray-700 text-sm">{result.reasoning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA section */}
      {totalMonthlySavings > 500 && (
        <div className="mb-8 p-6 bg-purple-50 border-l-4 border-purple-500 rounded">
          <h3 className="text-xl font-bold text-purple-900 mb-2">Ready to capture these savings?</h3>
          <p className="text-purple-800 mb-4">
            Credex helps companies like yours secure AI credits at substantial discounts. For high-savings cases like yours,
            our team can help you implement these changes and negotiate better rates.
          </p>
          <button className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold">
            Book a Credex Consultation
          </button>
        </div>
      )}

      {totalMonthlySavings < 100 && (
        <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
          <h3 className="text-lg font-bold text-blue-900 mb-2">You're spending wisely.</h3>
          <p className="text-blue-800">
            Your current AI tool spend is well-optimized. We'll notify you when new optimization opportunities apply to your stack.
          </p>
        </div>
      )}

      {/* Share and export buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onShare}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        >
          Share This Audit
        </button>
        <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-semibold">
          Download PDF (Coming Soon)
        </button>
      </div>
    </div>
  )
}