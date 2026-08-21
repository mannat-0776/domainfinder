import type { NameCandidate, Recommendation, BrandScore } from '@/types';

// ─── Recommendation Engine ────────────────────────────────────────────────────────────────
// Picks the best candidate and explains WHY in plain language.
// Honest about trade-offs — never hides weaknesses.

export function buildRecommendation(
  candidates: NameCandidate[],
  scores: BrandScore[]
): Recommendation | null {
  if (candidates.length === 0 || scores.length === 0) return null;

  // Map scores by candidateId for O(1) lookup
  const scoreMap = new Map(scores.map((s) => [s.candidateId, s]));

  // Sort by overall score descending
  const ranked = [...candidates]
    .map((c) => ({ candidate: c, score: scoreMap.get(c.id) }))
    .filter((x): x is { candidate: NameCandidate; score: BrandScore } => !!x.score)
    .sort((a, b) => b.score.overall - a.score.overall);

  if (ranked.length === 0) return null;

  const winner = ranked[0];
  const runner = ranked[1] ?? null;
  const { candidate, score } = winner;

  // Build reasoning bullets from top-scoring dimensions
  const dimEntries = Object.entries(score.dimensions)
    .sort(([, a], [, b]) => b.value * b.weight - a.value * a.weight);

  const reasoning: string[] = [];
  const caveats: string[] = [];

  for (const [, dim] of dimEntries) {
    if (dim.value >= 75) {
      reasoning.push(dim.explanation);
    } else if (dim.value < 50) {
      caveats.push(dim.explanation);
    }
  }

  // .com availability is always surfaced
  const dotCom = candidate.domains.find((d) => d.tld === '.com');
  if (dotCom?.status === 'available' && !reasoning.some((r) => r.includes('.com'))) {
    reasoning.unshift(`.com is available at $${dotCom.priceUsd}/yr.`);
  }

  const headline = score.overall >= 80
    ? 'Excellent overall choice'
    : score.overall >= 65
      ? 'Strong choice with minor trade-offs'
      : 'Best available option — review caveats';

  return {
    candidateId: candidate.id,
    headline,
    reasoning: reasoning.slice(0, 4),
    caveats: caveats.slice(0, 3),
    alternativeId: runner?.candidate.id ?? null,
  };
}
