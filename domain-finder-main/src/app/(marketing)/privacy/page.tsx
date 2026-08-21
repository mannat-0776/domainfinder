import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Domain Finder collects, uses, and protects your data.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-surface-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose-content space-y-6 text-surface-700 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">What we collect</h2>
              <p>
                When you use Domain Finder, we collect the idea text you enter, the names generated,
                and domain availability results. Anonymous sessions are not linked to any personal identity.
                If you create an account, we store your email address and saved favourites.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">How we use it</h2>
              <p>
                We use your data solely to provide the service: generating names, checking domains,
                computing scores, and enabling favourites and monitoring. We do not sell your data.
                We do not use your idea descriptions to train AI models.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Third-party services</h2>
              <p>
                Domain availability is checked via registrar APIs (GoDaddy or Namecheap).
                Name generation uses OpenAI or Anthropic APIs. These providers have their own
                privacy policies. We send only the minimum data required (domain names, idea text).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Local storage</h2>
              <p>
                Favourites and domain monitors are stored in your browser&apos;s localStorage.
                Search sessions are stored in sessionStorage. This data never leaves your device
                unless you are signed in, in which case it is synced to our database.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Your rights</h2>
              <p>
                You may request deletion of your account and all associated data at any time
                by contacting us. Anonymous session data is automatically purged after 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Contact</h2>
              <p>
                Questions about this policy? Email us at{' '}
                <a href="mailto:privacy@domainfinder.app" className="text-brand-600 hover:underline">
                  privacy@domainfinder.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
