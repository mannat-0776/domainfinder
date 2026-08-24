'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DomainResult } from '@/types';
import { ExternalLink, Check, X, Clock } from 'lucide-react';

interface DomainRowProps {
  domain: DomainResult;
  className?: string;
}

const TLD_PRIORITY: Record<string, number> = {
  '.com': 0,
  '.io': 1,
  '.co': 2,
  '.ai': 3,
};

export function DomainRow({ domain, className }: DomainRowProps) {
  const isAvailable = domain.status === 'available';
  const isTaken = domain.status === 'taken';
  const isPending = domain.status === 'checking';
  const priority = TLD_PRIORITY[domain.domain.split('.')[1] || ''] ?? 99;

  const statusIcon = isPending ? (
    <Clock size={16} className="text-surface-400 animate-pulse" aria-hidden="true" />
  ) : isAvailable ? (
    <Check size={16} className="text-success-600 dark:text-success-500" aria-hidden="true" />
  ) : (
    <X size={16} className="text-surface-400 dark:text-surface-500" aria-hidden="true" />
  );

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 rounded-lg',
        'bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700',
        'hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200',
        className
      )}
      role="row"
      aria-label={`${domain.domain} — ${isAvailable ? 'Available' : isTaken ? 'Taken' : 'Checking'}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {statusIcon}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-surface-900 dark:text-surface-50 truncate">
            {domain.domain}
          </p>
          {domain.price && (
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
              ${domain.price.toFixed(2)} / year
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isAvailable && (
          <Badge variant="success" size="sm" dot>
            Available
          </Badge>
        )}
        {isTaken && (
          <Badge variant="neutral" size="sm" dot>
            Taken
          </Badge>
        )}
        {isPending && (
          <Badge variant="neutral" size="sm" dot>
            Checking…
          </Badge>
        )}

        {isAvailable && (
          <Button
            size="icon"
            variant="ghost"
            asChild
            aria-label={`Register ${domain.domain} on GoDaddy`}
          >
            <a
              href={`https://www.godaddy.com/domain/search?utf8=✓&searchTerm=${domain.domain.split('.')[0]}&k1=${domain.domain.split('.')[0]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}