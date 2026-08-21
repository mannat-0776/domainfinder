import type { ICache } from '@/types/providers';

let _instance: ICache | null = null;

/**
 * Returns the configured cache singleton.
 * Uses Redis when REDIS_URL + REDIS_TOKEN are set, otherwise in-memory.
 * No call sites need to change.
 */
export async function getCache(): Promise<ICache> {
  if (_instance) return _instance;

  const redisUrl   = process.env.REDIS_URL;
  const redisToken = process.env.REDIS_TOKEN;

  if (redisUrl && redisToken) {
    const { RedisCache } = await import('./redis');
    _instance = new RedisCache(redisUrl, redisToken);
  } else {
    const { memoryCache } = await import('./memory');
    _instance = memoryCache;
  }

  return _instance;
}

/** Cache key builders — centralised to avoid typos */
export const CacheKeys = {
  domainCheck: (domain: string) => `domain:${domain}`,
  brandScore:  (candidateId: string) => `score:${candidateId}`,
  session:     (sessionId: string) => `session:${sessionId}`,
} as const;
