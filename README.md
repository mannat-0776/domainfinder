# Domain Finder

> **"Google for finding and evaluating a startup name."**

Describe your idea. Get AI-generated names, instant domain availability across `.com/.io/.co/.ai`, brand quality scores, and an honest recommendation — in seconds.

[![CI](https://gitlab.com/adityasgroup2/domain-finder/badges/main/pipeline.svg)](https://gitlab.com/adityasgroup2/domain-finder/-/pipelines)

---

## What it answers

Not just: *"Is this domain available?"*

But: **"What is the best name and digital identity I can realistically own, and why?"**

---

## Features

| Feature | Status |
|---|---|
| AI name generation (mock / OpenAI / Anthropic) | Done |
| Domain availability — SSE streaming | Done |
| Brand quality scoring (7 dimensions) | Done |
| Recommendation engine with honest trade-offs | Done |
| Side-by-side comparison | Done |
| Save favourites (localStorage → DB) | Done |
| Domain monitoring | Done |
| Shareable result pages | Done |
| Blog / topical authority | Done |
| SEO — sitemap, OG images, structured data | Done |
| Rate limiting middleware | Done |
| PostgreSQL schema + RLS | Done |
| Real OpenAI / GoDaddy providers | Ready (set env vars) |

---

## Quick start

```bash
# 1. Clone
git clone https://gitlab.com/adityasgroup2/domain-finder.git
cd domain-finder

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — defaults work out of the box (mock providers)

# 4. Run
npm run dev
# Open http://localhost:3000
```

No API keys required to run locally. Everything defaults to mock providers.

---

## Environment variables

See `.env.example` for the full list. Key variables:

| Variable | Default | Description |
|---|---|---|
| `NAME_GENERATOR_PROVIDER` | `mock` | `mock` \| `openai` \| `anthropic` |
| `DOMAIN_PROVIDER` | `mock` | `mock` \| `godaddy` \| `namecheap` |
| `OPENAI_API_KEY` | — | Required when provider is `openai` |
| `ANTHROPIC_API_KEY` | — | Required when provider is `anthropic` |
| `GODADDY_API_KEY` | — | Required when provider is `godaddy` |
| `GODADDY_API_SECRET` | — | Required when provider is `godaddy` |
| `DATABASE_URL` | — | PostgreSQL connection string (Phase 6+) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Public URL for OG images, sitemap |

---

## Switching providers

### Use real AI (OpenAI)
```bash
NAME_GENERATOR_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### Use real domains (GoDaddy)
```bash
DOMAIN_PROVIDER=godaddy
GODADDY_API_KEY=...
GODADDY_API_SECRET=...
```

No code changes. The factory pattern handles the rest.

---

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run typecheck  # TypeScript (no emit)
npm test           # Vitest unit tests
npm run test:ui    # Vitest UI
```

---

## Project structure

```
src/
├── app/
│   ├── (marketing)/     # SSR pages: landing, blog
│   ├── (app)/           # Client pages: search, compare, favorites, monitor
│   └── api/v1/          # API route handlers
├── components/
│   ├── ui/              # Primitives: Button, Badge, Input, ScoreRing
│   ├── search/          # IdeaInput, NameCard, DomainRow, ScoreBreakdown
│   ├── monitor/         # MonitorCard, AddMonitorForm
│   ├── layout/          # Header, Footer
│   └── seo/             # Structured data schemas
├── providers/
│   ├── names/           # INameGenerator: mock, openai, anthropic
│   ├── domains/         # IDomainProvider: mock, godaddy, namecheap
│   └── cache/           # ICache: memory (redis coming)
├── services/
│   ├── scoring/         # Brand score engine (pure functions)
│   └── recommendation/  # Recommendation engine
├── lib/               # utils, errors, env, session-store, favorites-store
├── hooks/             # useFavorites
├── types/             # index.ts, providers.ts
└── test/              # Vitest setup + all test files
db/
└── migrations/        # PostgreSQL schema (001, 002)
```

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for all 11 architectural decision records.

Key principles:
- **No god components** — each component owns one concern
- **No god services** — scoring, recommendation, and domain checking are separate
- **No hardcoded logic** — weights, limits, and provider selection are all config
- **No tight provider coupling** — interfaces everywhere, factories resolve at runtime
- **Mock-first** — runs fully offline, CI needs no API keys

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy production
vercel --prod
```

Set all required env vars in the Vercel dashboard. The CI pipeline has commented-out deploy jobs — uncomment and set `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` as masked CI/CD variables to enable automatic deployment.

---

## Database setup (Phase 6+)

```bash
# Run migrations against your Supabase project
psql $DATABASE_URL -f db/migrations/001_initial_schema.sql
psql $DATABASE_URL -f db/migrations/002_domain_check_cache_index.sql
psql $DATABASE_URL -f db/migrations/003_auth_profile_trigger.sql
```

---

## Scoring model

| Dimension | Weight | Signal |
|---|---|---|
| Memorability | 20% | Syllable count, phoneme pattern |
| Pronounceability | 20% | Consonant clusters, vowel ratio |
| Spelling ease | 15% | Ambiguous digraphs, double letters |
| Length | 10% | Optimal 4–8 characters |
| .com availability | 20% | Status + price tier |
| Trademark risk | 10% | Known marks + generic terms |
| SEO potential | 5% | Keyword match, URL length |

Weights are config (`src/services/scoring/config.ts`), not hardcoded. They must sum to 1.0 — validated at startup.

---

## License

MIT
