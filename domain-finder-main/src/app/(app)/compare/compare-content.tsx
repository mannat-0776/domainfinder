'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScoreRing } from '@/components/ui/score-ring';
import { DomainRow } from '@/components/search/domain-row';
import { loadSession } from '@/lib/session-store';
import type { NameCandidate } from '@/types';
import Link from 'next/link';

export default function CompareContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const [candidates, setCandidates] = React.useState<NameCandidate[]>([]);
  const [idea, setIdea] = React.useState('');

  React.useEffect(() => {
    if (!sessionId) return;
    const session = loadSession(sessionId);
    if (session) {
      setCandidates(session.candidates);
      setIdea(session.ideaText);
    }
  }, [sessionId]);

  const dimensions = candidates[0]?.score
    ? Object.keys(candidates[0].score.dimensions)
    : [];

  const dimLabel = (key: string) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();

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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6">
            <Link href="/search" className="text-sm text-surface-500 hover:text-surface-700">
              &larr; Back to search
            </Link>
            <h1 className="text-2xl font-bold text-surface-900 mt-2">
              Compare candidates
              {idea && (
                <span className="text-surface-500 font-normal text-lg ml-2">
                  for &ldquo;{idea}&rdquo;
                </span>
              )}
            </h1>
          </div>

          {candidates.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-surface-500 mb-4">No candidates to compare.</p>
              <Link href="/search" className="text-brand-600 hover:underline font-medium">
                Run a search first &rarr;
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-surface-200 bg-white">
              <table className="w-full border-collapse" aria-label="Candidate comparison">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider p-4 w-44">
                      Dimension
                    </th>
                    {candidates.map((c) => (
                      <th key={c.id} className="text-center p-4 min-w-[180px]" scope="col">
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-xl font-bold text-surface-900">{c.name}</span>
                          {c.score && <ScoreRing score={c.score.overall} size={64} label="score" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-surface-100 bg-surface-50">
                    <td className="p-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                      Domains
                    </td>
                    {candidates.map((c) => (
                      <td key={c.id} className="p-4">
                        {c.domains.slice(0, 4).map((d) => (
                          <DomainRow key={d.domain} domain={d} />
                        ))}
                      </td>
                    ))}
                  </tr>

                  {dimensions.map((dimKey, idx) => {
                    const values = candidates.map(
                      (c) =>
                        c.score?.dimensions[
                          dimKey as keyof typeof c.score.dimensions
                        ]?.value ?? 0
                    );
                    const best = Math.max(...values);

                    return (
                      <tr
                        key={dimKey}
                        className={`border-b border-surface-100 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-surface-50/50'
                        }`}
                      >
                        <td className="p-4 text-sm font-medium text-surface-600">
                          {dimLabel(dimKey)}
                        </td>
                        {candidates.map((c) => {
                          const dim =
                            c.score?.dimensions[
                              dimKey as keyof typeof c.score.dimensions
                            ];
                          const isBest =
                            dim && dim.value === best && candidates.length > 1;
                          return (
                            <td key={c.id} className="p-4 text-center">
                              {dim ? (
                                <div className="flex flex-col items-center gap-1.5">
                                  <span
                                    className={`text-xl font-bold tabular-nums ${
                                      dim.value >= 80
                                        ? 'text-success-500'
                                        : dim.value >= 60
                                        ? 'text-brand-500'
                                        : dim.value >= 40
                                        ? 'text-warning-500'
                                        : 'text-danger-500'
                                    }`}
                                  >
                                    {Math.round(dim.value)}
                                    {isBest && (
                                      <span className="text-xs ml-1" aria-label="best">
                                        &#9733;
                                      </span>
                                    )}
                                  </span>
                                  <div
                                    className="h-1.5 w-20 rounded-full bg-surface-100 overflow-hidden"
                                    role="progressbar"
                                    aria-valuenow={Math.round(dim.value)}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={dimLabel(dimKey)}
                                  >
                                    <div
                                      className={`h-full rounded-full transition-all duration-700 ${
                                        dim.value >= 80
                                          ? 'bg-success-500'
                                          : dim.value >= 60
                                          ? 'bg-brand-500'
                                          : dim.value >= 40
                                          ? 'bg-warning-500'
                                          : 'bg-danger-500'
                                      }`}
                                      style={{ width: `${dim.value}%` }}
                                    />
                                  </div>
                                  <p className="text-2xs text-surface-400 max-w-[160px] leading-snug">
                                    {dim.explanation}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-surface-300">&mdash;</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
