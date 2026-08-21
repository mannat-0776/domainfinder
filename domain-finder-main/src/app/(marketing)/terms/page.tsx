import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using Domain Finder.',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-surface-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-6 text-surface-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Acceptance</h2>
              <p>
                By using Domain Finder, you agree to these terms. If you do not agree, do not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Service description</h2>
              <p>
                Domain Finder provides startup name generation, domain availability checking, brand scoring,
                and related tools. Domain availability data is indicative only — always verify before purchasing.
                We are not a domain registrar and do not process domain purchases.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Acceptable use</h2>
              <p>
                You may not use Domain Finder to scrape data, circumvent rate limits, or generate names
                intended to infringe existing trademarks. Automated access beyond normal use requires
                written permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Disclaimer</h2>
              <p>
                Brand scores and recommendations are informational only. They do not constitute legal,
                trademark, or business advice. Always consult a qualified professional before registering
                a trademark or making significant business decisions based on our output.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Limitation of liability</h2>
              <p>
                Domain Finder is provided &ldquo;as is&rdquo; without warranty. We are not liable for
                any loss arising from reliance on domain availability data, brand scores, or name recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Changes</h2>
              <p>
                We may update these terms at any time. Continued use after changes constitutes acceptance.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
