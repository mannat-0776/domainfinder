# Contributing to Domain Finder

Thank you for your interest in contributing. This document explains how to get started, the standards we hold, and how to submit changes.

---

## Getting started

```bash
git clone https://gitlab.com/adityasgroup2/domain-finder.git
cd domain-finder
npm install
cp .env.example .env.local
npm run dev
```

No API keys required. Everything runs on mock providers by default.

---

## Before you write code

1. Check existing issues and merge requests to avoid duplication
2. For significant changes, open an issue first to discuss the approach
3. Read `ARCHITECTURE.md` — understand the decisions before changing them

---

## Standards

### Code
- TypeScript strict mode. No `any` without a comment explaining why
- No god components. Each component owns one concern
- No hardcoded config. Weights, limits, and provider selection live in config files
- New providers must implement the existing interface — no changes to call sites
- Pure functions for all scoring logic — no side effects, fully testable

### Tests
- Every new service function needs a unit test
- Every new API route needs an integration test
- Run `npm test` before pushing. CI will reject failing tests

### Accessibility
- All interactive elements need `aria-label` or visible label
- Colour must not be the sole means of conveying information
- Test with keyboard navigation before submitting

### Commits
```
Phase N: Short description of what changed

Optional longer explanation of why.
```

---

## Workflow

```bash
# Create a branch
git checkout -b feature/my-feature

# Make changes, then:
npm run lint       # must pass
npm run typecheck  # must pass
npm test           # must pass

# Push and open a merge request
git push origin feature/my-feature
```

CI runs lint, typecheck, tests, and build on every push. All must pass before merge.

---

## Adding a new provider

### Name generator
1. Create `src/providers/names/myprovider.ts`
2. Implement `INameGenerator` from `src/types/providers.ts`
3. Register in `src/providers/names/factory.ts`
4. Add env var to `.env.example`
5. Document in `ARCHITECTURE.md`

### Domain provider
1. Create `src/providers/domains/myprovider.ts`
2. Implement `IDomainProvider` from `src/types/providers.ts`
3. Register in `src/providers/domains/factory.ts`
4. Add env vars to `.env.example`
5. Document in `ARCHITECTURE.md`

---

## Adjusting scoring weights

Edit `src/services/scoring/config.ts`. Weights must sum to 1.0 — validated at startup. No other files need changing.

---

## Questions

Open an issue with the `question` label.
