import { describe, it, expect } from 'vitest';
import { buildRecommendation } from '@/services/recommendation/recommendation.service';
import { computeBrandScore } from '@/services/scoring/brand-score.service';
import type { NameCandidate } from '@/types';

function makeCandidate(name: string, dotComAvailable = true): NameCandidate {
  return {
    id: `id-${name}`,
    sessionId: 'session',
    name,
    rationale: `Rationale for ${name}`,
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

describe('buildRecommendation', () => {
  it('returns null for empty candidates', () => {
    expect(buildRecommendation([], [])).toBeNull();
  });

  it('picks the highest-scoring candidate', () => {
    const candidates = [
      makeCandidate('Nexio', true),
      makeCandidate('Apple', false), // high-risk + taken .com = lower score
    ];
    const scores = candidates.map((c) => computeBrandScore(c, 'tech startup'));
    const rec = buildRecommendation(candidates, scores);
    expect(rec).not.toBeNull();
    expect(rec!.candidateId).toBe('id-Nexio');
  });

  it('includes reasoning bullets', () => {
    const candidates = [makeCandidate('Lumio', true)];
    const scores = candidates.map((c) => computeBrandScore(c, 'design tool'));
    const rec = buildRecommendation(candidates, scores);
    expect(rec!.reasoning.length).toBeGreaterThan(0);
  });

  it('sets alternativeId when there are multiple candidates', () => {
    const candidates = [
      makeCandidate('Nexio', true),
      makeCandidate('Lumio', true),
    ];
    const scores = candidates.map((c) => computeBrandScore(c, 'saas'));
    const rec = buildRecommendation(candidates, scores);
    expect(rec!.alternativeId).not.toBeNull();
    expect(rec!.alternativeId).not.toBe(rec!.candidateId);
  });

  it('sets alternativeId to null for single candidate', () => {
    const candidates = [makeCandidate('Solo', true)];
    const scores = candidates.map((c) => computeBrandScore(c, 'solo tool'));
    const rec = buildRecommendation(candidates, scores);
    expect(rec!.alternativeId).toBeNull();
  });

  it('includes a headline string', () => {
    const candidates = [makeCandidate('Vantage', true)];
    const scores = candidates.map((c) => computeBrandScore(c, 'analytics'));
    const rec = buildRecommendation(candidates, scores);
    expect(typeof rec!.headline).toBe('string');
    expect(rec!.headline.length).toBeGreaterThan(0);
  });
});
