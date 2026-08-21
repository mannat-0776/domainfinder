// ─── Enums ────────────────────────────────────────────────────────────────────

export type NameStyle =
  | 'invented'   // Portmanteau / coined (Spotify, Xerox)
  | 'descriptive' // Clear meaning (Basecamp, Mailchimp)
  | 'metaphor'   // Evocative (Amazon, Apple)
  | 'acronym'    // Initialism (IBM, SAP)
  | 'founder'    // Eponymous (Ford, Disney)
  | 'compound';  // Two real words (Facebook, YouTube)

export type TLD = '.com' | '.io' | '.co' | '.ai' | '.app' | '.dev' | '.net' | '.org';

export type DomainStatus = 'available' | 'taken' | 'premium' | 'unknown' | 'checking';

export type PriceTier = 'free' | 'standard' | 'premium' | 'ultra-premium';

// ─── Domain ───────────────────────────────────────────────────────────────────

export interface DomainAvailability {
  domain: string;          // full domain e.g. "acme.com"
  name: string;            // SLD e.g. "acme"
  tld: TLD;
  status: DomainStatus;
  priceUsd: number | null; // null = not for sale / unknown
  priceTier: PriceTier;
  registrar: string | null;
  checkedAt: string;       // ISO 8601
  ttlSeconds: number;      // how long to trust this result
}

export interface DomainSuggestion {
  domain: string;
  tld: TLD;
  status: DomainStatus;
  priceUsd: number | null;
}

// ─── Name Candidate ───────────────────────────────────────────────────────────

export interface NameCandidate {
  id: string;
  sessionId: string;
  name: string;            // e.g. "Acme"
  rationale: string;       // why this name fits the idea
  style: NameStyle;
  domains: DomainAvailability[];
  score: BrandScore | null;
  createdAt: string;
}

// ─── Brand Score ──────────────────────────────────────────────────────────────

export interface ScoreDimension {
  value: number;           // 0–100
  weight: number;          // 0–1, all weights sum to 1
  label: string;
  explanation: string;
}

export interface BrandScore {
  candidateId: string;
  overall: number;         // 0–100, weighted sum
  dimensions: {
    memorability:      ScoreDimension;
    pronounceability:  ScoreDimension;
    spellingEase:      ScoreDimension;
    length:            ScoreDimension;
    dotComAvailability: ScoreDimension;
    trademarkRisk:     ScoreDimension;
    seoPotential:      ScoreDimension;
  };
  computedAt: string;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface SearchSession {
  id: string;
  userId: string | null;
  ideaText: string;
  candidates: NameCandidate[];
  recommendation: Recommendation | null;
  createdAt: string;
}

// ─── Recommendation ───────────────────────────────────────────────────────────

export interface Recommendation {
  candidateId: string;
  headline: string;        // "Best overall choice"
  reasoning: string[];     // bullet points
  caveats: string[];       // honest trade-offs
  alternativeId: string | null;
}

// ─── Favorite ─────────────────────────────────────────────────────────────────

export interface Favorite {
  id: string;
  userId: string;
  candidateId: string;
  candidate: NameCandidate;
  notes: string | null;
  createdAt: string;
}

// ─── Monitor ──────────────────────────────────────────────────────────────────

export interface Monitor {
  id: string;
  userId: string;
  domain: string;
  lastStatus: DomainStatus;
  checkIntervalHours: number;
  notifyOnChange: boolean;
  lastCheckedAt: string | null;
  createdAt: string;
  latestEvent: MonitorEvent | null;
}

export interface MonitorEvent {
  id: string;
  monitorId: string;
  oldStatus: DomainStatus;
  newStatus: DomainStatus;
  detectedAt: string;
}

// ─── API shapes ───────────────────────────────────────────────────────────────

export interface GenerateNamesRequest {
  idea: string;
  count?: number;          // default 6
  style?: NameStyle;
}

export interface GenerateNamesResponse {
  sessionId: string;
  candidates: NameCandidate[];
}

export interface CheckDomainsRequest {
  names: string[];
  tlds?: TLD[];
}

// SSE event shapes
export type DomainCheckEvent =
  | { type: 'result'; data: DomainAvailability }
  | { type: 'error';  data: { domain: string; message: string } }
  | { type: 'done' };

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
