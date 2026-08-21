import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDomainProvider } from '@/providers/domains/factory';
import { toApiError, toStatusCode, ValidationError } from '@/lib/errors';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  domains: z.array(z.string().min(1)).min(1).max(50),
  monitorId: z.string().uuid().optional(),
});

// Called by the client to refresh monitor statuses.
// Phase 7: this becomes a server-side cron job.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) throw new ValidationError('Invalid request', parsed.error.flatten());

    const provider = await getDomainProvider();
    const results = await provider.checkMany(parsed.data.domains);

    if (parsed.data.monitorId && results[0]) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('monitors')
          .update({
            last_status: results[0].status === 'checking' ? 'unknown' : results[0].status,
            last_checked_at: new Date().toISOString(),
          })
          .eq('id', parsed.data.monitorId)
          .eq('user_id', user.id);
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(toApiError(err), { status: toStatusCode(err) });
  }
}
