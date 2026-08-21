import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center px-4"
      >
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 mb-6">
            <Globe size={32} className="text-brand-500" aria-hidden="true" />
          </div>
          <h1 className="text-5xl font-black text-surface-900 mb-2">404</h1>
          <p className="text-xl font-semibold text-surface-700 mb-2">Page not found</p>
          <p className="text-surface-500 mb-8">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/search">
              <Button>Find a name</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Go home</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
