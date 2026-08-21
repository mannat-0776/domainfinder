'use client';

import * as React from 'react';
import {
  getFavorites,
  toggleFavorite,
  type StoredFavorite,
} from '@/lib/favorites-store';
import type { NameCandidate } from '@/types';

// ─── useFavorites hook ────────────────────────────────────────────────────────────────────
// Single source of truth for favorites state across the app.
// Syncs with localStorage and re-renders on change.

export function useFavorites() {
  const [favorites, setFavorites] = React.useState<StoredFavorite[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  React.useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  const toggle = React.useCallback(async (candidate: NameCandidate) => {
    setError(null);
    const currentlyFavorite = favorites.some((favorite) => favorite.candidateId === candidate.id);
    try {
      await toggleFavorite(candidate, currentlyFavorite);
      setFavorites(await getFavorites());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update favorite.');
    }
  }, [favorites]);

  const check = React.useCallback((candidateId: string) => {
    return favorites.some((f) => f.candidateId === candidateId);
  }, [favorites]);

  return { favorites, toggle, isFavorited: check, error };
}
