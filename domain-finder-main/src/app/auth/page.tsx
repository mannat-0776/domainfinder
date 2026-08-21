import { AuthForm } from '@/components/auth/auth-form';

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-surface-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-surface-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-surface-900">Your Domain Finder account</h1>
        <p className="mt-2 mb-6 text-sm text-surface-600">
          Sign in to sync favorites and domain monitors across devices.
        </p>
        <AuthForm />
      </div>
    </main>
  );
}
