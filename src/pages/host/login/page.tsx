import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useHostAuth } from '@/hooks/useHostAuth';
import { SITE } from '@/utils/site';

export default function HostLoginPage() {
  const { signIn, signUp, isHost, loading } = useHostAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/host/dashboard';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && isHost) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }

    setBusy(true);
    if (mode === 'signin') {
      const result = await signIn(email.trim(), password);
      if (result.error) setError(result.error);
    } else {
      const result = await signUp(email.trim(), password);
      if (result.error) setError(result.error);
      else if (result.needsConfirmation) {
        setNotice('Check your inbox to confirm your email, then sign in.');
        setMode('signin');
      }
    }
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-100">
      <header className="px-4 py-5 md:px-6">
        <Link to="/stays" className="inline-flex items-center gap-2.5">
          <img src={SITE.logo} alt={`${SITE.brand} logo`} className="h-9 w-auto object-contain" />
          <span className="font-heading text-sm font-bold text-foreground-950">ZAMIN Stays</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-800">
            <i className="ri-home-heart-line text-2xl"></i>
          </span>
          <h1 className="mt-4 font-heading text-2xl font-bold text-foreground-950">
            {mode === 'signin' ? 'Host sign in' : 'Create your host account'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-foreground-600">
            {mode === 'signin'
              ? 'Sign in to manage your listings, calendar and earnings.'
              : 'Use the email address that is linked to your ZAMIN Stays listings.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-foreground-800">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none"
                autoComplete="email"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-foreground-800">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </label>

            {error && (
              <p className="flex items-start gap-2 rounded-md bg-accent-50 px-3 py-2.5 text-sm text-accent-800">
                <i className="ri-error-warning-line mt-0.5"></i>
                {error}
              </p>
            )}
            {notice && (
              <p className="flex items-start gap-2 rounded-md bg-secondary-100 px-3 py-2.5 text-sm text-secondary-900">
                <i className="ri-mail-check-line mt-0.5"></i>
                {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-foreground-950"
            >
              {busy && <i className="ri-loader-4-line animate-spin"></i>}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
              setError(null);
              setNotice(null);
            }}
            className="mt-5 cursor-pointer text-sm font-semibold text-primary-700 hover:underline"
          >
            {mode === 'signin' ? 'First time here? Create your host account' : 'Already have an account? Sign in'}
          </button>

          <p className="mt-6 border-t border-background-100 pt-4 text-xs text-foreground-500">
            Not a host yet?{' '}
            <Link to="/stays/host/apply" className="font-semibold text-primary-700 hover:underline">
              Apply to host with ZAMIN Stays
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}