interface SummaryInput {
  tools: Array<{ name: string; plan: string; monthlySpend: number }>
  totalMonthlySavings: number
  totalAnnualSavings: number
  useCase: string
  teamSize: string
}

export async function generateAuditSummary(input: SummaryInput): Promise<string> {
  // For now, just use the template - API integration can be done in Round 2
  return getTemplateSummary(input)
}

function getTemplateSummary(input: SummaryInput): string {
  const toolCount = input.tools.length
  const totalSpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0) || 1
  const savingsPercent = Math.round((input.totalMonthlySavings / totalSpend) * 100)
  const teamSizeStr = input.teamSize || 'your'
  const useCaseStr = input.useCase || 'general purposes'

  return `Your team of ${teamSizeStr} is using ${toolCount} AI tools for ${useCaseStr}. Based on this audit, you could save $${input.totalMonthlySavings.toFixed(2)} per month (${savingsPercent}% reduction) by optimizing plan selections and eliminating tool redundancy. Start with your highest-spend tool and consider switching to a lower tier or alternative.`
}