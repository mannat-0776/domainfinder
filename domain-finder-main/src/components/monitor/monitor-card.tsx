'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Monitor } from '@/types';
import { Bell, BellOff, Trash2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonitorCardProps {
  monitor: Monitor;
  onRemove: (id: string) => void;
  onRefresh: (id: string) => void;
  refreshing?: boolean;
}

function statusBadge(status: Monitor['lastStatus']) {
  switch (status) {
    case 'available': return <Badge variant="success" dot>Available</Badge>;
    case 'taken':     return <Badge variant="danger" dot>Taken</Badge>;
    case 'premium':   return <Badge variant="premium" dot>Premium</Badge>;
    default:          return <Badge variant="default">Unknown</Badge>;
  }
}

export function MonitorCard({ monitor, onRemove, onRefresh, refreshing }: MonitorCardProps) {
  const lastChecked = monitor.lastCheckedAt
    ? new Date(monitor.lastCheckedAt).toLocaleString()
    : 'Never';

  return (
    <article
      className="rounded-2xl border border-surface-200 bg-white p-5"
      aria-label={`Monitor for ${monitor.domain}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-semibold text-surface-900">{monitor.domain}</span>
            {statusBadge(monitor.lastStatus)}
          </div>
          <p className="text-xs text-surface-400 mt-1">
            Last checked: {lastChecked} · Every {monitor.checkIntervalHours}h
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRefresh(monitor.id)}
            disabled={refreshing}
            aria-label="Refresh status"
          >
            <RefreshCw size={15} className={cn(refreshing && 'animate-spin')} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(monitor.id)}
            aria-label="Remove monitor"
            className="text-danger-500 hover:text-danger-700 hover:bg-danger-50"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>

      {monitor.latestEvent && (
        <div className="mt-3 rounded-lg bg-warning-50 border border-warning-500/30 px-3 py-2">
          <p className="text-xs text-warning-700">
            <span className="font-semibold">Status changed</span> from{' '}
            <span className="font-mono">{monitor.latestEvent.oldStatus}</span> to{' '}
            <span className="font-mono">{monitor.latestEvent.newStatus}</span>{' '}
            on {new Date(monitor.latestEvent.detectedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </article>
  );
}
