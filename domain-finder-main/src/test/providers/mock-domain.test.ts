import { describe, it, expect } from 'vitest';
import { MockDomainProvider } from '@/providers/domains/mock';

const provider = new MockDomainProvider();

describe('MockDomainProvider', () => {
  it('has name "mock"', () => {
    expect(provider.name).toBe('mock');
  });

  it('returns a valid DomainAvailability shape', async () => {
    const result = await provider.checkAvailability('launchly.com');
    expect(result.domain).toBe('launchly.com');
    expect(result.name).toBe('launchly');
    expect(result.tld).toBe('.com');
    expect(['available', 'taken', 'premium', 'unknown']).toContain(result.status);
    expect(result.checkedAt).toBeTruthy();
    expect(result.ttlSeconds).toBeGreaterThan(0);
  });

  it('marks known taken domains as taken', async () => {
    const result = await provider.checkAvailability('google.com');
    expect(result.status).toBe('taken');
    expect(result.priceUsd).toBeNull();
  });

  it('marks known available domains as available', async () => {
    const result = await provider.checkAvailability('launchly.com');
    expect(result.status).toBe('available');
    expect(result.priceUsd).toBeGreaterThan(0);
  });

  it('checkMany returns one result per domain', async () => {
    const domains = ['launchly.com', 'nexio.io', 'lumio.co'];
    const results = await provider.checkMany(domains);
    expect(results).toHaveLength(3);
    expect(results.map((r) => r.domain)).toEqual(expect.arrayContaining(domains));
  });

  it('getSuggestions returns up to limit results', async () => {
    const suggestions = await provider.getSuggestions('acme', 3);
    expect(suggestions.length).toBeLessThanOrEqual(3);
    suggestions.forEach((s) => {
      expect(s.domain).toContain('acme');
    });
  });
});
