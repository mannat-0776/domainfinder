import { describe, it, expect } from 'vitest';
import {
  scoreMemorability,
  scorePronounceability,
  scoreSpellingEase,
  scoreLength,
  scoreDotComAvailability,
  scoreTrademarkRisk,
  scoreSeoPotential,
} from '@/services/scoring/dimensions';
import type { DomainAvailability } from '@/types';

const W = 0.2; // arbitrary weight for tests

// ─── Memorability ───────────────────────────────────────────────────────────────────────
describe('scoreMemorability', () => {
  it('gives high score to short 2-syllable names', () => {
    const result = scoreMemorability({ name: 'Nexio' }, W);
    expect(result.value).toBeGreaterThanOrEqual(70);
  });

  it('penalises very long names', () => {
    const short = scoreMemorability({ name: 'Acme' }, W);
    const long  = scoreMemorability({ name: 'Extraordinarily' }, W);
    expect(short.value).toBeGreaterThan(long.value);
  });

  it('returns value in 0–100 range', () => {
    const result = scoreMemorability({ name: 'X' }, W);
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.value).toBeLessThanOrEqual(100);
  });

  it('includes weight and label', () => {
    const result = scoreMemorability({ name: 'Lumio' }, W);
    expect(result.weight).toBe(W);
    expect(result.label).toBe('Memorability');
    expect(result.explanation).toBeTruthy();
  });
});

// ─── Pronounceability ────────────────────────────────────────────────────────────────
describe('scorePronounceability', () => {
  it('scores vowel-balanced names higher', () => {
    const easy = scorePronounceability({ name: 'Lumio' }, W);
    const hard = scorePronounceability({ name: 'Strngths' }, W);
    expect(easy.value).toBeGreaterThan(hard.value);
  });

  it('penalises triple consonant clusters', () => {
    const result = scorePronounceability({ name: 'Strngths' }, W);
    expect(result.value).toBeLessThan(60);
  });

  it('stays in 0–100 range', () => {
    const result = scorePronounceability({ name: 'Strngths' }, W);
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.value).toBeLessThanOrEqual(100);
  });
});

// ─── Spelling Ease ────────────────────────────────────────────────────────────────────
describe('scoreSpellingEase', () => {
  it('penalises ph digraph', () => {
    const with_ph    = scoreSpellingEase({ name: 'Phonic' }, W);
    const without_ph = scoreSpellingEase({ name: 'Sonic' }, W);
    expect(without_ph.value).toBeGreaterThan(with_ph.value);
  });

  it('penalises double letters', () => {
    const doubled = scoreSpellingEase({ name: 'Llama' }, W);
    const clean   = scoreSpellingEase({ name: 'Lama' }, W);
    expect(clean.value).toBeGreaterThanOrEqual(doubled.value);
  });

  it('stays in 0–100 range', () => {
    const result = scoreSpellingEase({ name: 'Xqqzph' }, W);
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.value).toBeLessThanOrEqual(100);
  });
});

// ─── Length ───────────────────────────────────────────────────────────────────────────
describe('scoreLength', () => {
  it('gives 100 for names in optimal range (4–8 chars)', () => {
    expect(scoreLength({ name: 'Acme' }, W).value).toBe(100);  // 4
    expect(scoreLength({ name: 'Launchly' }, W).value).toBe(100); // 8
  });

  it('penalises names shorter than 4 chars', () => {
    const result = scoreLength({ name: 'Ax' }, W);
    expect(result.value).toBeLessThan(100);
  });

  it('penalises names longer than 8 chars', () => {
    const result = scoreLength({ name: 'Extraordinarily' }, W);
    expect(result.value).toBeLessThan(100);
  });

  it('longer names score lower than shorter ones', () => {
    const short = scoreLength({ name: 'Nexio' }, W);
    const long  = scoreLength({ name: 'Extraordinarily' }, W);
    expect(short.value).toBeGreaterThan(long.value);
  });
});

// ─── .com Availability ────────────────────────────────────────────────────────────────
describe('scoreDotComAvailability', () => {
  const base: DomainAvailability = {
    domain: 'acme.com', name: 'acme', tld: '.com',
    status: 'available', priceUsd: 12, priceTier: 'standard',
    registrar: 'mock', checkedAt: new Date().toISOString(), ttlSeconds: 300,
  };

  it('gives 100 when .com is available', () => {
    expect(scoreDotComAvailability([base], W).value).toBe(100);
  });

  it('gives 10 when .com is taken', () => {
    const taken = { ...base, status: 'taken' as const, priceUsd: null };
    expect(scoreDotComAvailability([taken], W).value).toBe(10);
  });

  it('gives 50 when no .com in list', () => {
    expect(scoreDotComAvailability([], W).value).toBe(50);
  });

  it('gives partial score for premium .com', () => {
    const premium = { ...base, status: 'premium' as const, priceUsd: 2500 };
    const result = scoreDotComAvailability([premium], W);
    expect(result.value).toBeGreaterThan(10);
    expect(result.value).toBeLessThan(100);
  });
});

// ─── Trademark Risk ──────────────────────────────────────────────────────────────────
describe('scoreTrademarkRisk', () => {
  it('gives 0 for known high-risk names', () => {
    expect(scoreTrademarkRisk({ name: 'Apple' }, W).value).toBe(0);
    expect(scoreTrademarkRisk({ name: 'Google' }, W).value).toBe(0);
  });

  it('gives lower score for generic terms', () => {
    const generic  = scoreTrademarkRisk({ name: 'CloudPro' }, W);
    const invented = scoreTrademarkRisk({ name: 'Nexio' }, W);
    expect(invented.value).toBeGreaterThan(generic.value);
  });

  it('stays in 0–100 range', () => {
    const result = scoreTrademarkRisk({ name: 'Lumio' }, W);
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.value).toBeLessThanOrEqual(100);
  });
});

// ─── SEO Potential ───────────────────────────────────────────────────────────────────
describe('scoreSeoPotential', () => {
  it('boosts score when name contains idea keyword', () => {
    const match   = scoreSeoPotential({ name: 'Launchpad', rationale: '' }, 'launch platform', W);
    const noMatch = scoreSeoPotential({ name: 'Nexio', rationale: '' }, 'launch platform', W);
    expect(match.value).toBeGreaterThan(noMatch.value);
  });

  it('stays in 0–100 range', () => {
    const result = scoreSeoPotential({ name: 'Nexio', rationale: '' }, 'ai assistant', W);
    expect(result.value).toBeGreaterThanOrEqual(0);
    expect(result.value).toBeLessThanOrEqual(100);
  });
});
