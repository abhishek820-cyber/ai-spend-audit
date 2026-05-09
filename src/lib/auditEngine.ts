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
    Free: { price: 0, seats: 1, type: 'free' },
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
  Windsurf: {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 15, seats: 1, type: 'monthly' },
    Teams: { price: 35, seats: null, type: 'per_seat' },
  },
  Midjourney: {
    Basic: { price: 10, seats: 1, type: 'monthly' },
    Standard: { price: 30, seats: 1, type: 'monthly' },
    Pro: { price: 60, seats: 1, type: 'monthly' },
    Mega: { price: 120, seats: 1, type: 'monthly' },
  },
  Perplexity: {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 20, seats: 1, type: 'monthly' },
  },
  'Notion AI': {
    Free: { price: 0, seats: 1, type: 'free' },
    Plus: { price: 10, seats: 1, type: 'monthly' },
    Business: { price: 15, seats: null, type: 'per_seat' },
  },
  Grammarly: {
    Free: { price: 0, seats: 1, type: 'free' },
    Premium: { price: 12, seats: 1, type: 'monthly' },
    Business: { price: 15, seats: null, type: 'per_seat' },
  },
  Tabnine: {
    Starter: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 12, seats: 1, type: 'monthly' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  Codeium: {
    Free: { price: 0, seats: 1, type: 'free' },
    Teams: { price: 12, seats: null, type: 'per_seat' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  Replit: {
    Free: { price: 0, seats: 1, type: 'free' },
    Core: { price: 15, seats: 1, type: 'monthly' },
    Teams: { price: 20, seats: null, type: 'per_seat' },
  },
  'Amazon CodeWhisperer': {
    Individual: { price: 0, seats: 1, type: 'free' },
    Professional: { price: 19, seats: null, type: 'per_seat' },
  },
  'Sourcegraph Cody': {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 9, seats: 1, type: 'monthly' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  Grok: {
    Free: { price: 0, seats: 1, type: 'free' },
    Premium: { price: 16, seats: 1, type: 'monthly' },
    'Premium+': { price: 50, seats: 1, type: 'monthly' },
  },
  Mistral: {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 14, seats: 1, type: 'monthly' },
    API: { price: 0, seats: null, type: 'pay_as_you_go' },
  },
  Cohere: {
    Trial: { price: 0, seats: 1, type: 'free' },
    Production: { price: 0, seats: null, type: 'pay_as_you_go' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  'DALL-E': {
    API: { price: 0, seats: null, type: 'pay_as_you_go' },
  },
  'Stable Diffusion': {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 10, seats: 1, type: 'monthly' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  'Adobe Firefly': {
    Free: { price: 0, seats: 1, type: 'free' },
    Premium: { price: 10, seats: 1, type: 'monthly' },
    Business: { price: 0, seats: null, type: 'custom' },
  },
  Runway: {
    Free: { price: 0, seats: 1, type: 'free' },
    Standard: { price: 12, seats: 1, type: 'monthly' },
    Pro: { price: 28, seats: 1, type: 'monthly' },
    Unlimited: { price: 76, seats: 1, type: 'monthly' },
  },
  Jasper: {
    Creator: { price: 39, seats: 1, type: 'monthly' },
    Pro: { price: 59, seats: 1, type: 'monthly' },
    Business: { price: 0, seats: null, type: 'custom' },
  },
  'Copy.ai': {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 36, seats: 1, type: 'monthly' },
    Team: { price: 186, seats: null, type: 'monthly' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  Writesonic: {
    Free: { price: 0, seats: 1, type: 'free' },
    Individual: { price: 16, seats: 1, type: 'monthly' },
    Teams: { price: 30, seats: null, type: 'per_seat' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  Pinecone: {
    Free: { price: 0, seats: 1, type: 'free' },
    Standard: { price: 0, seats: null, type: 'pay_as_you_go' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  Weaviate: {
    Sandbox: { price: 0, seats: 1, type: 'free' },
    Standard: { price: 0, seats: null, type: 'pay_as_you_go' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  Langchain: {
    Free: { price: 0, seats: 1, type: 'free' },
    Plus: { price: 39, seats: 1, type: 'monthly' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  'OpenAI API': {
    'Pay-as-you-go': { price: 0, seats: null, type: 'pay_as_you_go' },
    Committed: { price: 0, seats: null, type: 'pay_as_you_go' },
  },
  'Anthropic API': {
    'Pay-as-you-go': { price: 0, seats: null, type: 'pay_as_you_go' },
    Committed: { price: 0, seats: null, type: 'pay_as_you_go' },
  },
  'Google AI API': {
    Free: { price: 0, seats: 1, type: 'free' },
    'Pay-as-you-go': { price: 0, seats: null, type: 'pay_as_you_go' },
  },
  'Azure OpenAI': {
    'Pay-as-you-go': { price: 0, seats: null, type: 'pay_as_you_go' },
    Committed: { price: 0, seats: null, type: 'pay_as_you_go' },
  },
  'AWS Bedrock': {
    'Pay-as-you-go': { price: 0, seats: null, type: 'pay_as_you_go' },
  },
  'Hugging Face': {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 9, seats: 1, type: 'monthly' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  v0: {
    Free: { price: 0, seats: 1, type: 'free' },
    Premium: { price: 20, seats: 1, type: 'monthly' },
    Enterprise: { price: 0, seats: null, type: 'custom' },
  },
  'Bolt.new': {
    Free: { price: 0, seats: 1, type: 'free' },
    Pro: { price: 20, seats: 1, type: 'monthly' },
  },
  ElevenLabs: {
    Free: { price: 0, seats: 1, type: 'free' },
    Starter: { price: 5, seats: 1, type: 'monthly' },
    Creator: { price: 22, seats: 1, type: 'monthly' },
    Pro: { price: 99, seats: 1, type: 'monthly' },
  },
}

function analyzeToolSpend(tool: ToolInput): AuditResult {
  const toolPricing = PRICING[tool.name]
  if (!toolPricing) {
    return {
      toolName: tool.name,
      currentSpend: tool.monthlySpend,
      recommendation: 'Monitor usage',
      monthlySavings: 0,
      annualSavings: 0,
      reasoning: `We don't have pricing data for ${tool.name} yet. Track your usage and compare against vendor pricing pages to identify savings opportunities.`,
    }
  }

  const planInfo = toolPricing[tool.plan]
  if (!planInfo) {
    return {
      toolName: tool.name,
      currentSpend: tool.monthlySpend,
      recommendation: 'Verify plan',
      monthlySavings: 0,
      annualSavings: 0,
      reasoning: `Plan "${tool.plan}" not found in our database. Please verify your plan details on the vendor's pricing page.`,
    }
  }

  let expectedMonthlyCost = 0
  let recommendation = ''
  let reasoning = ''

  if (planInfo.type === 'free') {
    expectedMonthlyCost = 0
    if (tool.monthlySpend > 0) {
      recommendation = 'Switch to Free plan'
      reasoning = `You're paying $${tool.monthlySpend}/month for ${tool.name}, but the ${tool.plan} plan is free. Switch immediately to eliminate this cost.`
    } else {
      recommendation = 'Optimal'
      reasoning = `You're on the free plan — no charges expected.`
    }
  } else if (planInfo.type === 'monthly') {
    expectedMonthlyCost = planInfo.price * tool.seats
    if (tool.monthlySpend > expectedMonthlyCost * 1.1) {
      recommendation = 'Downgrade or negotiate'
      reasoning = `Expected cost: $${expectedMonthlyCost.toFixed(2)}/month ($${planInfo.price} × ${tool.seats} seats). You're paying $${tool.monthlySpend}/month — investigate overages or request a discount.`
    } else if (tool.monthlySpend < expectedMonthlyCost * 0.9) {
      recommendation = 'Optimal'
      reasoning = `You're paying less than expected — good negotiation or discount applied. Expected: $${expectedMonthlyCost.toFixed(2)}/month.`
    } else {
      recommendation = 'Optimal'
      reasoning = `Cost aligns with plan pricing: $${expectedMonthlyCost.toFixed(2)}/month for ${tool.seats} seat(s).`
    }
  } else if (planInfo.type === 'per_seat') {
    expectedMonthlyCost = planInfo.price * tool.seats
    if (tool.monthlySpend > expectedMonthlyCost * 1.1) {
      recommendation = 'Review seat count'
      reasoning = `At $${planInfo.price}/seat/month with ${tool.seats} seats, expected cost is $${expectedMonthlyCost.toFixed(2)}/month. You're paying $${tool.monthlySpend}/month — verify all seats are active and remove unused licenses.`
    } else {
      recommendation = 'Optimal'
      reasoning = `Team plan pricing looks right: $${expectedMonthlyCost.toFixed(2)}/month for ${tool.seats} active seats.`
    }
  } else if (planInfo.type === 'pay_as_you_go') {
    recommendation = 'Monitor usage'
    reasoning = `${tool.name} is usage-based. Your current spend ($${tool.monthlySpend}/month) should be tracked against actual consumption. Set budget alerts to avoid surprises.`
  } else if (planInfo.type === 'custom') {
    recommendation = 'Benchmark pricing'
    reasoning = `Enterprise pricing is negotiated. Your spend of $${tool.monthlySpend}/month should be benchmarked against similar companies. Consider renegotiating if contract is up for renewal.`
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
  return { results, totalMonthlySavings, totalAnnualSavings }
}

export type { ToolInput, AuditResult }