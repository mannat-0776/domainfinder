import type { IDomainProvider } from '@/types/providers';
import type { DomainAvailability, DomainSuggestion, TLD, PriceTier } from '@/types';
import { ProviderError } from '@/lib/errors';

// ─── GoDaddy Domain Provider ────────────────────────────────────────────────────────────────
// Activate by setting DOMAIN_PROVIDER=godaddy in .env
// Requires: GODADDY_API_KEY, GODADDY_API_SECRET
// Docs: https://developer.godaddy.com/doc/endpoint/domains

const BASE_URL = 'https://api.godaddy.com/v1';
const BATCH_SIZE = 10; // GoDaddy recommends max 10 per request

function priceTier(cents: number): PriceTier {
  const usd = cents / 1_000_000; // GoDaddy returns micro-units
  if (usd < 50)   return 'standard';
  if (usd < 500)  return 'premium';
  return 'ultra-premium';
}

export class GoDaddyProvider implements IDomainProvider {
  readonly name = 'godaddy';

  constructor(
    private readonly apiKey: string,
    private readonly apiSecret: string
  ) {}

  private get authHeader() {
    return `sso-key ${this.apiKey}:${this.apiSecret}`;
  }

  async checkAvailability(domain: string): Promise<DomainAvailability> {
    const res = await fetch(
      `${BASE_URL}/domains/available?domain=${encodeURIComponent(domain)}&checkType=FAST`,
      { headers: { Authorization: this.authHeader } }
    );

    if (!res.ok) {
      throw new ProviderError('godaddy', `HTTP ${res.status} for ${domain}`);
    }

    const data = await res.json();
    const [name, ...tldParts] = domain.split('.');
    const tld = ('.' + tldParts.join('.')) as TLD;
    const priceUsd = data.price ? data.price / 1_000_000 : null;

    return {
      domain,
      name,
      tld,
      status: data.available ? 'available' : 'taken',
      priceUsd,
      priceTier: priceUsd !== null ? priceTier(data.price) : 'standard',
      registrar: 'godaddy',
      checkedAt: new Date().toISOString(),
      ttlSeconds: 300,
    };
  }

  async checkMany(domains: string[]): Promise<DomainAvailability[]> {
    // Batch into groups of BATCH_SIZE
    const batches: string[][] = [];
    for (let i = 0; i < domains.length; i += BATCH_SIZE) {
      batches.push(domains.slice(i, i + BATCH_SIZE));
    }

    const results = await Promise.all(
      batches.map((batch) => this._checkBatch(batch))
    );
    return results.flat();
  }

  private async _checkBatch(domains: string[]): Promise<DomainAvailability[]> {
    const res = await fetch(`${BASE_URL}/domains/available`, {
      method: 'POST',
      headers: {
        Authorization: this.authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(domains),
    });

    if (!res.ok) {
      // Fall back to individual checks on batch failure
      return Promise.all(domains.map((d) => this.checkAvailability(d)));
    }

    const data: Array<{ domain: string; available: boolean; price?: number }> = await res.json();
    return data.map((item) => {
      const [name, ...tldParts] = item.domain.split('.');
      const tld = ('.' + tldParts.join('.')) as TLD;
      const priceUsd = item.price ? item.price / 1_000_000 : null;
      return {
        domain: item.domain,
        name,
        tld,
        status: item.available ? 'available' : 'taken',
        priceUsd,
        priceTier: priceUsd !== null ? priceTier(item.price ?? 0) : 'standard',
        registrar: 'godaddy',
        checkedAt: new Date().toISOString(),
        ttlSeconds: 300,
      } satisfies DomainAvailability;
    });
  }

  async getSuggestions(keyword: string, limit = 5): Promise<DomainSuggestion[]> {
    const res = await fetch(
      `${BASE_URL}/domains/suggest?query=${encodeURIComponent(keyword)}&limit=${limit}`,
      { headers: { Authorization: this.authHeader } }
    );

    if (!res.ok) return [];

    const data: Array<{ domain: string }> = await res.json();
    return data.map((item) => {
      const [, ...tldParts] = item.domain.split('.');
      return {
        domain: item.domain,
        tld: ('.' + tldParts.join('.')) as TLD,
        status: 'available' as const,
        priceUsd: null,
      };
    });
  }
}
