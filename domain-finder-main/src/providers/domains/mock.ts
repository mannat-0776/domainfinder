import type { IDomainProvider } from '@/types/providers';
import type { DomainAvailability, DomainSuggestion, TLD, PriceTier } from '@/types';
import { sleep } from '@/lib/utils';

// ─── Mock Domain Provider ───────────────────────────────────────────────────────────────
// Simulates realistic availability patterns and pricing.
// Replace with GoDaddy/Namecheap provider by setting DOMAIN_PROVIDER=godaddy.

// Domains that are always "taken" in mock mode (realistic)
const ALWAYS_TAKEN = new Set([
  'google', 'apple', 'amazon', 'meta', 'microsoft',
  'facebook', 'twitter', 'netflix', 'spotify', 'uber',
  'foundry', 'vantage', 'orbis',
]);

// Domains that are always "available" in mock mode
const ALWAYS_AVAILABLE = new Set([
  'launchly', 'nexio', 'lumio', 'driftly',
]);

const TLD_PRICES: Record<TLD, { standard: number; premium: number }> = {
  '.com':  { standard: 12,  premium: 2500 },
  '.io':   { standard: 39,  premium: 500  },
  '.co':   { standard: 25,  premium: 800  },
  '.ai':   { standard: 70,  premium: 1200 },
  '.app':  { standard: 14,  premium: 300  },
  '.dev':  { standard: 12,  premium: 200  },
  '.net':  { standard: 13,  premium: 400  },
  '.org':  { standard: 10,  premium: 300  },
};

function priceTier(price: number): PriceTier {
  if (price === 0)    return 'free';
  if (price < 50)    return 'standard';
  if (price < 500)   return 'premium';
  return 'ultra-premium';
}

export class MockDomainProvider implements IDomainProvider {
  readonly name = 'mock';

  async checkAvailability(domain: string): Promise<DomainAvailability> {
    // Simulate per-domain latency (100–400ms)
    await sleep(100 + Math.random() * 300);

    const [name, ...tldParts] = domain.split('.');
    const tld = ('.' + tldParts.join('.')) as TLD;
    const prices = TLD_PRICES[tld] ?? { standard: 15, premium: 500 };

    // Deterministic availability based on name hash
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const isPremium = hash % 7 === 0;
    const isTaken = ALWAYS_TAKEN.has(name.toLowerCase()) ||
      (!ALWAYS_AVAILABLE.has(name.toLowerCase()) && hash % 3 === 0);

    const status = isTaken
      ? (isPremium ? 'premium' : 'taken')
      : 'available';

    const priceUsd = status === 'available'
      ? prices.standard
      : status === 'premium'
        ? prices.premium
        : null;

    return {
      domain,
      name,
      tld,
      status,
      priceUsd,
      priceTier: priceUsd !== null ? priceTier(priceUsd) : 'standard',
      registrar: 'mock-registrar',
      checkedAt: new Date().toISOString(),
      ttlSeconds: 300,
    };
  }

  async checkMany(domains: string[]): Promise<DomainAvailability[]> {
    // Run in parallel — real providers may batch
    return Promise.all(domains.map((d) => this.checkAvailability(d)));
  }

  async getSuggestions(keyword: string, limit = 5): Promise<DomainSuggestion[]> {
    await sleep(200);
    const tlds: TLD[] = ['.com', '.io', '.co', '.ai', '.app'];
    return tlds.slice(0, limit).map((tld) => ({
      domain: `${keyword}${tld}`,
      tld,
      status: 'available' as const,
      priceUsd: TLD_PRICES[tld]?.standard ?? 15,
    }));
  }
}
