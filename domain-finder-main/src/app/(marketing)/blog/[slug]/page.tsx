import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getPost, getAllPosts } from '@/lib/blog';
import { ArticleSchema } from '@/components/seo/structured-data';
import { Clock, ArrowLeft } from 'lucide-react';
import type { BlogSection } from '@/lib/blog';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

function renderSection(section: BlogSection, idx: number) {
  switch (section.type) {
    case 'h2':
      return <h2 key={idx} className="text-2xl font-bold text-surface-900 mt-10 mb-4">{section.text}</h2>;
    case 'h3':
      return <h3 key={idx} className="text-xl font-semibold text-surface-900 mt-6 mb-3">{section.text}</h3>;
    case 'p':
      return <p key={idx} className="text-surface-700 leading-relaxed mb-4">{section.text}</p>;
    case 'ul':
      return (
        <ul key={idx} className="list-disc list-inside space-y-2 mb-4 text-surface-700">
          {section.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'ol':
      return (
        <ol key={idx} className="list-decimal list-inside space-y-2 mb-4 text-surface-700">
          {section.items?.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      );
    case 'callout':
      return (
        <div key={idx} className="my-6 rounded-xl border border-brand-200 bg-brand-50 px-5 py-4">
          <p className="text-sm text-brand-800 leading-relaxed">{section.text}</p>
        </div>
      );
    case 'tip':
      return (
        <div key={idx} className="my-6 rounded-xl border border-success-500/30 bg-success-50 px-5 py-4">
          <p className="text-xs font-semibold text-success-700 uppercase tracking-wider mb-1">Tip</p>
          <p className="text-sm text-success-800 leading-relaxed">{section.text}</p>
        </div>
      );
    default:
      return null;
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ArticleSchema
        title={post.title}
        description={post.description}
        url={`${BASE}/blog/${post.slug}`}
        datePublished={post.datePublished}
        dateModified={post.dateModified}
        authorName={post.author}
      />

      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 mb-8"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            All articles
          </Link>

          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 text-xs text-surface-400 mb-3">
                <span className="flex items-center gap-1">
                  <Clock size={12} aria-hidden="true" />
                  {post.readingTimeMinutes} min read
                </span>
                <span>
                  {new Date(post.datePublished).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-surface-900 leading-tight">
                {post.title}
              </h1>
              <p className="mt-3 text-lg text-surface-600 leading-relaxed">
                {post.description}
              </p>
            </header>

            <div className="prose-content">
              {post.content.map((section, idx) => renderSection(section, idx))}
            </div>

            <footer className="mt-12 pt-6 border-t border-surface-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-100 px-3 py-1 text-xs text-surface-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-brand-50 border border-brand-200 p-5">
                <p className="text-sm font-semibold text-surface-900 mb-1">
                  Ready to find your startup name?
                </p>
                <p className="text-sm text-surface-600 mb-3">
                  Use Domain Finder to generate names, check availability, and get brand quality scores — free.
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center text-sm font-medium text-brand-600 hover:underline"
                >
                  Start searching →
                </Link>
              </div>
            </footer>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
