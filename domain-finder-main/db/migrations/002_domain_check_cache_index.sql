-- =============================================================
-- Migration 002: Composite index for domain check cache lookups
-- =============================================================
-- Speeds up the cache-hit query:
--   SELECT * FROM domain_checks
--   WHERE domain = $1
--   AND checked_at > NOW() - INTERVAL '5 minutes'
--   ORDER BY checked_at DESC LIMIT 1;

CREATE INDEX IF NOT EXISTS idx_domain_checks_cache
  ON public.domain_checks (domain, checked_at DESC)
  WHERE status != 'unknown';
