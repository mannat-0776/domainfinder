import * as React from 'react';
import type { Recommendation, NameCandidate } from '@/types';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface RecommendationBannerProps {
  recommendation: Recommendation;
  candidate: NameCandidate;
}

export function RecommendationBanner({
  recommendation,
  candidate,
}: RecommendationBannerProps) {
  return (
    <section
      className="rounded-2xl border border-brand-200 bg-brand-50 p-5 space-y-3"
      aria-label="Our recommendation"
    >
      <div>
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
          Our Recommendation
        </p>
        <h2 className="text-xl font-bold text-surface-900 mt-0.5">
          {candidate.name} —{' '}
          <span className="text-brand-600">{recommendation.headline}</span>
        </h2>
      </div>

      {recommendation.reasoning.length > 0 && (
        <ul className="space-y-1.5" aria-label="Reasons">
          {recommendation.reasoning.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-surface-700">
              <CheckCircle
                size={15}
                className="text-success-500 mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              {reason}
            </li>
          ))}
        </ul>
      )}

      {recommendation.caveats.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-warning-700 uppercase tracking-wider mb-1.5">
            Trade-offs to consider
          </p>
          <ul className="space-y-1.5">
            {recommendation.caveats.map((caveat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                <AlertTriangle
                  size={15}
                  className="text-warning-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                {caveat}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
