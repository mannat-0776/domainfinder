import type { ICache } from '@/types/providers';

// ─── In-Memory Cache ───────────────────────────────────────────────────────────────────
// Used in development / when REDIS_URL is not set.
// Replace with Redis by setting REDIS_URL.

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null; // ms timestamp, null = no expiry
}

export class MemoryCache implements ICache {
  private store = new Map<string, CacheEntry<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}

// Singleton for the process lifetime
export const memoryCache = new MemoryCache();
