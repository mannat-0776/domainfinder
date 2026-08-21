import type { NameCandidate } from '@/types';

export interface StoredFavorite {
  id: string;
  candidateId: string;
  candidate: NameCandidate;
  notes: string | null;
  createdAt: string;
}

interface FavoriteRow {
  id: string;
  candidate_id: string;
  notes: string | null;
  created_at: string;
  name_candidates: {
    id: string;
    session_id: string;
    name: string;
    rationale: string;
    style: NameCandidate['style'];
    created_at: string;
    domain_checks?: Array<Record<string, unknown>>;
  } | null;
}

function toFavorite(row: FavoriteRow): StoredFavorite {
  const candidate = row.name_candidates!;
  return {
    id: row.id,
    candidateId: row.candidate_id,
    notes: row.notes,
    createdAt: row.created_at,
    candidate: {
      id: candidate.id,
      sessionId: candidate.session_id,
      name: candidate.name,
      rationale: candidate.rationale,
      style: candidate.style,
      domains: (candidate.domain_checks ?? []).map((domain) => ({
        domain: String(domain.domain),
        name: String(domain.domain).split('.')[0],
        tld: String(domain.tld) as NameCandidate['domains'][number]['tld'],
        status: String(domain.status) as NameCandidate['domains'][number]['status'],
        priceUsd: domain.price_usd === null ? null : Number(domain.price_usd),
        priceTier: String(domain.price_tier) as NameCandidate['domains'][number]['priceTier'],
        registrar: domain.registrar ? String(domain.registrar) : null,
        checkedAt: String(domain.checked_at),
        ttlSeconds: Number(domain.ttl_seconds),
      })),
      score: null,
      createdAt: candidate.created_at,
    },
  };
}

export async function getFavorites(): Promise<StoredFavorite[]> {
  const response = await fetch('/api/v1/favorites', { cache: 'no-store' });
  if (!response.ok) return [];
  const data = await response.json() as { favorites: FavoriteRow[] };
  return (data.favorites ?? []).filter((row) => row.name_candidates).map(toFavorite);
}

export async function addFavorite(candidate: NameCandidate, notes?: string): Promise<StoredFavorite> {
  const response = await fetch('/api/v1/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId: candidate.id, notes }),
  });
  if (!response.ok) throw new Error('Sign in to save favorites.');
  const data = await response.json() as { favorite: FavoriteRow };
  return toFavorite(data.favorite);
}

export async function removeFavorite(candidateId: string): Promise<void> {
  const response = await fetch(`/api/v1/favorites?candidateId=${encodeURIComponent(candidateId)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Unable to remove favorite.');
}

export async function toggleFavorite(candidate: NameCandidate, currentlyFavorite: boolean): Promise<boolean> {
  if (currentlyFavorite) await removeFavorite(candidate.id);
  else await addFavorite(candidate);
  return !currentlyFavorite;
}
