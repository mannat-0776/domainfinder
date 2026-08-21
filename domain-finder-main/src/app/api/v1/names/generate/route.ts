import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getNameGenerator } from '@/providers/names/factory';
import { getDomainProvider } from '@/providers/domains/factory';
import { computeBrandScore } from '@/services/scoring/brand-score.service';
import { buildRecommendation } from '@/services/recommendation/recommendation.service';
import { toApiError, toStatusCode, ValidationError } from '@/lib/errors';
import { shortId } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { persistSearchSession } from '@/lib/persistence';
import type { NameCandidate, SearchSession, TLD } from '@/types';

const DEFAULT_TLDS: TLD[] = ['.com', '.io', '.co', '.ai'];

const schema = z.object({
  idea:  z.string().min(3).max(500),
  count: z.number().int().min(1).max(10).default(6),
  style: z
    .enum(['invented', 'descriptive', 'metaphor', 'acronym', 'founder', 'compound'])
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid request', parsed.error.flatten());
    }

    const { idea, count, style } = parsed.data;
    const sessionId = shortId();
    let supabase: ReturnType<typeof createClient> | null = null;
    let user: { id: string } | null = null;
    try {
      supabase = createClient();
      const result = await supabase.auth.getUser();
      user = result.data.user;
    } catch {
      // Anonymous generation must also work in tests and without Supabase.
    }

    // 1. Generate names
    const generator = await getNameGenerator();
    const generated = await generator.generate({ idea, count, style });

    // 2. Check domains in parallel for all names x TLDs
    const domainProvider = await getDomainProvider();
    const allDomains = generated.flatMap((g) =>
      DEFAULT_TLDS.map((tld) => `${g.name.toLowerCase()}${tld}`)
    );
    const domainResults = await domainProvider.checkMany(allDomains);

    // 3. Build candidates
    const candidates: NameCandidate[] = generated.map((g) => {
      const candidateDomains = domainResults.filter(
        (d) => d.name === g.name.toLowerCase()
      );
      return {
        id: shortId(),
        sessionId,
        name: g.name,
        rationale: g.rationale,
        style: g.style,
        domains: candidateDomains,
        score: null,
        createdAt: new Date().toISOString(),
      };
    });

    // 4. Score all candidates
    const scores = candidates.map((c) => computeBrandScore(c, idea));
    const scoredCandidates = candidates.map((c, idx) => ({
      ...c,
      score: scores[idx] ?? null,
    }));

    // 5. Build recommendation
    const recommendation = buildRecommendation(scoredCandidates, scores);

    const session: SearchSession = {
      id: sessionId,
      userId: user?.id ?? null,
      ideaText: idea,
      candidates: scoredCandidates,
      recommendation,
      createdAt: new Date().toISOString(),
    };

    if (supabase) await persistSearchSession(supabase, session);

    return NextResponse.json(session);
  } catch (err) {
    return NextResponse.json(toApiError(err), { status: toStatusCode(err) });
  }
}
