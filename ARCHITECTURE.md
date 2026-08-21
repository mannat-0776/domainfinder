# Architecture Decision Record — Domain Finder

Every major architectural decision is documented here with context, options considered, and rationale. This file is the authoritative source of truth for why the system is built the way it is.

---

## ADR-001: Next.js 14 App Router

**Status:** Accepted  
**Date:** 2025-01-01

**Context:** Need SSR for SEO-critical pages (landing, blog, share), client interactivity for search/compare, and a single deployment unit.

**Options considered:**
- Remix — good DX, weaker ecosystem
- Next.js Pages Router — mature but no RSC
- Next.js App Router — RSC + SSR + streaming + edge runtime
- SvelteKit — smaller ecosystem, harder to hire for

**Decision:** Next.js 14 App Router. Route groups `(marketing)` and `(app)` separate SSR-heavy pages from client-heavy ones without URL impact.

**Consequences:** Requires careful `'use client'` boundary management. Server Components cannot use hooks or browser APIs.

---

## ADR-002: Provider Abstraction Pattern

**Status:** Accepted  
**Date:** 2025-01-01

**Context:** Domain registrars (GoDaddy, Namecheap) and AI providers (OpenAI, Anthropic) have incompatible APIs. Tight coupling would make switching providers a rewrite.

**Decision:** Define `IDomainProvider` and `INameGenerator` interfaces. All business logic depends on the interface, never the concrete class. A factory function reads `DOMAIN_PROVIDER` / `NAME_GENERATOR_PROVIDER` env vars and returns the correct singleton. Adding a new provider = implement interface + register in factory. Zero other changes.

**Consequences:** Slight indirection. Justified by the ability to run entirely on mocks in CI and development with no external API keys.

---

## ADR-003: Mock-First Development

**Status:** Accepted  
**Date:** 2025-01-01

**Context:** External APIs (OpenAI, GoDaddy) cost money, have rate limits, and are unavailable in CI.

**Decision:** All providers default to `mock` mode. Mocks simulate realistic latency, deterministic results (same input = same output), and realistic data shapes. Real providers are activated by env var. Mocks are never deleted — they remain as the CI/test implementation.

**Consequences:** CI runs entirely offline. Developers can build features without API keys. The mock contract enforces the interface stays honest.

---

## ADR-004: Brand Scoring as Pure Functions

**Status:** Accepted  
**Date:** 2025-01-01

**Context:** Scoring logic must be testable, explainable, and adjustable without touching UI code.

**Decision:** Each scoring dimension is a pure function `(candidate, weight) => ScoreDimension`. Weights live in `src/services/scoring/config.ts` — not hardcoded in logic. The overall score is `Σ(value × weight)`. Changing a weight propagates everywhere automatically. The config validates that weights sum to 1.0 at module load time.

**Consequences:** Scoring is 100% unit-testable without mocking. Weights can be A/B tested by swapping config. Each dimension produces a human-readable `explanation` string used directly in the UI.

---

## ADR-005: SSE for Domain Check Streaming

**Status:** Accepted  
**Date:** 2025-01-01

**Context:** Checking 6 names × 4 TLDs = 24 domain lookups. Sequential = slow. Batch-and-wait = blank screen. Need perceived instant feedback.

**Decision:** `POST /api/v1/domains/check` returns a `text/event-stream` SSE response. Each domain result is emitted as it resolves. The client renders each result immediately. The final `{type: 'done'}` event closes the stream.

**Alternatives considered:** WebSockets (overkill, stateful), polling (wasteful), parallel fetch + Promise.all (no streaming).

**Consequences:** Works on Vercel Edge Functions. No WebSocket infrastructure needed. Graceful degradation: if SSE is unsupported, fall back to the generate endpoint which already does parallel checks internally.

---

## ADR-006: Client-Side Persistence (Phase 1-5)

**Status:** Accepted, superseded by ADR-007 in Phase 6  
**Date:** 2025-01-01

**Context:** Need favorites and monitors to persist across page refreshes before auth is implemented.

**Decision:** `localStorage` for favorites and monitors (survive refresh). `sessionStorage` for search sessions (tab-scoped, used for compare/share). Both are abstracted behind store modules (`favorites-store.ts`, `monitor-store.ts`, `session-store.ts`) so the swap to DB-backed storage in Phase 6 touches only those files.

**Consequences:** Data is device-local. Acceptable for Phase 1-5. Phase 6 replaces with Supabase.

---

## ADR-007: PostgreSQL via Supabase (Phase 6+)

**Status:** Planned  
**Date:** 2025-01-01

**Context:** Need auth, cross-device persistence, server-side monitoring cron.

**Decision:** Supabase for PostgreSQL + Auth + Row-Level Security. Schema in `db/migrations/`. RLS policies ensure users can only access their own data at the database layer — not just the API layer. This is defence in depth.

**Consequences:** Requires `DATABASE_URL` and Supabase keys in production env. CI uses mock providers so no DB connection needed in CI.

---

## ADR-008: In-Memory Rate Limiting (Phase 1), Redis (Phase 6+)

**Status:** Accepted  
**Date:** 2025-01-01

**Context:** Need to protect the name generation endpoint (expensive AI call) from abuse.

**Decision:** Edge middleware implements a sliding-window rate limiter using a `Map`. Limits: 10 req/60s for `/api/v1/names/generate`, 30 for domain checks, 60 for everything else. When `REDIS_URL` is set, swap the `Map` for a Redis sliding window (Upstash recommended for Edge compatibility).

**Consequences:** In-memory store resets on cold start. Acceptable for Phase 1. Redis gives precision across instances in production.

---

## ADR-009: No God Components

**Status:** Accepted  
**Date:** 2025-01-01

**Context:** A single `SearchPage` component that handles input, fetching, scoring, display, and favorites would become unmaintainable.

**Decision:** Each component owns exactly one concern:
- `IdeaInput` — controlled textarea + style selector
- `NameCard` — display one candidate
- `DomainRow` — display one domain availability row
- `ScoreRing` — SVG radial score visualisation
- `ScoreBreakdown` — expandable dimension list
- `RecommendationBanner` — winner + reasoning
- `MonitorCard` — one monitored domain

State is lifted to page components. Hooks (`useFavorites`) encapsulate cross-cutting state.

**Consequences:** More files. Each file is small, focused, and independently testable.

---

## ADR-010: SEO Strategy

**Status:** Accepted  
**Date:** 2025-01-01

**Context:** The app must rank for "startup name generator", "domain name finder", "brand name checker" and related queries.

**Decision:**
1. Landing page (`/`) is SSR with full metadata, OG image, WebApplication + FAQPage structured data
2. Blog (`/blog/*`) builds topical authority with pillar articles
3. Share pages (`/share/[id]`) are SSR with per-session OG images (Phase 8)
4. Search page (`/search`) is `noindex` when `?q=` param present (thin content)
5. `sitemap.xml` and `robots.txt` auto-generated by Next.js
6. All images use `next/image` with `avif`/`webp` formats

**Consequences:** Blog content requires ongoing investment. Share pages require DB-backed SSR in Phase 8.

---

## ADR-011: Accessibility Standards

**Status:** Accepted  
**Date:** 2025-01-01

**Context:** WCAG 2.1 AA compliance is a baseline requirement, not an afterthought.

**Decision:**
- All interactive elements have `aria-label` or visible label
- Score rings use `role="img"` with descriptive `aria-label`
- Progress bars use `role="progressbar"` with `aria-valuenow/min/max`
- Loading states use `aria-busy="true"`
- Error messages use `role="alert"`
- Focus ring is visible and uses brand colour (`outline-brand-500`)
- Colour is never the sole means of conveying information (score labels accompany colours)
- Skip-to-content link: `<main id="main-content">` on every page

**Consequences:** Slightly more verbose JSX. Required for legal compliance and good UX.
