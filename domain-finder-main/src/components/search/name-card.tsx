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
  invented:    'Invented',
  descriptive: 'Descriptive',
  metaphor:    'Metaphor',
  compound:    'Compound',
  acronym:     'Acronym',
  founder:     'Founder',
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
        'rounded-2xl border bg-white transition-shadow duration-200',
        isRecommended
          ? 'border-brand-400 shadow-md shadow-brand-100 ring-1 ring-brand-400'
          : 'border-surface-200 hover:shadow-sm',
        'animate-slide-up',
        className
      )}
      aria-label={`Name candidate: ${candidate.name}`}
    >
      {isRecommended && (
        <div className="flex items-center gap-1.5 px-5 py-2 bg-brand-500 rounded-t-2xl">
          <span className="text-xs font-semibold text-white tracking-wide uppercase">
            ⭐ Recommended
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-2xl font-bold text-surface-900 tracking-tight">
                {candidate.name}
              </h3>
              <Badge variant="brand">{STYLE_LABELS[candidate.style] ?? candidate.style}</Badge>
            </div>
            <p className="mt-1 text-sm text-surface-600 leading-snug">
              {candidate.rationale}
            </p>
          </div>

          {score && (
            <div className="flex-shrink-0">
              <ScoreRing score={score.overall} size={72} label="score" />
            </div>
          )}
        </div>

        {/* Domain availability */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">
            Domain Availability
          </h4>
          <div>
            {candidate.domains.length === 0 ? (
              <p className="text-sm text-surface-400">Checking domains…</p>
            ) : (
              candidate.domains.map((d) => (
                <DomainRow key={d.domain} domain={d} />
              ))
            )}
          </div>
        </div>

        {/* Score breakdown (expandable) */}
        {score && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium text-surface-500 hover:text-surface-700 transition-colors"
              aria-expanded={expanded}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? 'Hide' : 'Show'} score breakdown
            </button>

            {expanded && (
              <div className="mt-3 animate-fade-in">
                <ScoreBreakdown score={score} />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {onFavorite && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFavorite(candidate.id)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-pressed={isFavorite}
              leftIcon={
                <Heart
                  size={15}
                  className={isFavorite ? 'fill-danger-500 text-danger-500' : ''}
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
