import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { toApiError } from '@/lib/errors';

const schema = z.object({
  candidateId: z.string().min(1),
  notes: z.string().max(500).optional(),
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
      .from('favorites')
      .select('id, candidate_id, notes, created_at, name_candidates(*, domain_checks(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return NextResponse.json({ favorites: data ?? [] });
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
      .from('favorites')
      .upsert({
        user_id: user.id,
        candidate_id: parsed.data.candidateId,
        notes: parsed.data.notes ?? null,
      }, { onConflict: 'user_id,candidate_id' })
      .select('id, candidate_id, notes, created_at, name_candidates(*, domain_checks(*))')
      .single();
    if (error) throw error;

    return NextResponse.json({ favorite: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(toApiError(error), { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const candidateId = request.nextUrl.searchParams.get('candidateId');
    if (!candidateId) return NextResponse.json({ message: 'candidateId is required' }, { status: 400 });

    const { supabase, user } = await getUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('candidate_id', candidateId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(toApiError(error), { status: 500 });
  }
}
