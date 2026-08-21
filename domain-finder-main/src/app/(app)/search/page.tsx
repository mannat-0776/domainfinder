'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { IdeaInput } from '@/components/search/idea-input';
import { NameCard } from '@/components/search/name-card';
import { RecommendationBanner } from '@/components/search/recommendation-banner';
import { NameCardSkeleton } from '@/components/ui/skeleton';
import { saveSession } from '@/lib/session-store';
import { useFavorites } from '@/hooks/use-favorites';
import type { SearchSession, NameStyle } from '@/types';

export default function SearchPage() {
  const [session, setSession] = React.useState<SearchSession | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const { toggle, isFavorited } = useFavorites();

  const handleSearch = async (idea: string, style?: NameStyle) => {
    setLoading(true);
    setError(null);
    setSession(null);

    try {
      const res = await fetch('/api/v1/names/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, style, count: 6 }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Something went wrong');
      }

      const data: SearchSession = await res.json();
      setSession(data);
      saveSession(data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const recommendedCandidate = session?.recommendation
    ? session.candidates.find((c) => c.id === session.recommendation!.candidateId)
    : null;

  const sortedCandidates = session
    ? [...session.candidates].sort((a, b) => {
        if (a.id === session.recommendation?.candidateId) return -1;
        if (b.id === session.recommendation?.candidateId) return 1;
        return (b.score?.overall ?? 0) - (a.score?.overall ?? 0);
      })
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <section aria-labelledby="search-heading">
            <h1 id="search-heading" className="text-2xl font-bold text-surface-900 mb-1">
              Find your startup name
            </h1>
            <p className="text-surface-600 mb-6 text-sm">
              Describe your idea and we’ll generate names, check domains, and score brand quality.
            </p>
            <IdeaInput onSubmit={handleSearch} loading={loading} />
          </section>

          {error && (
            <div role="alert" className="mt-6 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
              {error}
            </div>
          )}

          {loading && (
            <section aria-label="Loading results" aria-busy="true" className="mt-10 space-y-4">
              {[1, 2, 3].map((i) => <NameCardSkeleton key={i} />)}
            </section>
          )}

          {session && !loading && (
            <section ref={resultsRef} aria-label="Search results" className="mt-10 space-y-6">
              {session.recommendation && recommendedCandidate && (
                <RecommendationBanner
                  recommendation={session.recommendation}
                  candidate={recommendedCandidate}
                />
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wider">
                    {sortedCandidates.length} candidates
                  </h2>
                  <div className="flex items-center gap-4">
                    <a href={`/share/${session.id}`} className="text-sm text-surface-500 hover:text-surface-700 font-medium">
                      Share ↗
                    </a>
                    <a href={`/compare?session=${session.id}`} className="text-sm text-brand-600 hover:text-brand-700 hover:underline font-medium">
                      Compare all →
                    </a>
                  </div>
                </div>

                {sortedCandidates.map((candidate) => (
                  <NameCard
                    key={candidate.id}
                    candidate={candidate}
                    isRecommended={candidate.id === session.recommendation?.candidateId}
                    isFavorite={isFavorited(candidate.id)}
                    onFavorite={() => toggle(candidate)}
                  />
                ))}
              </div>

              <div className="pt-4 border-t border-surface-200">
                <p className="text-sm text-surface-500 text-center">
                  Not finding the right name?{' '}
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-brand-600 hover:underline font-medium"
                  >
                    Refine your idea
                  </button>
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
