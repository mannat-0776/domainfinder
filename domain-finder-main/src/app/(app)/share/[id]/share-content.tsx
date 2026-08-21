'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NameCard } from '@/components/search/name-card';
import { RecommendationBanner } from '@/components/search/recommendation-banner';
import { loadSession } from '@/lib/session-store';
import { useFavorites } from '@/hooks/use-favorites';
import type { SearchSession } from '@/types';
import { Globe } from 'lucide-react';
import Link from 'next/link';

interface Props {
  id: string;
}

export default function ShareContent({ id }: Props) {
  const [session, setSession] = React.useState<SearchSession | null>(null);
  const [notFound, setNotFound] = React.useState(false);
  const { toggle, isFavorited } = useFavorites();

  React.useEffect(() => {
    const s = loadSession(id);
    if (s) setSession(s);
    else setNotFound(true);
  }, [id]);

  const recommendedCandidate = session?.recommendation
    ? session.candidates.find((c) => c.id === session!.recommendation!.candidateId)
    : null;

  const sorted = session
    ? [...session.candidates].sort((a, b) => {
        if (a.id === session!.recommendation?.candidateId) return -1;
        if (b.id === session!.recommendation?.candidateId) return 1;
        return (b.score?.overall ?? 0) - (a.score?.overall ?? 0);
      })
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          {notFound && (
            <div className="text-center py-20">
              <Globe size={48} className="text-surface-300 mx-auto mb-4" aria-hidden="true" />
              <h1 className="text-xl font-bold text-surface-900 mb-2">Session not found</h1>
              <p className="text-surface-500 mb-6">
                This shared session has expired or was opened on a different device.
              </p>
              <Link href="/search" className="text-brand-600 hover:underline font-medium">
                Start a new search &rarr;
              </Link>
            </div>
          )}

          {session && (
            <div className="space-y-6">
              <div>
                <p className="text-xs text-surface-400 uppercase tracking-wider mb-1">Shared search</p>
                <h1 className="text-2xl font-bold text-surface-900">
                  Names for:{' '}
                  <span className="text-brand-600">{session.ideaText}</span>
                </h1>
              </div>

              {session.recommendation && recommendedCandidate && (
                <RecommendationBanner
                  recommendation={session.recommendation}
                  candidate={recommendedCandidate}
                />
              )}

              <div className="space-y-4">
                {sorted.map((c) => (
                  <NameCard
                    key={c.id}
                    candidate={c}
                    isRecommended={c.id === session.recommendation?.candidateId}
                    isFavorite={isFavorited(c.id)}
                    onFavorite={() => toggle(c)}
                  />
                ))}
              </div>

              <div className="pt-4 border-t border-surface-200 text-center">
                <Link
                  href="/search"
                  className="text-sm text-brand-600 hover:underline font-medium"
                >
                  Run your own search &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
