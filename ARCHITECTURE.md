# Architecture Overview

## System Diagram
┌─────────────────┐
│   User Browser  │
│  (React/Next)   │
└────────┬────────┘
│
├──► Form Input (localStorage)
├──► Audit Engine (client-side)
└──► Share Results (unique URL)
     │
     ▼
┌──────────────────────┐
│   Vercel (Deployed)  │
│  - Next.js App       │
│  - Static + API      │
└──────────┬───────────┘
│
├──► Supabase (Database)
│    ├── audits table
│    └── leads table
│
└──► (Future: LLM API)

## Data Flow

1. **Spend Input Form**
   - User enters tools, plans, seats, spend, team size
   - Data persists to localStorage
   - Form state survives page reloads

2. **Audit Generation**
   - Frontend calls `generateAudit()` with form data
   - Runs defensible hardcoded logic (client-side, instant)
   - Returns per-tool recommendations and total savings
   - No external API calls needed

3. **Save & Share**
   - Audit saved to Supabase with unique `public_id`
   - User gets shareable URL: `/audit/{publicId}`
   - Public page strips identifying details, shows tools + savings
   - Open Graph tags enable Twitter/LinkedIn previews

4. **Lead Capture**
   - Email form appears after audit results
   - Data stored in Supabase `leads` table
   - No login required (RLS disabled for MVP)

## Stack Choice

**Frontend:** Next.js + React + TypeScript
- Why: Full-stack framework, handles both form and API routes
- Vercel deployment is seamless
- Built-in image optimization, SSR, SSG

**Database:** Supabase (PostgreSQL)
- Why: Free tier, real-time, built-in auth (future)
- Simple REST API, no SDK needed
- Easy to add features (webhooks, functions)

**Styling:** Tailwind CSS + shadcn/ui
- Why: Fast to build, consistent, mobile-first
- Passes accessibility requirements

**Testing:** Vitest + React Testing Library
- Why: Fast, minimal setup, works with Next.js

## Scaling to 10k audits/day

**Current bottlenecks:**
- Audit engine runs client-side (instant, no bottleneck)
- Database writes could be slow with RLS policies

**Changes needed for 10k/day:**
1. Move audit generation to backend (caching, analytics)
2. Add database indexes on `public_id` and `created_at`
3. Enable RLS properly (currently disabled for MVP)
4. Add rate limiting (honeypot + IP-based)
5. Implement audit caching (Redis)
6. Add background job for email sending
7. Analytics pipeline for tracking conversion rates

**Estimated capacity with current setup:**
- Supabase free tier: ~100k rows/month comfortably
- 10k audits/day = ~300k/month → would need paid tier
- Cost: ~$25-50/month for Supabase Pro

## Key Decisions

| Decision | Trade-off | Rationale |
|----------|-----------|-----------|
| Client-side audit engine | No analytics on audits | Speed + simplicity, less backend load |
| Disable RLS for MVP | Security risk | Faster to ship, can fix in Round 2 |
| Template summaries (not LLM) | Less "wow" factor | Reliable, defensible, no API costs |
| localStorage persistence | No cloud sync | User keeps their data private |
| No authentication | Can't track user progress | Free tier, faster to ship |

## Future Improvements (Round 2+)

- Real-time LLM summaries via backend
- User accounts + audit history
- PDF export
- Benchmark mode ("your spend vs industry average")
- Referral tracking
- Webhook to CRM when lead submits email