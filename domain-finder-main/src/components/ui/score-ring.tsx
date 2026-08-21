'use client';

import * as React from 'react';
import { cn, scoreToColorClass, scoreToLabel } from '@/lib/utils';

interface ScoreRingProps {
  score: number;       // 0–100
  size?: number;       // px, default 80
  strokeWidth?: number;
  label?: string;
  className?: string;
  animate?: boolean;
}

export function ScoreRing({
  score,
  size = 80,
  strokeWidth = 7,
  label,
  className,
  animate = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorClass = scoreToColorClass(score);
  const strokeColor =
    score >= 80 ? '#22c55e'
    : score >= 60 ? '#6366f1'
    : score >= 40 ? '#f59e0b'
    : '#ef4444';

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Brand score: ${score} out of 100 — ${scoreToLabel(score)}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-200"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animate ? 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
          }}
        />
      </svg>
      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold tabular-nums leading-none', colorClass,
          size >= 80 ? 'text-xl' : 'text-base'
        )}>
          {Math.round(score)}
        </span>
        {label && (
          <span className="text-2xs text-surface-500 mt-0.5 leading-none">{label}</span>
        )}
      </div>
    </div>
  );
}
