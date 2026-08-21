// ─── Scoring Configuration ───────────────────────────────────────────────────────────────
// Weights are config, not hardcoded in logic.
// Changing a weight here propagates everywhere automatically.
// All weights must sum to 1.0.

export const SCORE_WEIGHTS = {
  memorability:       0.20,
  pronounceability:   0.20,
  spellingEase:       0.15,
  length:             0.10,
  dotComAvailability: 0.20,
  trademarkRisk:      0.10,
  seoPotential:       0.05,
} as const;

// Validate at module load time
const total = Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(total - 1.0) > 0.001) {
  throw new Error(`Score weights must sum to 1.0, got ${total}`);
}

// Optimal name length range (characters)
export const OPTIMAL_LENGTH = { min: 4, max: 8 } as const;

// TLDs checked for .com availability bonus
export const PRIMARY_TLD = '.com';

// Price thresholds for .com availability scoring
export const PRICE_THRESHOLDS = {
  free:         0,
  standard:     50,
  premium:      500,
  ultraPremium: 5000,
} as const;
