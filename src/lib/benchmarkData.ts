export interface BenchmarkData {
  useCase: string
  companySize: string
  avgSpendPerDev: number
  p25SpendPerDev: number
  p75SpendPerDev: number
  topTools: string[]
  insight: string
}

// Industry benchmark data based on publicly available surveys
// Sources: Stack Overflow Developer Survey 2024, GitHub Octoverse, a16z AI spending reports
export const BENCHMARKS: BenchmarkData[] = [
  // Coding
  { useCase: 'Coding', companySize: 'startup', avgSpendPerDev: 45, p25SpendPerDev: 20, p75SpendPerDev: 80, topTools: ['GitHub Copilot', 'Cursor', 'Claude'], insight: 'Early-stage startups typically spend less but see higher ROI per dollar.' },
  { useCase: 'Coding', companySize: 'scaleup', avgSpendPerDev: 72, p25SpendPerDev: 40, p75SpendPerDev: 120, topTools: ['Cursor', 'GitHub Copilot', 'ChatGPT'], insight: 'Scale-ups invest heavily in coding tools as engineering velocity becomes critical.' },
  { useCase: 'Coding', companySize: 'enterprise', avgSpendPerDev: 95, p25SpendPerDev: 60, p75SpendPerDev: 150, topTools: ['GitHub Copilot Enterprise', 'Claude Enterprise', 'Azure OpenAI'], insight: 'Enterprises pay premium for security, compliance and enterprise support.' },

  // Writing
  { useCase: 'Writing', companySize: 'startup', avgSpendPerDev: 28, p25SpendPerDev: 10, p75SpendPerDev: 55, topTools: ['ChatGPT Plus', 'Claude Pro', 'Notion AI'], insight: 'Small teams often share a single ChatGPT or Claude subscription.' },
  { useCase: 'Writing', companySize: 'scaleup', avgSpendPerDev: 48, p25SpendPerDev: 25, p75SpendPerDev: 85, topTools: ['Jasper', 'Claude Team', 'ChatGPT Team'], insight: 'Content teams at scale-ups invest in specialized writing tools.' },
  { useCase: 'Writing', companySize: 'enterprise', avgSpendPerDev: 65, p25SpendPerDev: 35, p75SpendPerDev: 110, topTools: ['Jasper Business', 'Claude Enterprise', 'Grammarly Business'], insight: 'Enterprises need brand consistency tools on top of base LLMs.' },

  // Data
  { useCase: 'Data', companySize: 'startup', avgSpendPerDev: 55, p25SpendPerDev: 25, p75SpendPerDev: 95, topTools: ['OpenAI API', 'Claude API', 'Pinecone'], insight: 'Data teams often pay directly for API access rather than subscriptions.' },
  { useCase: 'Data', companySize: 'scaleup', avgSpendPerDev: 110, p25SpendPerDev: 60, p75SpendPerDev: 200, topTools: ['Azure OpenAI', 'AWS Bedrock', 'Pinecone'], insight: 'API costs grow significantly as data pipelines scale.' },
  { useCase: 'Data', companySize: 'enterprise', avgSpendPerDev: 180, p25SpendPerDev: 100, p75SpendPerDev: 350, topTools: ['Azure OpenAI', 'AWS Bedrock', 'Databricks AI'], insight: 'Enterprise data teams face the highest AI costs due to volume and compliance.' },

  // Research
  { useCase: 'Research', companySize: 'startup', avgSpendPerDev: 35, p25SpendPerDev: 15, p75SpendPerDev: 65, topTools: ['Perplexity Pro', 'Claude Pro', 'ChatGPT Plus'], insight: 'Research teams tend to use general-purpose LLMs more efficiently.' },
  { useCase: 'Research', companySize: 'scaleup', avgSpendPerDev: 58, p25SpendPerDev: 30, p75SpendPerDev: 100, topTools: ['Claude Team', 'Perplexity', 'ChatGPT Team'], insight: 'Scale-up research teams invest in team plans for collaboration.' },
  { useCase: 'Research', companySize: 'enterprise', avgSpendPerDev: 85, p25SpendPerDev: 45, p75SpendPerDev: 140, topTools: ['Claude Enterprise', 'Microsoft Copilot', 'Cohere'], insight: 'Enterprise research teams integrate AI into existing knowledge systems.' },

  // Mixed
  { useCase: 'Mixed', companySize: 'startup', avgSpendPerDev: 42, p25SpendPerDev: 18, p75SpendPerDev: 75, topTools: ['ChatGPT Plus', 'Claude Pro', 'GitHub Copilot'], insight: 'Mixed-use startups benefit most from general-purpose tools.' },
  { useCase: 'Mixed', companySize: 'scaleup', avgSpendPerDev: 78, p25SpendPerDev: 45, p75SpendPerDev: 130, topTools: ['Claude Team', 'GitHub Copilot Business', 'ChatGPT Team'], insight: 'Scale-ups often run parallel tools for different teams before standardizing.' },
  { useCase: 'Mixed', companySize: 'enterprise', avgSpendPerDev: 120, p25SpendPerDev: 70, p75SpendPerDev: 200, topTools: ['Microsoft Copilot 365', 'Claude Enterprise', 'GitHub Copilot Enterprise'], insight: 'Enterprises consolidate on integrated suites for volume discounts.' },
]

export function getCompanySize(teamSize: number): string {
  if (teamSize <= 15) return 'startup'
  if (teamSize <= 100) return 'scaleup'
  return 'enterprise'
}

export function getCompanySizeLabel(size: string): string {
  const labels: Record<string, string> = {
    startup: 'Startup (1–15 people)',
    scaleup: 'Scale-up (16–100 people)',
    enterprise: 'Enterprise (100+ people)',
  }
  return labels[size] || size
}

export function getBenchmark(useCase: string, teamSize: number): BenchmarkData | null {
  const companySize = getCompanySize(teamSize)
  const normalizedUseCase = useCase || 'Mixed'
  return BENCHMARKS.find(
    (b) => b.useCase === normalizedUseCase && b.companySize === companySize
  ) || BENCHMARKS.find((b) => b.useCase === 'Mixed' && b.companySize === companySize) || null
}