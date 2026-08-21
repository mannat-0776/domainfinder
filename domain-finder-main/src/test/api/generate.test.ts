import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock env before importing route
vi.mock('@/lib/env', () => ({
  env: {
    NAME_GENERATOR_PROVIDER: 'mock',
    DOMAIN_PROVIDER: 'mock',
    NODE_ENV: 'test',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  },
}));

vi.mock('@/providers/names/factory', () => ({
  getNameGenerator: vi.fn().mockResolvedValue({
    name: 'mock',
    generate: vi.fn().mockResolvedValue([
      { name: 'Nexio',   rationale: 'Test rationale 1', style: 'invented' },
      { name: 'Lumio',   rationale: 'Test rationale 2', style: 'invented' },
      { name: 'Driftly', rationale: 'Test rationale 3', style: 'invented' },
    ]),
  }),
}));

vi.mock('@/providers/domains/factory', () => ({
  getDomainProvider: vi.fn().mockResolvedValue({
    name: 'mock',
    checkMany: vi.fn().mockImplementation(async (domains: string[]) =>
      domains.map((domain: string) => ({
        domain,
        name: domain.split('.')[0],
        tld: '.' + domain.split('.').slice(1).join('.'),
        status: 'available',
        priceUsd: 12,
        priceTier: 'standard',
        registrar: 'mock',
        checkedAt: new Date().toISOString(),
        ttlSeconds: 300,
      }))
    ),
    checkAvailability: vi.fn(),
    getSuggestions: vi.fn().mockResolvedValue([]),
  }),
}));


describe('POST /api/v1/names/generate', () => {
  it('returns a valid SearchSession shape', async () => {
    const { POST } = await import('@/app/api/v1/names/generate/route');

    const req = new Request('http://localhost/api/v1/names/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: 'a saas tool for developers', count: 3 }),
    });

    const res = await POST(req as never);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.ideaText).toBe('a saas tool for developers');
    expect(Array.isArray(data.candidates)).toBe(true);
    expect(data.candidates.length).toBeGreaterThan(0);
  });

  it('each candidate has a score', async () => {
    const { POST } = await import('@/app/api/v1/names/generate/route');

    const req = new Request('http://localhost/api/v1/names/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: 'fintech startup', count: 3 }),
    });

    const res = await POST(req as never);
    const data = await res.json();

    for (const candidate of data.candidates) {
      expect(candidate.score).not.toBeNull();
      expect(candidate.score.overall).toBeGreaterThanOrEqual(0);
      expect(candidate.score.overall).toBeLessThanOrEqual(100);
    }
  });

  it('returns 400 for idea shorter than 3 chars', async () => {
    const { POST } = await import('@/app/api/v1/names/generate/route');

    const req = new Request('http://localhost/api/v1/names/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: 'ab' }),
    });

    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('includes a recommendation', async () => {
    const { POST } = await import('@/app/api/v1/names/generate/route');

    const req = new Request('http://localhost/api/v1/names/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: 'project management tool', count: 3 }),
    });

    const res = await POST(req as never);
    const data = await res.json();
    expect(data.recommendation).not.toBeNull();
    expect(data.recommendation.candidateId).toBeTruthy();
    expect(Array.isArray(data.recommendation.reasoning)).toBe(true);
  });
});
