import type { NameCandidate, ScoreDimension, DomainAvailability } from '@/types';
import { OPTIMAL_LENGTH, PRICE_THRESHOLDS } from './config';
import { clamp } from '@/lib/utils';

// ─── Shared helpers ───────────────────────────────────────────────────────────────────────────

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length === 0) return 0;
  const matches = w.match(/[aeiouy]+/g);
  let count = matches ? matches.length : 1;
  if (w.endsWith('e') && count > 1) count--;
  return Math.max(1, count);
}

function consonantClusters(word: string): number {
  const w = word.toLowerCase();
  const matches = w.match(/[^aeiouy]{3,}/g);
  return matches ? matches.length : 0;
}

function vowelRatio(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length === 0) return 0;
  const vowels = (w.match(/[aeiouy]/g) ?? []).length;
  return vowels / w.length;
}

// ─── Memorability ────────────────────────────────────────────────────────────────────
export function scoreMemorability(
  candidate: Pick<NameCandidate, 'name'>,
  weight: number
): ScoreDimension {
  const name = candidate.name;
  const syllables = countSyllables(name);
  const len = name.length;

  let value = 100;
  if (syllables > 3) value -= (syllables - 3) * 15;
  if (syllables < 2) value -= 10;
  if (len > 10)      value -= (len - 10) * 5;
  if (len < 4)       value -= 10;

  const vr = vowelRatio(name);
  if (vr >= 0.3 && vr <= 0.5) value += 5;

  value = clamp(value, 0, 100);

  return {
    value,
    weight,
    label: 'Memorability',
    explanation: `${syllables} syllable${syllables !== 1 ? 's' : ''}, ${len} characters. ${
      value >= 70 ? 'Easy to remember.' : 'May be harder to recall.'
    }`,
  };
}

// ─── Pronounceability ────────────────────────────────────────────────────────────────
export function scorePronounceability(
  candidate: Pick<NameCandidate, 'name'>,
  weight: number
): ScoreDimension {
  const name = candidate.name;
  const clusters = consonantClusters(name);
  const vr = vowelRatio(name);

  let value = 100;
  value -= clusters * 20;
  if (vr < 0.2) value -= 20;
  if (vr > 0.6) value -= 10;

  value = clamp(value, 0, 100);

  return {
    value,
    weight,
    label: 'Pronounceability',
    explanation: `${
      clusters === 0
        ? 'No difficult consonant clusters.'
        : `${clusters} consonant cluster${clusters !== 1 ? 's' : ''} may trip speakers.`
    } Vowel ratio: ${Math.round(vr * 100)}%.`,
  };
}

// ─── Spelling Ease ───────────────────────────────────────────────────────────────────
export function scoreSpellingEase(
  candidate: Pick<NameCandidate, 'name'>,
  weight: number
): ScoreDimension {
  const name = candidate.name.toLowerCase();

  const ambiguous = [
    /ph/g,
    /ck/g,
    /qu/g,
    /x(?!io)/g,
    /[aeiou]{3,}/g,
  ];

  let penalties = 0;
  for (const pattern of ambiguous) {
    const matches = name.match(pattern);
    if (matches) penalties += matches.length * 10;
  }

  const doubles = name.match(/([a-z])\1/g);
  if (doubles) penalties += doubles.length * 5;

  const value = clamp(100 - penalties, 0, 100);

  return {
    value,
    weight,
    label: 'Spelling Ease',
    explanation: value >= 80
      ? 'Straightforward to spell from sound alone.'
      : 'Some letter combinations may cause spelling errors.',
  };
}

// ─── Length ───────────────────────────────────────────────────────────────────────────
export function scoreLength(
  candidate: Pick<NameCandidate, 'name'>,
  weight: number
): ScoreDimension {
  const len = candidate.name.length;
  const { min, max } = OPTIMAL_LENGTH;

  let value: number;
  if (len >= min && len <= max) {
    value = 100;
  } else if (len < min) {
    value = clamp(100 - (min - len) * 20, 0, 100);
  } else {
    value = clamp(100 - (len - max) * 10, 0, 100);
  }

  return {
    value,
    weight,
    label: 'Length',
    explanation: `${len} characters. Optimal range is ${min}–${max} characters.`,
  };
}

// ─── .com Availability ──────────────────────────────────────────────────────────────────
export function scoreDotComAvailability(
  domains: DomainAvailability[],
  weight: number
): ScoreDimension {
  const dotCom = domains.find((d) => d.tld === '.com');

  if (!dotCom) {
    return { value: 50, weight, label: '.com Availability', explanation: '.com not yet checked.' };
  }

  let value: number;
  let explanation: string;

  switch (dotCom.status) {
    case 'available':
      value = 100;
      explanation = `.com is available at $${dotCom.priceUsd}/yr — register it now.`;
      break;
    case 'premium':
      value = dotCom.priceUsd && dotCom.priceUsd < PRICE_THRESHOLDS.premium ? 60 : 30;
      explanation = `.com exists but is available as a premium domain ($${dotCom.priceUsd}).`;
      break;
    case 'taken':
      value = 10;
      explanation = '.com is taken. Consider .io or .co as alternatives.';
      break;
    default:
      value = 50;
      explanation = '.com status unknown.';
  }

  return { value, weight, label: '.com Availability', explanation };
}

// ─── Trademark Risk ──────────────────────────────────────────────────────────────────
export function scoreTrademarkRisk(
  candidate: Pick<NameCandidate, 'name'>,
  weight: number
): ScoreDimension {
  const name = candidate.name.toLowerCase();

  const highRisk = [
    'apple', 'google', 'amazon', 'meta', 'microsoft', 'oracle',
    'adobe', 'slack', 'zoom', 'stripe', 'shopify', 'square',
  ];

  const mediumRisk = [
    'cloud', 'smart', 'quick', 'fast', 'easy', 'simple',
    'pro', 'plus', 'max', 'prime', 'elite', 'ultra',
  ];

  if (highRisk.includes(name)) {
    return { value: 0, weight, label: 'Trademark Risk', explanation: 'High trademark risk — this name is likely already registered.' };
  }

  if (mediumRisk.some((r) => name.includes(r))) {
    return { value: 40, weight, label: 'Trademark Risk', explanation: 'Moderate risk — contains generic terms that may conflict with existing marks.' };
  }

  const syllables = countSyllables(name);
  const value = syllables <= 2 ? 90 : 75;

  return {
    value,
    weight,
    label: 'Trademark Risk',
    explanation: value >= 80
      ? 'Low trademark risk — invented or uncommon word.'
      : 'Moderate risk — verify with a trademark search before filing.',
  };
}

// ─── SEO Potential ────────────────────────────────────────────────────────────────────
export function scoreSeoPotential(
  candidate: Pick<NameCandidate, 'name' | 'rationale'>,
  idea: string,
  weight: number
): ScoreDimension {
  const name = candidate.name.toLowerCase();
  const ideaWords = idea.toLowerCase().split(/\s+/);

  const keywordMatch = ideaWords.some((word) =>
    word.length > 3 && name.includes(word)
  );

  let value = 60;
  if (keywordMatch) value += 30;
  else              value -= 10;
  if (name.length <= 6) value += 10;

  value = clamp(value, 0, 100);

  return {
    value,
    weight,
    label: 'SEO Potential',
    explanation: keywordMatch
      ? 'Name contains a keyword from your idea — good for early organic discovery.'
      : 'Invented name requires brand-building for SEO, but avoids keyword competition.',
  };
}
