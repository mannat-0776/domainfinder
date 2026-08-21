'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export function AuthForm() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = React.useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const result = mode === 'sign-in'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === 'sign-up' && !result.data.session) {
      setMessage('Account created. Check your email to confirm your account.');
      return;
    }

    router.push('/search');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
        minLength={6}
        required
      />
      {error && <p role="alert" className="text-sm text-danger-600">{error}</p>}
      {message && <p role="status" className="text-sm text-brand-700">{message}</p>}
      <Button type="submit" loading={loading} className="w-full">
        {mode === 'sign-in' ? 'Sign in' : 'Create account'}
      </Button>
      <button
        type="button"
        onClick={() => {
          setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
          setError(null);
          setMessage(null);
        }}
        className="w-full text-sm text-brand-600 hover:underline"
      >
        {mode === 'sign-in' ? 'Create a new account' : 'Already have an account? Sign in'}
      </button>
    </form>
  );
}
