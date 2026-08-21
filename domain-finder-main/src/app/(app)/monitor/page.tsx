'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MonitorCard } from '@/components/monitor/monitor-card';
import { AddMonitorForm } from '@/components/monitor/add-monitor-form';
import {
  getMonitors,
  addMonitor,
  removeMonitor,
} from '@/lib/monitor-store';
import type { Monitor } from '@/types';
import { Bell } from 'lucide-react';

export default function MonitorPage() {
  const [monitors, setMonitors] = React.useState<Monitor[]>([]);
  const [refreshing, setRefreshing] = React.useState<Set<string>>(new Set());

  // Load from localStorage on mount
  React.useEffect(() => {
    getMonitors().then(setMonitors);
  }, []);

  const handleAdd = async (domain: string) => {
    const monitor = await addMonitor(domain);
    setMonitors(await getMonitors());
    // Immediately check status
    handleRefresh(monitor.id);
  };

  const handleRemove = async (id: string) => {
    await removeMonitor(id);
    setMonitors(await getMonitors());
  };

  const handleRefresh = async (id: string) => {
    const monitor = (await getMonitors()).find((m) => m.id === id);
    if (!monitor) return;

    setRefreshing((prev) => new Set(prev).add(id));
    try {
      const res = await fetch('/api/v1/monitors/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monitorId: monitor.id, domains: [monitor.domain] }),
      });
      if (res.ok) {
        const { results } = await res.json();
        if (results[0]) {
          setMonitors(await getMonitors());
        }
      }
    } finally {
      setRefreshing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-surface-900 mb-1">Domain monitoring</h1>
            <p className="text-surface-600 text-sm">
              Watch taken domains and get notified the moment they become available.
            </p>
          </div>

          <div className="mb-6">
            <AddMonitorForm onAdd={handleAdd} />
          </div>

          {monitors.length === 0 ? (
            <div className="rounded-2xl border border-surface-200 bg-white p-12 flex flex-col items-center gap-4 text-center">
              <Bell size={40} className="text-surface-300" aria-hidden="true" />
              <div>
                <p className="font-medium text-surface-700">No domains being watched</p>
                <p className="text-sm text-surface-500 mt-1">
                  Add a domain above to start monitoring its availability.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3" aria-label="Monitored domains">
              {monitors.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  monitor={monitor}
                  onRemove={handleRemove}
                  onRefresh={handleRefresh}
                  refreshing={refreshing.has(monitor.id)}
                />
              ))}
            </div>
          )}

          <div className="mt-8 rounded-xl bg-surface-50 border border-surface-200 p-4">
            <p className="text-xs text-surface-500">
              <span className="font-semibold">Note:</span> Monitoring currently runs in your browser.
              Sign in (coming soon) to enable server-side monitoring with email notifications.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
