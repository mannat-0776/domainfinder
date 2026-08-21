'use client';

import * as React from 'react';
import type { BrandScore } from '@/types';
import { cn } from '@/lib/utils';

interface ScoreBreakdownProps {
  score: BrandScore;
}

export function ScoreBreakdown({ score }: ScoreBreakdownProps) {
  return (
    <div className="space-y-2" role="list" aria-label="Score breakdown">
      {Object.entries(score.dimensions).map(([key, dim]) => (
        <div key={key} role="listitem">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-surface-600">{dim.label}</span>
            <span
              className={cn(
                'text-xs font-semibold tabular-nums',
                dim.value >= 80 ? 'text-success-500'
                : dim.value >= 60 ? 'text-brand-500'
                : dim.value >= 40 ? 'text-warning-500'
                : 'text-danger-500'
              )}
            >
              {Math.round(dim.value)}
            </span>
          </div>
          <div
            className="h-1.5 rounded-full bg-surface-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(dim.value)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={dim.label}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700',
                dim.value >= 80 ? 'bg-success-500'
                : dim.value >= 60 ? 'bg-brand-500'
                : dim.value >= 40 ? 'bg-warning-500'
                : 'bg-danger-500'
              )}
              style={{ width: `${dim.value}%` }}
            />
          </div>
          <p className="text-2xs text-surface-400 mt-0.5 leading-snug">
            {dim.explanation}
          </p>
        </div>
      ))}
    </div>
  );
}
