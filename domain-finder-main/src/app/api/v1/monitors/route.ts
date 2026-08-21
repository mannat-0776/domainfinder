import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { toApiError } from '@/lib/errors';

const schema = z.object({
  domain: z.string().min(3).max(253),
  checkIntervalHours: z.union([z.literal(1), z.literal(6), z.literal(12), z.literal(24), z.literal(48)]).default(24),
});

async function getUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  try {
    const { supabase, user } = await getUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const { data, error } = await supabase
      .from('monitors')
      .select('*, monitor_events(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return NextResponse.json({ monitors: data ?? [] });
  } catch (error) {
    return NextResponse.json(toApiError(error), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: 'Invalid request' }, { status: 400 });

    const { supabase, user } = await getUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const { data, error } = await supabase
      .from('monitors')
      .upsert({
        user_id: user.id,
        domain: parsed.data.domain.toLowerCase(),
        check_interval_hours: parsed.data.checkIntervalHours,
      }, { onConflict: 'user_id,domain' })
      .select('*')
      .single();
    if (error) throw error;

    return NextResponse.json({ monitor: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiError(error), { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'id is required' }, { status: 400 });

    const { supabase, user } = await getUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const { error } = await supabase.from('monitors').delete().eq('id', id).eq('user_id', user.id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(toApiError(error), { status: 500 });
  }
}
