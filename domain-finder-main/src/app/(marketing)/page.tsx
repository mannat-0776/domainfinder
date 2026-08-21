import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { WebApplicationSchema, FAQSchema } from '@/components/seo/structured-data';
import { ArrowRight, Zap, Shield, BarChart3, Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Domain Finder — Find the Perfect Startup Name',
  description:
    'Describe your startup idea and instantly discover available domain names with brand quality scores and expert recommendations.',
};

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant domain checks',
    description:
      'Check .com, .io, .co, .ai and more simultaneously. Results stream in as they arrive — no waiting.',
  },
  {
    icon: BarChart3,
    title: 'Brand quality scores',
    description:
      'Every name is scored on memorability, pronounceability, spelling ease, trademark risk, and SEO potential.',
  },
  {
    icon: Shield,
    title: 'Honest recommendations',
    description:
      'We surface trade-offs, not just winners. Know exactly why a name is recommended and what to watch out for.',
  },
  {
    icon: Bell,
    title: 'Domain monitoring',
    description:
      'Watch a taken domain and get notified the moment it becomes available. Never miss your perfect name.',
  },
];

const STEPS = [
  { step: '01', label: 'Describe your idea' },
  { step: '02', label: 'Generate names' },
  { step: '03', label: 'Check domains instantly' },
  { step: '04', label: 'Analyse brand quality' },
  { step: '05', label: 'Compare candidates' },
  { step: '06', label: 'Understand the recommendation' },
  { step: '07', label: 'Save favourites' },
  { step: '08', label: 'Monitor meaningful changes' },
];

const FAQ_ITEMS = [
  {
    question: 'How does Domain Finder generate startup names?',
    answer:
      'Domain Finder uses AI to analyse your idea description and generate name candidates across multiple styles: invented words, metaphors, compound words, and more. Each name comes with a rationale explaining why it fits your idea.',
  },
  {
    question: 'How accurate is the domain availability data?',
    answer:
      'Domain availability is checked in real time via registrar APIs. Results are cached for 5 minutes. Always verify before purchasing — availability can change between check and registration.',
  },
  {
    question: 'What is the brand quality score?',
    answer:
      'Each name is scored across 7 dimensions: memorability, pronounceability, spelling ease, length, .com availability, trademark risk, and SEO potential. Weights are documented and transparent.',
  },
  {
    question: 'Is Domain Finder free to use?',
    answer:
      'Yes. The core search, domain checking, and scoring features are free. No account required to start.',
  },
  {
    question: 'What TLDs does Domain Finder check?',
    answer:
      'By default: .com, .io, .co, and .ai. These cover the most relevant options for modern startups. Additional TLDs can be requested.',
  },
];

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <WebApplicationSchema
        name="Domain Finder"
        description="Find the perfect startup name with AI-generated names, instant domain availability, and brand quality scores."
        url={BASE}
      />
      <FAQSchema items={FAQ_ITEMS} />

      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content">
        {/* Hero */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 py-24 sm:py-32"
          aria-labelledby="hero-heading"
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, #818cf8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 40%)',
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-brand-300 text-sm font-semibold uppercase tracking-widest mb-4">
              The smartest way to name your startup
            </p>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
            >
              Find the best name{' '}
              <span className="text-brand-300">and digital identity</span>{' '}
              you can realistically own.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-brand-200 max-w-2xl mx-auto leading-relaxed">
              Describe your idea. Get AI-generated names, instant domain availability,
              brand quality scores, and an honest recommendation — in seconds.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg">
                  Start for free
                  <ArrowRight size={18} className="ml-1" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-brand-200 hover:text-white hover:bg-white/10"
                >
                  How it works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 bg-white" aria-labelledby="how-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="how-heading" className="text-3xl font-bold text-surface-900">
                From idea to registered domain in minutes
              </h2>
              <p className="mt-3 text-surface-600 max-w-xl mx-auto">
                A structured workflow that answers the question you actually care about:
                what is the best name I can realistically own, and why?
              </p>
            </div>
            <ol className="grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Steps">
              {STEPS.map((s) => (
                <li
                  key={s.step}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-surface-50 border border-surface-100"
                >
                  <span className="text-3xl font-black text-brand-200 tabular-nums">{s.step}</span>
                  <span className="mt-2 text-sm font-medium text-surface-700">{s.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-surface-50" aria-labelledby="features-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 id="features-heading" className="text-3xl font-bold text-surface-900 text-center mb-12">
              Everything you need to choose with confidence
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-2xl bg-white border border-surface-200 p-6 space-y-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50">
                    <f.icon size={20} className="text-brand-500" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-surface-900">{f.title}</h3>
                  <p className="text-sm text-surface-600 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 id="faq-heading" className="text-3xl font-bold text-surface-900 text-center mb-10">
              Frequently asked questions
            </h2>
            <dl className="space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="rounded-xl border border-surface-200 bg-surface-50 p-5">
                  <dt className="font-semibold text-surface-900 mb-2">{item.question}</dt>
                  <dd className="text-sm text-surface-600 leading-relaxed">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-600" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-white">
              Ready to find your name?
            </h2>
            <p className="mt-3 text-brand-200">Free to use. No account required to start.</p>
            <Link href="/search" className="mt-8 inline-block">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg">
                Find my startup name
                <ArrowRight size={18} className="ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
