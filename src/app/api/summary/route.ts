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

    const prompt = `You are a helpful AI advisor for startup spend optimization. Based on this AI tool audit, write a personalized 1-paragraph (100 words max) summary with specific, actionable advice.

Audit Details:
- Tools used: ${toolsList}
- Team size: ${teamSize} people
- Primary use case: ${useCase}
- Monthly spending: $${totalSpend}
- Potential monthly savings: $${monthlySavings}

Write a warm, encouraging summary that acknowledges their current setup and highlights the savings opportunity. Be specific about what they're doing well.`

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
        max_tokens: 200,
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