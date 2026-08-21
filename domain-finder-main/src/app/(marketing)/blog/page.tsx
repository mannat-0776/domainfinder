import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getAllPosts } from '@/lib/blog';
import { Clock, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — Startup Naming & Domain Strategy',
  description:
    'Practical guides on startup naming, domain strategy, brand quality, and building a digital identity that lasts.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-surface-900">Blog</h1>
            <p className="mt-2 text-surface-600">
              Practical guides on startup naming, domain strategy, and brand building.
            </p>
          </header>

          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-surface-200 bg-white p-6 hover:shadow-sm transition-shadow"
              >
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-xl font-bold text-surface-900 group-hover:text-brand-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2 text-surface-600 text-sm leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-surface-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} aria-hidden="true" />
                    {post.readingTimeMinutes} min read
                  </span>
                  <span>{new Date(post.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag size={12} aria-hidden="true" />
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-surface-100 rounded px-1.5 py-0.5">{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
