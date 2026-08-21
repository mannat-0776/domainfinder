'use client';

import * as React from 'react';

// ─── Suspense Boundary ────────────────────────────────────────────────────────────────────
// Next.js requires useSearchParams() to be wrapped in <Suspense>.
// This wrapper provides a consistent fallback across all pages that
// use search params (compare, share).

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback = (
  <div className="min-h-screen flex items-center justify-center bg-surface-50" aria-busy="true">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-surface-200" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-surface-500">Loading...</p>
    </div>
  </div>
);

export function SuspenseBoundary({ children, fallback }: Props) {
  return (
    <React.Suspense fallback={fallback ?? DefaultFallback}>
      {children}
    </React.Suspense>
  );
}
