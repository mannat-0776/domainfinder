'use client';

import * as React from 'react';
import { ScoreRing } from '@/components/ui/score-ring';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DomainRow } from './domain-row';
import { ScoreBreakdown } from './score-breakdown';
import { cn } from '@/lib/utils';
import type { NameCandidate } from '@/types';
import { Heart, ChevronDown, ChevronUp } from 'lucide-react';

const STYLE_LABELS: Record<string, string> = {
  invented: 'Invented',
  descriptive: 'Descriptive',
  metaphor: 'Metaphor',
  compound: 'Compound',
  acronym: 'Acronym',
  founder: 'Founder',
};

interface NameCardProps {
  candidate: NameCandidate;
  isRecommended?: boolean;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
  className?: string;
}

export function NameCard({
  candidate,
  isRecommended = false,
  isFavorite = false,
  onFavorite,
  className,
}: NameCardProps) {
  const [expanded, setExpanded] = React.useState(isRecommended);
  const score = candidate.score;

  return (
    <article
      className={cn(
        'rounded-xl border transition-all duration-300',
        isRecommended
          ? 'border-brand-400 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950 dark:to-surface-900 shadow-lg dark:shadow-xl ring-2 ring-brand-500'
          : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-surface-300 dark:hover:border-surface-600 hover:shadow-base',
        'animate-slide-up',
        className
      )}
      aria-label={`Name candidate: ${candidate.name}`}
    >
      {isRecommended && (
        <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700 rounded-t-xl">
          <span className="text-lg">⭐</span>
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            Recommended Choice
          </span>
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Header section */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-50 tracking-tight break-all">
                {candidate.name}
              </h3>
              <Badge variant="brand" size="sm">
                {STYLE_LABELS[candidate.style] ?? candidate.style}
              </Badge>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
              {candidate.rationale}
            </p>
          </div>

          {score && (
            <div className="flex-shrink-0">
              <ScoreRing score={score.overall} size={72} label="score" />
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="divider my-6" />

        {/* Domain availability section */}
        <div className="mb-6">
          <h4 className="text-label mb-4">
            Domain Availability
          </h4>
          <div className="space-y-2">
            {candidate.domains.length === 0 ? (
              <p className="text-sm text-surface-500 dark:text-surface-400 py-2">
                Checking domains…
              </p>
            ) : (
              candidate.domains.map((d) => (
                <DomainRow key={d.domain} domain={d} />
              ))
            )}
          </div>
        </div>

        {/* Score breakdown (expandable) */}
        {score && (
          <div>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-2 text-sm font-semibold text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200 transition-colors py-2"
              aria-expanded={expanded}
              aria-controls={`breakdown-${candidate.id}`}
            >
              {expanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              {expanded ? 'Hide' : 'Show'} detailed breakdown
            </button>

            {expanded && (
              <div
                id={`breakdown-${candidate.id}`}
                className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 animate-fade-in"
              >
                <ScoreBreakdown score={score} />
              </div>
            )}
          </div>
        )}

        {/* Actions footer */}
        {onFavorite && (
          <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFavorite(candidate.id)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-pressed={isFavorite}
              leftIcon={
                <Heart
                  size={16}
                  className={cn(
                    'transition-all',
                    isFavorite
                      ? 'fill-danger-500 text-danger-500'
                      : 'text-surface-400 hover:text-danger-500'
                  )}
                />
              }
            >
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}