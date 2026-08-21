import type { DomainAvailability, DomainSuggestion, NameCandidate, NameStyle } from './index';

// ─── Domain Provider Interface ────────────────────────────────────────────────
// Implement this interface to add any registrar. Zero other changes required.

export interface IDomainProvider {
  readonly name: string;

  /** Check a single fully-qualified domain (e.g. "acme.com") */
  checkAvailability(domain: string): Promise<DomainAvailability>;

  /** Bulk check — implementations may batch internally */
  checkMany(domains: string[]): Promise<DomainAvailability[]>;

  /** Keyword-based suggestions from the registrar */
  getSuggestions(keyword: string, limit?: number): Promise<DomainSuggestion[]>;
}

// ─── Name Generator Interface ─────────────────────────────────────────────────
// Implement this interface to add any LLM. Zero other changes required.

export interface INameGenerator {
  readonly name: string;

  generate(params: {
    idea: string;
    count: number;
    style?: NameStyle;
  }): Promise<GeneratedName[]>;
}

export interface GeneratedName {
  name: string;
  rationale: string;
  style: NameStyle;
}

// ─── Cache Interface ──────────────────────────────────────────────────────────

export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
}

// ─── Notification Interface ───────────────────────────────────────────────────

export interface INotifier {
  sendDomainStatusChange(params: {
    to: string;
    domain: string;
    oldStatus: string;
    newStatus: string;
  }): Promise<void>;
}
