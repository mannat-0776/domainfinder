import type { IDomainProvider } from '@/types/providers';
import type { DomainAvailability, DomainSuggestion, TLD } from '@/types';
import { ProviderError } from '@/lib/errors';

// ─── Namecheap Domain Provider ───────────────────────────────────────────────────────────────
// Activate by setting DOMAIN_PROVIDER=namecheap in .env
// Requires: NAMECHEAP_API_KEY, NAMECHEAP_API_USER
// Docs: https://www.namecheap.com/support/api/methods/
// Note: Namecheap API requires IP whitelisting in production.

const BASE_URL = 'https://api.namecheap.com/xml.response';

export class NamecheapProvider implements IDomainProvider {
  readonly name = 'namecheap';

  constructor(
    private readonly apiKey: string,
    private readonly apiUser: string
  ) {}

  private buildUrl(command: string, extra: Record<string, string> = {}): string {
    const params = new URLSearchParams({
      ApiUser:  this.apiUser,
      ApiKey:   this.apiKey,
      UserName: this.apiUser,
      Command:  command,
      ClientIp: '127.0.0.1', // Replace with real IP in production
      ...extra,
    });
    return `${BASE_URL}?${params.toString()}`;
  }

  async checkAvailability(domain: string): Promise<DomainAvailability> {
    const [sld, ...tldParts] = domain.split('.');
    const tld = tldParts.join('.');

    const url = this.buildUrl('namecheap.domains.check', {
      DomainList: domain,
    });

    const res = await fetch(url);
    if (!res.ok) throw new ProviderError('namecheap', `HTTP ${res.status}`);

    const text = await res.text();
    // Parse XML response (simplified — use a proper XML parser in production)
    const available = text.includes(`Available="true"`);
    const tldKey = ('.' + tld) as TLD;

    return {
      domain,
      name: sld,
      tld: tldKey,
      status: available ? 'available' : 'taken',
      priceUsd: available ? 12 : null, // Namecheap pricing requires separate API call
      priceTier: 'standard',
      registrar: 'namecheap',
      checkedAt: new Date().toISOString(),
      ttlSeconds: 300,
    };
  }

  async checkMany(domains: string[]): Promise<DomainAvailability[]> {
    // Namecheap supports comma-separated domain list
    const url = this.buildUrl('namecheap.domains.check', {
      DomainList: domains.join(','),
    });

    const res = await fetch(url);
    if (!res.ok) {
      return Promise.all(domains.map((d) => this.checkAvailability(d)));
    }

    const text = await res.text();
    // Parse each domain result from XML
    return domains.map((domain) => {
      const [sld, ...tldParts] = domain.split('.');
      const tld = ('.' + tldParts.join('.')) as TLD;
      const domainPattern = new RegExp(`Domain="${domain}"[^>]*Available="(true|false)"`);
      const match = text.match(domainPattern);
      const available = match?.[1] === 'true';

      return {
        domain,
        name: sld,
        tld,
        status: available ? 'available' : 'taken',
        priceUsd: available ? 12 : null,
        priceTier: 'standard',
        registrar: 'namecheap',
        checkedAt: new Date().toISOString(),
        ttlSeconds: 300,
      } satisfies DomainAvailability;
    });
  }

  async getSuggestions(keyword: string, limit = 5): Promise<DomainSuggestion[]> {
    // Namecheap does not have a suggestions API — return TLD variants
    const tlds: TLD[] = ['.com', '.io', '.co', '.ai', '.app'];
    return tlds.slice(0, limit).map((tld) => ({
      domain: `${keyword}${tld}`,
      tld,
      status: 'available' as const,
      priceUsd: null,
    }));
  }
}
