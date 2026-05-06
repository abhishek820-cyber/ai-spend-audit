import { describe, it, expect } from 'vitest'
import { generateAudit } from '../auditEngine'

describe('Audit Engine', () => {
  it('detects free plan overspend', () => {
    const tools = [
      {
        name: 'Cursor',
        plan: 'Hobby',
        seats: 1,
        monthlySpend: 50,
      },
    ]
    const audit = generateAudit(tools)
    expect(audit.results[0].recommendation).toContain('Free')
    expect(audit.totalMonthlySavings).toBe(50)
  })

  it('calculates correct savings for monthly plan', () => {
    const tools = [
      {
        name: 'Claude',
        plan: 'Pro',
        seats: 1,
        monthlySpend: 50,
      },
    ]
    const audit = generateAudit(tools)
    expect(audit.results[0].monthlySavings).toBe(30)
    expect(audit.results[0].annualSavings).toBe(360)
  })

  it('handles multiple tools', () => {
    const tools = [
      {
        name: 'Cursor',
        plan: 'Pro',
        seats: 2,
        monthlySpend: 50,
      },
      {
        name: 'Claude',
        plan: 'Max',
        seats: 1,
        monthlySpend: 200,
      },
    ]
    const audit = generateAudit(tools)
    expect(audit.results.length).toBe(2)
    expect(audit.totalMonthlySavings).toBeGreaterThanOrEqual(0)
  })

  it('marks optimal plans correctly', () => {
    const tools = [
      {
        name: 'ChatGPT',
        plan: 'Plus',
        seats: 1,
        monthlySpend: 20,
      },
    ]
    const audit = generateAudit(tools)
    expect(audit.results[0].recommendation).toContain('Optimal')
  })

  it('calculates team plan scaling', () => {
    const tools = [
      {
        name: 'Claude',
        plan: 'Team',
        seats: 5,
        monthlySpend: 150,
      },
    ]
    const audit = generateAudit(tools)
    expect(audit.results[0].monthlySavings).toBe(0)
    expect(audit.results[0].recommendation).toContain('Optimal')
  })
})