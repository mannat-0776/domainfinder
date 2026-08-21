'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  React.useEffect(() => {
    // Log to error reporting service in production
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-danger-50 mb-6">
          <AlertTriangle size={32} className="text-danger-500" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Something went wrong</h1>
        <p className="text-surface-600 mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="text-left text-xs bg-surface-100 rounded-xl p-4 mb-6 overflow-auto text-danger-700">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/')}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
