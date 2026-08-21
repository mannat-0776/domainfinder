import { describe, it, expect } from 'vitest';
import { computeBrandScore } from '@/services/scoring/brand-score.service';
import type { NameCandidate } from '@/types';

function makeCandidate(name: string, dotComAvailable = true): NameCandidate {
  return {
    id: 'test-id',
    sessionId: 'test-session',
    name,
    rationale: 'Test rationale',
    style: 'invented',
    domains: [
      {
        domain: `${name.toLowerCase()}.com`,
        name: name.toLowerCase(),
        tld: '.com',
        status: dotComAvailable ? 'available' : 'taken',
        priceUsd: dotComAvailable ? 12 : null,
        priceTier: 'standard',
        registrar: 'mock',
        checkedAt: new Date().toISOString(),
        ttlSeconds: 300,
      },
    ],
    score: null,
    createdAt: new Date().toISOString(),
  };
}

describe('computeBrandScore', () => {
  it('returns a score with overall in 0–100', () => {
    const score = computeBrandScore(makeCandidate('Nexio'), 'startup tool');
    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(100);
  });

  it('includes all 7 dimensions', () => {
    const score = computeBrandScore(makeCandidate('Lumio'), 'design tool');
    expect(Object.keys(score.dimensions)).toHaveLength(7);
  });

  it('scores .com-available name higher than taken', () => {
    const available = computeBrandScore(makeCandidate('Launchly', true),  'launch tool');
    const taken     = computeBrandScore(makeCandidate('Launchly', false), 'launch tool');
    expect(available.overall).toBeGreaterThan(taken.overall);
  });

  it('overall equals weighted sum of dimensions', () => {
    const score = computeBrandScore(makeCandidate('Orbis'), 'global platform');
    const computed = Object.values(score.dimensions).reduce(
      (sum, d) => sum + d.value * d.weight,
      0
    );
    expect(Math.abs(score.overall - computed)).toBeLessThan(0.5);
  });

  it('sets candidateId correctly', () => {
    const candidate = makeCandidate('Vantage');
    const score = computeBrandScore(candidate, 'analytics');
    expect(score.candidateId).toBe(candidate.id);
  });

  it('sets computedAt as valid ISO string', () => {
    const score = computeBrandScore(makeCandidate('Driftly'), 'logistics');
    expect(() => new Date(score.computedAt)).not.toThrow();
  });
});
