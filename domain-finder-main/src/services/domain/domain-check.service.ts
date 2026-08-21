import type { DomainAvailability, TLD } from '@/types';
import { getDomainProvider } from '@/providers/domains/factory';
import { getCache, CacheKeys } from '@/providers/cache/factory';

// ─── Domain Check Service ──────────────────────────────────────────────────────────────────
// Wraps the domain provider with a cache layer.
// Cache TTL is driven by the provider's ttlSeconds field.
// This keeps the provider interface clean — caching is a service concern.

export const DEFAULT_TLDS: TLD[] = ['.com', '.io', '.co', '.ai'];

export async function checkDomainCached(
  domain: string
): Promise<DomainAvailability> {
  const cache = await getCache();
  const key   = CacheKeys.domainCheck(domain);

  const cached = await cache.get<DomainAvailability>(key);
  if (cached) return cached;

  const provider = await getDomainProvider();
  const result   = await provider.checkAvailability(domain);

  await cache.set(key, result, result.ttlSeconds);
  return result;
}

export async function checkDomainsCached(
  names: string[],
  tlds: TLD[] = DEFAULT_TLDS
): Promise<DomainAvailability[]> {
  const domains = names.flatMap((name) =>
    tlds.map((tld) => `${name.toLowerCase()}${tld}`)
  );

  // Check cache first, collect misses
  const cache   = await getCache();
  const results: DomainAvailability[] = [];
  const misses:  string[] = [];

  await Promise.all(
    domains.map(async (domain) => {
      const cached = await cache.get<DomainAvailability>(CacheKeys.domainCheck(domain));
      if (cached) {
        results.push(cached);
      } else {
        misses.push(domain);
      }
    })
  );

  // Fetch misses from provider
  if (misses.length > 0) {
    const provider = await getDomainProvider();
    const fresh    = await provider.checkMany(misses);

    await Promise.all(
      fresh.map(async (r) => {
        await cache.set(CacheKeys.domainCheck(r.domain), r, r.ttlSeconds);
        results.push(r);
      })
    );
  }

  return results;
}
