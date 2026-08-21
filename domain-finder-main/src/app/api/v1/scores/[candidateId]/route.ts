import { NextRequest, NextResponse } from 'next/server';
import { toApiError, NotFoundError } from '@/lib/errors';

// In Phase 6 this will query the database.
// For now it returns a 404 — scores are embedded in the generate response.
export async function GET(
  _req: NextRequest,
  { params }: { params: { candidateId: string } }
) {
  try {
    // TODO Phase 6: fetch from DB
    throw new NotFoundError(`Score for candidate ${params.candidateId}`);
  } catch (err) {
    return NextResponse.json(toApiError(err), { status: 404 });
  }
}
