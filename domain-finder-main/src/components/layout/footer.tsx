import Link from 'next/link';
import { Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <Globe size={16} className="text-brand-500" aria-hidden="true" />
            <span className="font-medium text-surface-700">Domain Finder</span>
            <span>— Find the perfect startup name.</span>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-4 text-sm text-surface-500">
              <li>
                <Link href="/blog" className="hover:text-surface-700 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-surface-700 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-surface-700 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-surface-400">
          &copy; {new Date().getFullYear()} Domain Finder. Domain availability data is indicative only — always verify before purchase.
        </p>
      </div>
    </footer>
  );
}
