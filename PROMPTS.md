# LLM Prompts Used

## AI Advisor Summary Prompt

**Model:** OpenRouter free tier (fallback to template)

**Current Status:** Using template-based summaries due to API integration challenges. Real AI implementation planned for Round 2.

### Template Summary Logic

Instead of calling an LLM, we generate personalized summaries using this template:
Your team of {teamSize} is using {toolCount} AI tools for {useCase}.
Based on this audit, you could save ${monthlySavings.toFixed(2)} per month
({savingsPercent}% reduction) by optimizing plan selections and eliminating
tool redundancy. Start with your highest-spend tool and consider switching
to a lower tier or alternative.
**Why this approach:**
- Ensures consistent, defensible recommendations
- No hallucinations or false claims
- Still personalized based on user's actual data
- Fast and reliable

### What We Tried

1. **Anthropic API** — Free credits not available without payment method
2. **OpenRouter free models** — Integration issues with environment variables in Next.js client context
3. **Template approach (current)** — Reliable, personalized, no external dependencies

### Next Steps (Round 2)

- Set up proper backend route for API calls
- Integrate real LLM via secure server-side endpoint
- Test with various company profiles
- A/B test template vs. real summaries

## Audit Engine Logic

The audit engine uses hardcoded rules, not AI. This is intentional:

- **Why not AI:** Would be slow, expensive, and less defensible for financial decisions
- **Why hardcoded rules:** Finance teams need to understand and trust the logic
- **Rules used:**
  - Free plans: Recommend switch if user is paying
  - Monthly plans: Check if cost matches price × seats
  - Per-seat plans: Verify seat count aligns with spend
  - API plans: Remind to monitor usage
  - Enterprise: Suggest benchmarking against similar companies