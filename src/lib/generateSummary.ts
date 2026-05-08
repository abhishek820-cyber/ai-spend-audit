interface SummaryInput {
  tools: Array<{ name: string; plan: string; monthlySpend: number }>
  totalMonthlySavings: number
  totalAnnualSavings: number
  useCase: string
  teamSize: string
}

export async function generateAuditSummary(input: SummaryInput): Promise<string> {
  try {
    const toolsList = input.tools.map((t) => `${t.name} (${t.plan})`).join(', ')
    const totalSpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0)

    console.log('Calling /api/summary...')

    const response = await fetch('/api/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toolsList,
        teamSize: input.teamSize,
        useCase: input.useCase,
        totalSpend: totalSpend.toFixed(2),
        monthlySavings: input.totalMonthlySavings.toFixed(2),
      }),
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      console.error('Backend error:', response.status)
      return getTemplateSummary(input)
    }

    const data = await response.json()
    console.log('Got summary:', data.summary)

    return data.summary || getTemplateSummary(input)
  } catch (error) {
    console.error('Error calling /api/summary:', error)
    return getTemplateSummary(input)
  }
}

function getTemplateSummary(input: SummaryInput): string {
  const toolCount = input.tools.length
  const totalSpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0) || 1
  const savingsPercent = Math.round((input.totalMonthlySavings / totalSpend) * 100)

  return `Your team of ${input.teamSize || 'your'} is using ${toolCount} AI tools for ${input.useCase || 'general purposes'}. Based on this audit, you could save $${input.totalMonthlySavings.toFixed(2)} per month (${savingsPercent}% reduction) by optimizing plan selections and eliminating tool redundancy. Start with your highest-spend tool and consider switching to a lower tier or alternative.`
}