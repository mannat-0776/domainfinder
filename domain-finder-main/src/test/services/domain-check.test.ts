import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkDomainCached, checkDomainsCached } from '@/services/domain/domain-check.service';

// Mock the factory modules so tests never hit real APIs
vi.mock('@/providers/domains/factory', () => ({
  getDomainProvider: vi.fn().mockResolvedValue({
    name: 'mock',
    checkAvailability: vi.fn().mockImplementation(async (domain: string) => ({
      domain,
      name: domain.split('.')[0],
      tld: '.' + domain.split('.').slice(1).join('.'),
      status: 'available',
      priceUsd: 12,
      priceTier: 'standard',
      registrar: 'mock',
      checkedAt: new Date().toISOString(),
      ttlSeconds: 300,
    })),
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
  }),
}));

vi.mock('@/providers/cache/factory', () => {
  const store = new Map<string, unknown>();
  return {
    getCache: vi.fn().mockResolvedValue({
      get: vi.fn().mockImplementation(async (key: string) => store.get(key) ?? null),
      set: vi.fn().mockImplementation(async (key: string, value: unknown) => { store.set(key, value); }),
      del: vi.fn().mockImplementation(async (key: string) => { store.delete(key); }),
    }),
    CacheKeys: {
      domainCheck: (domain: string) => `domain:${domain}`,
      brandScore:  (id: string) => `score:${id}`,
      session:     (id: string) => `session:${id}`,
    },
  };
});

describe('checkDomainCached', () => {
  it('returns a DomainAvailability object', async () => {
    const result = await checkDomainCached('nexio.com');
    expect(result.domain).toBe('nexio.com');
    expect(result.status).toBe('available');
    expect(result.priceUsd).toBeGreaterThan(0);
  });

  it('returns name and tld correctly parsed', async () => {
    const result = await checkDomainCached('lumio.io');
    expect(result.name).toBe('lumio');
    expect(result.tld).toBe('.io');
  });
});

describe('checkDomainsCached', () => {
  it('returns results for all name x tld combinations', async () => {
    const results = await checkDomainsCached(['nexio', 'lumio'], ['.com', '.io']);
    expect(results.length).toBe(4);
  });

  it('all results have required fields', async () => {
    const results = await checkDomainsCached(['acme'], ['.com']);
    for (const r of results) {
      expect(r.domain).toBeTruthy();
      expect(r.status).toBeTruthy();
      expect(r.checkedAt).toBeTruthy();
      expect(r.ttlSeconds).toBeGreaterThan(0);
    }
  });
});
