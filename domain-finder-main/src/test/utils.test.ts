import { describe, it, expect, vi } from 'vitest';
import {
  cn,
  formatPrice,
  clamp,
  round,
  truncate,
  scoreToColorClass,
  scoreToLabel,
} from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('resolves Tailwind conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
  it('handles conditional classes', () => {
    expect(cn('base', false && 'skip', 'keep')).toBe('base keep');
  });
});

describe('formatPrice', () => {
  it('returns Free for 0', () => expect(formatPrice(0)).toBe('Free'));
  it('returns N/A for null', () => expect(formatPrice(null)).toBe('N/A'));
  it('formats USD correctly', () => expect(formatPrice(12)).toBe('$12'));
  it('formats large prices', () => expect(formatPrice(2500)).toBe('$2,500'));
});

describe('clamp', () => {
  it('clamps below min', () => expect(clamp(-5, 0, 100)).toBe(0));
  it('clamps above max', () => expect(clamp(150, 0, 100)).toBe(100));
  it('passes through in-range values', () => expect(clamp(50, 0, 100)).toBe(50));
});

describe('round', () => {
  it('rounds to 0 decimals by default', () => expect(round(3.7)).toBe(4));
  it('rounds to specified decimals', () => expect(round(3.456, 2)).toBe(3.46));
});

describe('truncate', () => {
  it('does not truncate short strings', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });
  it('truncates long strings with ellipsis', () => {
    const result = truncate('hello world', 8);
    expect(result).toHaveLength(8);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('scoreToColorClass', () => {
  it('returns success for >= 80', () => expect(scoreToColorClass(80)).toBe('text-success-500'));
  it('returns brand for 60–79', () => expect(scoreToColorClass(70)).toBe('text-brand-500'));
  it('returns warning for 40–59', () => expect(scoreToColorClass(50)).toBe('text-warning-500'));
  it('returns danger for < 40', () => expect(scoreToColorClass(30)).toBe('text-danger-500'));
});

describe('scoreToLabel', () => {
  it('returns Excellent for >= 85', () => expect(scoreToLabel(90)).toBe('Excellent'));
  it('returns Good for 70–84', () => expect(scoreToLabel(75)).toBe('Good'));
  it('returns Fair for 55–69', () => expect(scoreToLabel(60)).toBe('Fair'));
  it('returns Weak for 40–54', () => expect(scoreToLabel(45)).toBe('Weak'));
  it('returns Poor for < 40', () => expect(scoreToLabel(20)).toBe('Poor'));
});
