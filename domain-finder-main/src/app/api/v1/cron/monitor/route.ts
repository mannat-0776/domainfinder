import { NextRequest, NextResponse } from 'next/server';
import { validateCronSecret } from '@/lib/security';
import { toApiError } from '@/lib/errors';

// ─── Monitor Cron Handler ───────────────────────────────────────────────────────────────
// Called by Vercel Cron every hour (see vercel.json).
// Validates the cron secret using constant-time comparison (no timing attacks).
// Phase 6: queries DB monitors_due view, checks each domain, writes events.

export async function GET(req: NextRequest) {
  if (!validateCronSecret(req.headers.get('authorization'))) {
    return NextResponse.json(
      { code: 'UNAUTHORIZED', message: 'Invalid or missing cron secret.' },
      { status: 401 }
    );
  }

  try {
    // Phase 6: replace stub with real DB query
    // const due = await db.from('monitors_due').select('*').limit(100);
    // const provider = await getDomainProvider();
    // for (const monitor of due) {
    //   const result = await provider.checkAvailability(monitor.domain);
    //   if (result.status !== monitor.last_status) {
    //     await db.from('monitor_events').insert({ ... });
    //     await notifier.sendDomainStatusChange({ ... });
    //   }
    //   await db.from('monitors').update({ last_checked_at: new Date() }).eq('id', monitor.id);
    // }

    return NextResponse.json({
      ok: true,
      checked: 0,
      message: 'Cron executed. DB integration pending Phase 6.',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(toApiError(err), { status: 500 });
  }
}
