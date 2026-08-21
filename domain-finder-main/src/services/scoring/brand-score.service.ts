import type { NameCandidate, BrandScore } from '@/types';
import { SCORE_WEIGHTS } from './config';
import {
  scoreMemorability,
  scorePronounceability,
  scoreSpellingEase,
  scoreLength,
  scoreDotComAvailability,
  scoreTrademarkRisk,
  scoreSeoPotential,
} from './dimensions';
import { round } from '@/lib/utils';

// ─── Brand Score Service ──────────────────────────────────────────────────────────────────
// Pure function — no side effects, fully testable.
// Accepts a candidate with its domain results and returns a complete BrandScore.

export function computeBrandScore(
  candidate: NameCandidate,
  idea: string
): BrandScore {
  const w = SCORE_WEIGHTS;

  const dimensions = {
    memorability:       scoreMemorability(candidate, w.memorability),
    pronounceability:   scorePronounceability(candidate, w.pronounceability),
    spellingEase:       scoreSpellingEase(candidate, w.spellingEase),
    length:             scoreLength(candidate, w.length),
    dotComAvailability: scoreDotComAvailability(candidate.domains, w.dotComAvailability),
    trademarkRisk:      scoreTrademarkRisk(candidate, w.trademarkRisk),
    seoPotential:       scoreSeoPotential(candidate, idea, w.seoPotential),
  };

  const overall = round(
    Object.values(dimensions).reduce(
      (sum, dim) => sum + dim.value * dim.weight,
      0
    ),
    1
  );

  return {
    candidateId: candidate.id,
    overall,
    dimensions,
    computedAt: new Date().toISOString(),
  };
}

/** Score multiple candidates in parallel */
export async function scoreAll(
  candidates: NameCandidate[],
  idea: string
): Promise<BrandScore[]> {
  return Promise.all(candidates.map((c) => computeBrandScore(c, idea)));
}
