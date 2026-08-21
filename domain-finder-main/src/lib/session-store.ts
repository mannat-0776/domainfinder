'use client';

// ─── Client-side Session Store ───────────────────────────────────────────────────────────────
// Bridges search results to the compare page and share page.
// Phase 6 replaces this with DB-backed persistence.

import type { SearchSession } from '@/types';

const PREFIX = 'df:session:';
const MAX_SESSIONS = 10; // keep last 10 in storage

export function saveSession(session: SearchSession): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(`${PREFIX}${session.id}`, JSON.stringify(session));
    pruneOldSessions();
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function loadSession(id: string): SearchSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`${PREFIX}${id}`);
    return raw ? (JSON.parse(raw) as SearchSession) : null;
  } catch {
    return null;
  }
}

export function listSessionIds(): string[] {
  if (typeof window === 'undefined') return [];
  const ids: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith(PREFIX)) ids.push(key.slice(PREFIX.length));
  }
  return ids;
}

function pruneOldSessions(): void {
  const ids = listSessionIds();
  if (ids.length <= MAX_SESSIONS) return;
  // Remove oldest (first inserted) beyond limit
  ids.slice(0, ids.length - MAX_SESSIONS).forEach((id) => {
    sessionStorage.removeItem(`${PREFIX}${id}`);
  });
}
