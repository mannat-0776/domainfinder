import type { SupabaseClient } from '@supabase/supabase-js';
import type { SearchSession } from '@/types';

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function persistSearchSession(
  supabase: SupabaseClient,
  session: SearchSession
): Promise<void> {
  if (!isConfigured()) return;

  try {
    const { error: sessionError } = await supabase.from('search_sessions').upsert({
      id: session.id,
      user_id: session.userId,
      idea_text: session.ideaText,
      created_at: session.createdAt,
    });
    if (sessionError) throw sessionError;

    const { error: candidatesError } = await supabase.from('name_candidates').upsert(
      session.candidates.map((candidate) => ({
        id: candidate.id,
        session_id: session.id,
        name: candidate.name,
        rationale: candidate.rationale,
        style: candidate.style,
        created_at: candidate.createdAt,
      }))
    );
    if (candidatesError) throw candidatesError;

    const domains = session.candidates.flatMap((candidate) =>
      candidate.domains.map((domain) => ({
        candidate_id: candidate.id,
        domain: domain.domain,
        tld: domain.tld,
        status: domain.status === 'checking' ? 'unknown' : domain.status,
        price_usd: domain.priceUsd,
        price_tier: domain.priceTier,
        registrar: domain.registrar,
        checked_at: domain.checkedAt,
        ttl_seconds: domain.ttlSeconds,
      }))
    );
    if (domains.length) {
      const { error } = await supabase.from('domain_checks').upsert(domains, {
        onConflict: 'candidate_id,domain',
      });
      if (error) throw error;
    }

    const scores = session.candidates
      .filter((candidate) => candidate.score)
      .map((candidate) => {
        const score = candidate.score!;
        return {
          candidate_id: candidate.id,
          overall: score.overall,
          memorability: score.dimensions.memorability.value,
          pronounceability: score.dimensions.pronounceability.value,
          spelling_ease: score.dimensions.spellingEase.value,
          length_score: score.dimensions.length.value,
          dot_com_availability: score.dimensions.dotComAvailability.value,
          trademark_risk: score.dimensions.trademarkRisk.value,
          seo_potential: score.dimensions.seoPotential.value,
          dimensions_json: score.dimensions,
          computed_at: score.computedAt,
        };
      });
    if (scores.length) {
      const { error } = await supabase.from('brand_scores').upsert(scores, {
        onConflict: 'candidate_id',
      });
      if (error) throw error;
    }

    if (session.recommendation) {
      const recommendation = session.recommendation;
      const { error } = await supabase.from('recommendations').upsert({
        session_id: session.id,
        candidate_id: recommendation.candidateId,
        alternative_id: recommendation.alternativeId,
        headline: recommendation.headline,
        reasoning: recommendation.reasoning,
        caveats: recommendation.caveats,
      }, { onConflict: 'session_id' });
      if (error) throw error;
    }
  } catch (error) {
    console.error('Search persistence failed:', error);
  }
}
