import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { SITE } from '@/utils/site';

export default function AdminLoginPage() {
  const { isAdmin, loading, signIn, signUp } = useAdminAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdmin) {
    return <Navigate to="/admin/stays" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);

    if (mode === 'signup') {
      const result = await signUp(email.trim(), password);
      setSubmitting(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.needsConfirmation) {
        setNotice('Account created. Check your email to confirm it, then come back and sign in.');
        setMode('signin');
        return;
      }
      navigate('/admin/stays', { replace: true });
      return;
    }

    const result = await signIn(email.trim(), password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/admin/stays', { replace: true });
  };

  const inputClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3.5 py-3 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';

  return (
    <div className="flex min-h-screen flex-col bg-primary-950">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
          <Link to="/" className="inline-flex items-center" aria-label={`${SITE.brand} home`}>
            <img src={SITE.logo} alt={`${SITE.brand} logo`} className="h-12 w-auto object-contain" />
          </Link>

          <p className="mt-6 font-label text-[11px] font-bold uppercase tracking-[0.18em] text-accent-600">
            ZAMIN Stays
          </p>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950">
            {mode === 'signin' ? 'Admin sign in' : 'Create admin account'}
          </h1>
          <p className="mt-1.5 text-sm text-foreground-600">
            {mode === 'signin'
              ? 'Sign in with your ZAMIN admin account to manage stays, availability and bookings.'
              : 'Set up your ZAMIN admin account. Access is limited to allow-listed admin emails.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@zamin.com"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {notice && (
              <p className="flex items-start gap-2 rounded-md bg-accent-100 px-3 py-2.5 text-sm text-accent-900">
                <i className="ri-mail-check-line mt-0.5"></i>
                {notice}
              </p>
            )}

            {error && (
              <p className="flex items-start gap-2 rounded-md bg-primary-50 px-3 py-2.5 text-sm text-primary-800">
                <i className="ri-error-warning-line mt-0.5"></i>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-foreground-950"
            >
              {submitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-base"></i>
                  {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                <>
                  <i className={mode === 'signin' ? 'ri-lock-2-line text-base' : 'ri-user-add-line text-base'}></i>
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
              setError(null);
              setNotice(null);
            }}
            className="mt-4 cursor-pointer text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            {mode === 'signin' ? 'First time here? Create your admin account' : 'Already have an account? Sign in'}
          </button>

          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-foreground-500">
            <i className="ri-information-line mt-0.5"></i>
            Access is limited to admin accounts on the ZAMIN allow-list. Need access? Contact the site
            owner to be added.
          </p>
        </div>
      </div>
    </div>
  );
}