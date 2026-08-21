import type { DomainStatus, Monitor } from '@/types';

type MonitorRow = {
  id: string;
  user_id: string;
  domain: string;
  last_status: DomainStatus;
  check_interval_hours: number;
  notify_on_change: boolean;
  last_checked_at: string | null;
  created_at: string;
  monitor_events?: Array<{
    id: string;
    old_status: DomainStatus;
    new_status: DomainStatus;
    detected_at: string;
  }>;
};

function toMonitor(row: MonitorRow): Monitor {
  const event = row.monitor_events?.sort((a, b) => b.detected_at.localeCompare(a.detected_at))[0];
  return {
    id: row.id,
    userId: row.user_id,
    domain: row.domain,
    lastStatus: row.last_status,
    checkIntervalHours: row.check_interval_hours,
    notifyOnChange: row.notify_on_change,
    lastCheckedAt: row.last_checked_at,
    createdAt: row.created_at,
    latestEvent: event
      ? {
          id: event.id,
          monitorId: row.id,
          oldStatus: event.old_status,
          newStatus: event.new_status,
          detectedAt: event.detected_at,
        }
      : null,
  };
}

export async function getMonitors(): Promise<Monitor[]> {
  const response = await fetch('/api/v1/monitors', { cache: 'no-store' });
  if (!response.ok) return [];
  const data = await response.json() as { monitors: MonitorRow[] };
  return (data.monitors ?? []).map(toMonitor);
}

export async function addMonitor(domain: string, intervalHours = 24): Promise<Monitor> {
  const response = await fetch('/api/v1/monitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, checkIntervalHours: intervalHours }),
  });
  if (!response.ok) throw new Error('Sign in to add domain monitors.');
  const data = await response.json() as { monitor: MonitorRow };
  return toMonitor(data.monitor);
}

export async function removeMonitor(id: string): Promise<void> {
  const response = await fetch(`/api/v1/monitors?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Unable to remove monitor.');
}

