// ─── Security Utilities ────────────────────────────────────────────────────────────────────

/**
 * Sanitise a string for safe display.
 * Strips HTML tags and trims whitespace.
 * Use before rendering any user-supplied text outside of React's auto-escaping.
 */
export function sanitiseText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/&[^;]+;/g, ' ')  // strip HTML entities
    .trim()
    .slice(0, 10_000);          // hard cap
}

/**
 * Validate that a string is a plausible domain name.
 * Does NOT guarantee the domain exists — use for input validation only.
 */
export function isValidDomain(domain: string): boolean {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(domain.trim());
}

/**
 * Constant-time string comparison to prevent timing attacks.
 * Use when comparing secrets (e.g. cron tokens, API keys).
 */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Validate Vercel cron secret using constant-time comparison.
 */
export function validateCronSecret(authHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (!authHeader?.startsWith('Bearer ')) return false;
  return safeCompare(authHeader.slice(7), secret);
}
