import type { ICache } from '@/types/providers';

// ─── Redis Cache (Upstash REST API) ───────────────────────────────────────────────────────────────
// Uses Upstash REST API — works on Vercel Edge Functions without a TCP connection.
// Activate by setting REDIS_URL in .env.
// Format: https://<host>.upstash.io (with REDIS_TOKEN set separately)

export class RedisCache implements ICache {
  constructor(
    private readonly url: string,
    private readonly token: string
  ) {}

  private async request(command: unknown[]): Promise<unknown> {
    const res = await fetch(this.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) throw new Error(`Redis error: ${res.status}`);
    const data = await res.json() as { result: unknown };
    return data.result;
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.request(['GET', key]);
    if (result === null || result === undefined) return null;
    try {
      return JSON.parse(result as string) as T;
    } catch {
      return result as T;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.request(['SET', key, serialized, 'EX', ttlSeconds]);
    } else {
      await this.request(['SET', key, serialized]);
    }
  }

  async del(key: string): Promise<void> {
    await this.request(['DEL', key]);
  }
}
