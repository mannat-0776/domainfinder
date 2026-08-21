import { describe, it, expect } from 'vitest';
import { sanitiseText, isValidDomain, safeCompare } from '@/lib/security';

describe('sanitiseText', () => {
  it('strips HTML tags', () => {
    expect(sanitiseText('<script>alert(1)</script>hello')).toBe('hello');
  });

  it('strips HTML entities', () => {
    const result = sanitiseText('hello &amp; world');
    expect(result).not.toContain('&amp;');
  });

  it('trims whitespace', () => {
    expect(sanitiseText('  hello  ')).toBe('hello');
  });

  it('caps at 10000 characters', () => {
    const long = 'a'.repeat(20_000);
    expect(sanitiseText(long).length).toBe(10_000);
  });

  it('passes clean text through unchanged', () => {
    expect(sanitiseText('A clean startup idea')).toBe('A clean startup idea');
  });
});

describe('isValidDomain', () => {
  it('accepts valid domains', () => {
    expect(isValidDomain('acme.com')).toBe(true);
    expect(isValidDomain('nexio.io')).toBe(true);
    expect(isValidDomain('my-startup.co')).toBe(true);
  });

  it('rejects invalid domains', () => {
    expect(isValidDomain('not a domain')).toBe(false);
    expect(isValidDomain('nodot')).toBe(false);
    expect(isValidDomain('.com')).toBe(false);
    expect(isValidDomain('')).toBe(false);
  });
});

describe('safeCompare', () => {
  it('returns true for equal strings', () => {
    expect(safeCompare('secret123', 'secret123')).toBe(true);
  });

  it('returns false for different strings of same length', () => {
    expect(safeCompare('secret123', 'secret124')).toBe(false);
  });

  it('returns false for different length strings', () => {
    expect(safeCompare('short', 'longer')).toBe(false);
  });

  it('returns false for empty vs non-empty', () => {
    expect(safeCompare('', 'a')).toBe(false);
  });

  it('returns true for two empty strings', () => {
    expect(safeCompare('', '')).toBe(true);
  });
});
