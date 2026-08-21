'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { createClient } from '@/lib/supabase/client';

export function Header() {
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setSignedIn(Boolean(user)));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-surface-900 hover:text-brand-600 transition-colors"
            aria-label="Domain Finder home"
          >
            <Globe size={20} className="text-brand-500" aria-hidden="true" />
            <span>Domain Finder</span>
          </Link>

          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  href="/search"
                  className="px-3 py-1.5 text-sm text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  Search
                </Link>
              </li>
              <li>
                {signedIn ? (
                  <SignOutButton />
                ) : (
                  <Link
                    href="/auth"
                    className="px-3 py-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Sign in
                  </Link>
                )}
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="px-3 py-1.5 text-sm text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  href="/monitor"
                  className="px-3 py-1.5 text-sm text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-100 transition-colors"
                >
                  Monitor
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
