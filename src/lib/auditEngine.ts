interface ToolInput {
  name: string
  plan: string
  seats: number
  monthlySpend: number
}

interface AuditResult {
  toolName: string
  currentSpend: number
  recommendation: string
  monthlySavings: number
  annualSavings: number
  reasoning: string
}

interface PlanInfo {
  price: number
  seats: number | null
  type: 'free' | 'monthly' | 'per_seat' | 'pay_as_you_go' | 'custom'
}

// Pricing data - MUST match official pricing pages
const PRICING: Record<string, Record<string, PlanInfo>> = {
  Cursor: {
    Hobby: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 20, seats: 1, type: 'monthly' },
    Business: { price: 40, seats: 1, type: 'monthly' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  'GitHub Copilot': {
    Individual: { price: 10, seats: 1, type: 'monthly' },
    Business: { price: 21, seats: 1, type: 'monthly' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  Claude: {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 20, seats: 1, type: 'monthly' },
    Max: { price: 200, seats: 1, type: 'monthly' },
    Team: { price: 30, seats: null, type: 'per_seat' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
    API: { price: 0, seats: null, type: 'pay_as_you_go' },
  },
  ChatGPT: {
    Plus: { price: 20, seats: 1, type: 'monthly' },
    Team: { price: 30, seats: null, type: 'per_seat' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
    API: { price: 0, seats: null, type: 'pay_as_you_go' },
  },
  Gemini: {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 10, seats: 1, type: 'monthly' },
    Ultra: { price: 20, seats: 1, type: 'monthly' },
    API: { price: 0, seats: null, type: 'pay_as_you_go' },
  },
}

function analyzeToolSpend(tool: ToolInput): AuditResult {
  const toolPricing = PRICING[tool.name]
  if (!toolPricing) {
    return {
      toolName: tool.name,
      currentSpend: tool.monthlySpend,
      recommendation: 'Unknown tool',
      monthlySavings: 0,
      annualSavings: 0,
      reasoning: 'Unable to analyze pricing for this tool.',
    }
  }

  const planInfo = toolPricing[tool.plan]
  if (!planInfo) {
    return {
      toolName: tool.name,
      currentSpend: tool.monthlySpend,
      recommendation: 'Unknown plan',
      monthlySavings: 0,
      annualSavings: 0,
      reasoning: 'Plan not found in pricing database.',
    }
  }

  // Calculate expected cost based on plan
  let expectedMonthlyCost = 0
  let recommendation = ''
  let reasoning = ''

  if (planInfo.type === 'free') {
    expectedMonthlyCost = 0
    if (tool.monthlySpend > 0) {
      recommendation = 'Switch to Free plan'
      reasoning = `You're paying $${tool.monthlySpend}/month for ${tool.name}, but this plan is free. Switch immediately.`
    } else {
      recommendation = 'Optimal'
      reasoning = `You're on the free plan — no charges.`
    }
  } else if (planInfo.type === 'monthly') {
    expectedMonthlyCost = planInfo.price * tool.seats
    if (tool.monthlySpend > expectedMonthlyCost * 1.1) {
      recommendation = `Downgrade or negotiate`
      reasoning = `Expected cost: $${expectedMonthlyCost.toFixed(2)}/month (${planInfo.price} × ${tool.seats} seats). You're paying $${tool.monthlySpend}/month. Investigate overages or request a discount.`
    } else if (tool.monthlySpend < expectedMonthlyCost * 0.9) {
      recommendation = 'Optimal'
      reasoning = `You're on the right plan with no obvious overspend. Cost: $${expectedMonthlyCost.toFixed(2)}/month.`
    } else {
      recommendation = 'Optimal'
      reasoning = `Cost aligns with plan: $${expectedMonthlyCost.toFixed(2)}/month for ${tool.seats} seats.`
    }
  } else if (planInfo.type === 'per_seat') {
    expectedMonthlyCost = planInfo.price * tool.seats!
    if (tool.monthlySpend > expectedMonthlyCost * 1.1) {
      recommendation = `Review seat count`
      reasoning = `At $${planInfo.price}/seat/month with ${tool.seats} seats, expected cost is $${expectedMonthlyCost.toFixed(2)}/month. You're paying $${tool.monthlySpend}/month — verify all seats are active.`
    } else {
      recommendation = 'Optimal'
      reasoning = `Team plan pricing is reasonable: $${expectedMonthlyCost.toFixed(2)}/month for ${tool.seats} seats.`
    }
  } else if (planInfo.type === 'pay_as_you_go') {
    recommendation = 'Monitor usage'
    reasoning = `API pricing is usage-based. Your actual cost ($${tool.monthlySpend}/month) depends on usage. Track consumption to ensure efficiency.`
  } else if (planInfo.type === 'custom') {
    recommendation = 'Contact vendor'
    reasoning = `Enterprise pricing is custom. Your current spend is $${tool.monthlySpend}/month. Benchmark against similar companies to negotiate better rates.`
  }

  const monthlySavings = Math.max(0, tool.monthlySpend - expectedMonthlyCost)
  const annualSavings = monthlySavings * 12

  return {
    toolName: tool.name,
    currentSpend: tool.monthlySpend,
    recommendation,
    monthlySavings,
    annualSavings,
    reasoning,
  }
}

export function generateAudit(tools: ToolInput[]): {
  results: AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
} {
  const results = tools.map(analyzeToolSpend)
  const totalMonthlySavings = results.reduce((sum, r) => sum + r.monthlySavings, 0)
  const totalAnnualSavings = results.reduce((sum, r) => sum + r.annualSavings, 0)

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings,
  }
}

export type { ToolInput, AuditResult }