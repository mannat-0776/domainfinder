'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { BrandScore } from '@/types';

interface ScoreBreakdownProps {
  score: BrandScore;
  className?: string;
}

const DIMENSION_ORDER = [
  'memorability',
  'pronounceability',
  'spelling_ease',
  'length',
  'domain_availability',
  'trademark_risk',
  'seo_potential',
];

export function ScoreBreakdown({ score, className }: ScoreBreakdownProps) {
  const dimensions = DIMENSION_ORDER
    .map((key) => {
      const dim = score.dimensions[key as keyof typeof score.dimensions];
      return dim ? { key, ...dim } : null;
    })
    .filter(Boolean) as Array<{
    key: string;
    score: number;
    weight: number;
    explanation: string;
  }>;

  return (
    <div className={cn('space-y-4', className)}>
      {dimensions.map(({ key, score: dimScore, weight, explanation }) => {
        const weightPercent = Math.round(weight * 100);
        const scaledScore = Math.round(dimScore * weight * 100);

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-semibold text-surface-900 dark:text-surface-50 capitalize">
                  {key.replace(/_/g, ' ')}
                </h5>
                <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">
                  {explanation}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-lg font-bold text-brand-600 dark:text-brand-400 tabular-nums">
                  {Math.round(dimScore)}
                </p>
                <p className="text-2xs text-surface-500 dark:text-surface-400 mt-0.5">
                  {weightPercent}% weight
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-500 dark:from-brand-500 dark:to-brand-400 rounded-full transition-all duration-500"
                style={{ width: `${dimScore}%` }}
                role="progressbar"
                aria-valuenow={Math.round(dimScore)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${key.replace(/_/g, ' ')}: ${Math.round(dimScore)}%`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}