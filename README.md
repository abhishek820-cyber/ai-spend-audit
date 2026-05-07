# AI Spend Audit

A free tool that helps startups discover overspending on AI tools and unlock real savings.

**Live:** https://ai-spend-audit-smoky.vercel.app

## What It Does

1. User inputs their AI tool stack (Cursor, Claude, ChatGPT, GitHub Copilot, etc.)
2. Tool instantly audits their spending against retail pricing
3. Shows per-tool breakdown + total monthly/annual savings
4. Email capture for high-savings cases
5. Shareable results via unique public URL with Open Graph support

## Quick Start

### Install & Run Locally

```bash
git clone https://github.com/abhishek820-cyber/ai-spend-audit
cd ai-spend-audit
npm install

# Create .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

npm run dev
```

Open http://localhost:3000

### Deploy to Vercel

```bash
git push
# Vercel auto-deploys on push
# Add environment variables in Vercel dashboard
```

## Features

✅ **Spend Input Form** — Add tools, plans, seats, monthly spend  
✅ **Audit Engine** — Defensible logic with cited pricing data  
✅ **Results Dashboard** — Per-tool breakdown + hero savings number  
✅ **Personalized Summary** — Template-based recommendations  
✅ **Lead Capture** — Email + optional company/role/team size  
✅ **Shareable URLs** — Public audit view with Open Graph previews  
✅ **Responsive Design** — Mobile-first with Tailwind CSS  

## Tech Stack

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + shadcn/ui
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel

## Project Structure
ai-spend-audit/
├── src/
│   ├── app/                  # Next.js pages & layout
│   │   ├── page.tsx         # Home (form + results)
│   │   └── audit/[id]/      # Shareable audit view
│   ├── components/          # React components
│   │   ├── SpendForm.tsx
│   │   ├── AuditResults.tsx
│   │   └── LeadCapture.tsx
│   ├── lib/
│   │   ├── auditEngine.ts   # Core audit logic
│   │   ├── generateSummary.ts
│   │   ├── supabase.ts
│   │   └── tests/       # Unit tests
│   └── styles/
├── public/                   # Static assets
├── ARCHITECTURE.md           # System design
├── PRICING_DATA.md          # Data sources
├── PROMPTS.md               # LLM reasoning
├── DEVLOG.md                # Daily progress
├── REFLECTION.md            # Self-assessment
└── README.md                # This file

## Key Decisions

**Why client-side audit engine?**
- Instant results (no server latency)
- No backend load
- User data never leaves their device until email submission

**Why template summaries instead of LLM?**
- Reliable and defensible (finance teams can read the rules)
- No API costs
- No hallucinations

**Why Supabase?**
- Free tier sufficient for MVP
- Real PostgreSQL (scales easily)
- Built-in REST API

## Testing

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode
```

Minimum 5 tests on audit engine:
- Free plan overspend detection
- Monthly plan savings calculation
- Multiple tools handling
- Optimal plan detection
- Team plan scaling

## Performance

**Lighthouse scores (deployed):**
- Performance: 92
- Accessibility: 95
- Best Practices: 93

## How to Use

1. Land on the page
2. Add your AI tools (Cursor Pro, Claude Max, etc.)
3. Enter monthly spend per tool
4. Select team size and use case
5. Click "Get My Audit"
6. See instant results with savings breakdown
7. Enter email to capture lead
8. Share your audit via unique URL

## Decisions Made This Week

1. **Template summaries over LLM** — Reliability > "wow factor"
2. **Disabled RLS for MVP** — Ship speed > perfect security
3. **Client-side audit logic** — Instant, transparent, debuggable
4. **localStorage persistence** — User privacy, offline-first
5. **No user authentication** — Faster to ship, can add later

See `REFLECTION.md` for deeper reasoning.

## What's Next (Round 2)

- Real LLM summaries via backend
- User accounts & audit history
- PDF export
- Benchmark mode (your spend vs industry)
- Integration with Credex for credit purchases
- Webhook to CRM

## Contact & Feedback

Questions? Issues? Feedback?

- GitHub: [issues](hhttps://github.com/abhishek820-cyber/ai-spend-audit/issues)
- Email: hello@credex.rocks

---

Built by Abhishek RP for Credex.