'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { NameCard } from '@/components/search/name-card';
import { useFavorites } from '@/hooks/use-favorites';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, toggle, isFavorited } = useFavorites();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-surface-900 mb-1">Saved favorites</h1>
            <p className="text-surface-600 text-sm">
              Names you’ve saved across your searches.
            </p>
          </div>

          {favorites.length === 0 ? (
            <div className="rounded-2xl border border-surface-200 bg-white p-12 flex flex-col items-center gap-4 text-center">
              <Heart size={40} className="text-surface-300" aria-hidden="true" />
              <div>
                <p className="font-medium text-surface-700">No saved names yet</p>
                <p className="text-sm text-surface-500 mt-1">
                  Tap the heart icon on any name card to save it here.
                </p>
              </div>
              <Link
                href="/search"
                className="text-sm font-medium text-brand-600 hover:underline"
              >
                Start searching →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((fav) => (
                <NameCard
                  key={fav.id}
                  candidate={fav.candidate}
                  isFavorite={isFavorited(fav.candidateId)}
                  onFavorite={() => toggle(fav.candidate)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
