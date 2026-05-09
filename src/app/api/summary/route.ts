export const runtime = 'nodejs'

export async function POST(request: Request) {
    console.log('API Key present:', !!process.env.OPENROUTER_API_KEY)
    console.log('API Key starts with:', process.env.OPENROUTER_API_KEY?.substring(0, 20))
  try {
    const body = await request.json()
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { toolsList, teamSize, useCase, totalSpend, monthlySavings } = body

    const prompt = `You are a helpful AI advisor for startup spend optimization. Based on this AI tool audit, write a personalized 2-3 paragraph summary with specific, actionable advice. Each paragraph should be complete and not cut off mid-sentence.

Audit Details:
- Tools used: ${toolsList}
- Team size: ${teamSize} people
- Primary use case: ${useCase}
- Monthly spending: $${totalSpend}
- Potential monthly savings: $${monthlySavings}

Paragraph 1: Acknowledge what they're doing well with their current setup.
Paragraph 2: Explain specifically where they're overspending and why.
Paragraph 3: Give 2-3 concrete next steps they can take this week.

Write in a warm, direct tone. Do not cut off mid-sentence. Complete every thought fully.`
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://ai-spend-audit.vercel.app',
      },
      body: JSON.stringify({
        model: 'baidu/cobuddy:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter error:', error)
      return new Response(JSON.stringify({ error: `OpenRouter API error: ${response.status}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

       const data = await response.json()
       console.log('OpenRouter response:', JSON.stringify(data, null, 2))
       const summary = data.choices[0]?.message?.content || ''
       console.log('Extracted summary:', summary)

    return new Response(JSON.stringify({ summary: summary.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in summary route:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate summary' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}