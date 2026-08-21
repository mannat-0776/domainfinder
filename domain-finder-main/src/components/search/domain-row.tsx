import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import type { DomainAvailability } from '@/types';

interface DomainRowProps {
  domain: DomainAvailability;
}

function statusBadge(domain: DomainAvailability) {
  switch (domain.status) {
    case 'available':
      return <Badge variant="success" dot>Available</Badge>;
    case 'premium':
      return <Badge variant="premium" dot>Premium</Badge>;
    case 'taken':
      return <Badge variant="danger" dot>Taken</Badge>;
    case 'checking':
      return <Badge variant="default">Checking…</Badge>;
    default:
      return <Badge variant="default">Unknown</Badge>;
  }
}

export function DomainRow({ domain }: DomainRowProps) {
  const isActionable = domain.status === 'available' || domain.status === 'premium';

  return (
    <div className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-surface-900">
          {domain.name}
          <span className="text-brand-500">{domain.tld}</span>
        </span>
        {statusBadge(domain)}
      </div>
      <div className="flex items-center gap-3">
        {domain.priceUsd !== null && (
          <span className="text-sm text-surface-600 tabular-nums">
            {formatPrice(domain.priceUsd)}/yr
          </span>
        )}
        {isActionable && (
          <a
            href={`https://www.namecheap.com/domains/registration/results/?domain=${domain.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline"
            aria-label={`Register ${domain.domain}`}
          >
            Register →
          </a>
        )}
      </div>
    </div>
  );
}
