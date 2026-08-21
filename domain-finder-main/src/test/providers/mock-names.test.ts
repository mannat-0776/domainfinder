import { describe, it, expect } from 'vitest';
import { MockNameGenerator } from '@/providers/names/mock';

const generator = new MockNameGenerator();

describe('MockNameGenerator', () => {
  it('has name "mock"', () => {
    expect(generator.name).toBe('mock');
  });

  it('returns requested count of names', async () => {
    const results = await generator.generate({ idea: 'a saas tool', count: 4 });
    expect(results.length).toBeLessThanOrEqual(4);
    expect(results.length).toBeGreaterThan(0);
  });

  it('each result has name, rationale, and style', async () => {
    const results = await generator.generate({ idea: 'fintech app', count: 3 });
    for (const r of results) {
      expect(typeof r.name).toBe('string');
      expect(r.name.length).toBeGreaterThan(0);
      expect(typeof r.rationale).toBe('string');
      expect(r.rationale.length).toBeGreaterThan(0);
      expect(r.style).toBeTruthy();
    }
  });

  it('filters by style when provided', async () => {
    const results = await generator.generate({
      idea: 'marketplace',
      count: 10,
      style: 'metaphor',
    });
    results.forEach((r) => {
      expect(r.style).toBe('metaphor');
    });
  });

  it('same idea produces same names (deterministic)', async () => {
    const a = await generator.generate({ idea: 'consistent idea', count: 3 });
    const b = await generator.generate({ idea: 'consistent idea', count: 3 });
    expect(a.map((r) => r.name)).toEqual(b.map((r) => r.name));
  });
});
