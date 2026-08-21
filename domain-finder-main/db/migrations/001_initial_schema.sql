-- =============================================================
-- Domain Finder — Initial Schema
-- =============================================================
-- Run against PostgreSQL 15+ (Supabase compatible).
-- All tables use UUID primary keys for global uniqueness.
-- Row-Level Security (RLS) policies are defined per table.
-- =============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- USERS
-- Managed by Supabase Auth. This table extends auth.users
-- with application-specific fields.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- =============================================================
-- SEARCH SESSIONS
-- One session per search. Anonymous sessions have user_id = NULL.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.search_sessions (
  id          TEXT PRIMARY KEY,           -- shortId() from client
  user_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  idea_text   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_sessions_user_id ON public.search_sessions(user_id);
CREATE INDEX idx_search_sessions_created_at ON public.search_sessions(created_at DESC);

ALTER TABLE public.search_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert sessions"
  ON public.search_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read own sessions"
  ON public.search_sessions FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

-- =============================================================
-- NAME CANDIDATES
-- Generated names belonging to a session.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.name_candidates (
  id          TEXT PRIMARY KEY,
  session_id  TEXT NOT NULL REFERENCES public.search_sessions(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  rationale   TEXT NOT NULL,
  style       TEXT NOT NULL CHECK (style IN ('invented','descriptive','metaphor','acronym','founder','compound')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_name_candidates_session_id ON public.name_candidates(session_id);

ALTER TABLE public.name_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert candidates"
  ON public.name_candidates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read candidates"
  ON public.name_candidates FOR SELECT
  USING (true);

-- =============================================================
-- DOMAIN CHECKS
-- Cached availability results per candidate + TLD.
-- TTL enforced at application layer using checked_at + ttl_seconds.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.domain_checks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id  TEXT NOT NULL REFERENCES public.name_candidates(id) ON DELETE CASCADE,
  domain        TEXT NOT NULL,
  tld           TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('available','taken','premium','unknown')),
  price_usd     NUMERIC(10,2),
  price_tier    TEXT NOT NULL DEFAULT 'standard',
  registrar     TEXT,
  checked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ttl_seconds   INTEGER NOT NULL DEFAULT 300,
  UNIQUE (candidate_id, domain)
);

CREATE INDEX idx_domain_checks_candidate_id ON public.domain_checks(candidate_id);
CREATE INDEX idx_domain_checks_domain ON public.domain_checks(domain);
CREATE INDEX idx_domain_checks_checked_at ON public.domain_checks(checked_at DESC);

ALTER TABLE public.domain_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert domain checks"
  ON public.domain_checks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read domain checks"
  ON public.domain_checks FOR SELECT
  USING (true);

-- =============================================================
-- BRAND SCORES
-- Computed scores per candidate. One row per candidate.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.brand_scores (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id          TEXT NOT NULL UNIQUE REFERENCES public.name_candidates(id) ON DELETE CASCADE,
  overall               NUMERIC(5,1) NOT NULL CHECK (overall BETWEEN 0 AND 100),
  memorability          NUMERIC(5,1) NOT NULL,
  pronounceability      NUMERIC(5,1) NOT NULL,
  spelling_ease         NUMERIC(5,1) NOT NULL,
  length_score          NUMERIC(5,1) NOT NULL,
  dot_com_availability  NUMERIC(5,1) NOT NULL,
  trademark_risk        NUMERIC(5,1) NOT NULL,
  seo_potential         NUMERIC(5,1) NOT NULL,
  dimensions_json       JSONB NOT NULL,   -- full ScoreDimension objects
  computed_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brand_scores_candidate_id ON public.brand_scores(candidate_id);
CREATE INDEX idx_brand_scores_overall ON public.brand_scores(overall DESC);

ALTER TABLE public.brand_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert scores"
  ON public.brand_scores FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read scores"
  ON public.brand_scores FOR SELECT
  USING (true);

-- =============================================================
-- RECOMMENDATIONS
-- One recommendation per session (the winner + reasoning).
-- =============================================================
CREATE TABLE IF NOT EXISTS public.recommendations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       TEXT NOT NULL UNIQUE REFERENCES public.search_sessions(id) ON DELETE CASCADE,
  candidate_id     TEXT NOT NULL REFERENCES public.name_candidates(id) ON DELETE CASCADE,
  alternative_id   TEXT REFERENCES public.name_candidates(id) ON DELETE SET NULL,
  headline         TEXT NOT NULL,
  reasoning        JSONB NOT NULL,   -- string[]
  caveats          JSONB NOT NULL,   -- string[]
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recommendations_session_id ON public.recommendations(session_id);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert recommendations"
  ON public.recommendations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read recommendations"
  ON public.recommendations FOR SELECT
  USING (true);

-- =============================================================
-- FAVORITES
-- User-saved candidates. Requires auth.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  candidate_id  TEXT NOT NULL REFERENCES public.name_candidates(id) ON DELETE CASCADE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, candidate_id)
);

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================
-- MONITORS
-- Domain watch subscriptions. Requires auth.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.monitors (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  domain                TEXT NOT NULL,
  last_status           TEXT NOT NULL DEFAULT 'unknown',
  check_interval_hours  INTEGER NOT NULL DEFAULT 24 CHECK (check_interval_hours IN (1,6,12,24,48)),
  notify_on_change      BOOLEAN NOT NULL DEFAULT TRUE,
  last_checked_at       TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, domain)
);

CREATE INDEX idx_monitors_user_id ON public.monitors(user_id);
CREATE INDEX idx_monitors_last_checked_at ON public.monitors(last_checked_at ASC NULLS FIRST);

ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own monitors"
  ON public.monitors FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================
-- MONITOR EVENTS
-- Immutable log of status changes detected by the cron job.
-- =============================================================
CREATE TABLE IF NOT EXISTS public.monitor_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitor_id   UUID NOT NULL REFERENCES public.monitors(id) ON DELETE CASCADE,
  old_status   TEXT NOT NULL,
  new_status   TEXT NOT NULL,
  detected_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_monitor_events_monitor_id ON public.monitor_events(monitor_id);
CREATE INDEX idx_monitor_events_detected_at ON public.monitor_events(detected_at DESC);

ALTER TABLE public.monitor_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own monitor events"
  ON public.monitor_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.monitors m
      WHERE m.id = monitor_id AND m.user_id = auth.uid()
    )
  );

-- =============================================================
-- HELPER VIEWS
-- =============================================================

-- Latest domain check per domain (respects TTL)
CREATE OR REPLACE VIEW public.fresh_domain_checks AS
  SELECT DISTINCT ON (domain)
    *,
    (checked_at + (ttl_seconds || ' seconds')::INTERVAL) AS expires_at,
    (checked_at + (ttl_seconds || ' seconds')::INTERVAL) > NOW() AS is_fresh
  FROM public.domain_checks
  ORDER BY domain, checked_at DESC;

-- Monitors due for a check
CREATE OR REPLACE VIEW public.monitors_due AS
  SELECT *
  FROM public.monitors
  WHERE
    last_checked_at IS NULL
    OR last_checked_at < NOW() - (check_interval_hours || ' hours')::INTERVAL;
