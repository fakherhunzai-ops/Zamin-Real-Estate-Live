import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useHostAuth } from '@/hooks/useHostAuth';
import { AdminToastProvider } from '@/pages/admin/components/AdminToast';
import { SITE } from '@/utils/site';

const HOST_NAV = [
  { label: 'Dashboard', to: '/host/dashboard', icon: 'ri-dashboard-3-line' },
  { label: 'My Listings', to: '/host/stays', icon: 'ri-home-4-line' },
  { label: 'My Calendar', to: '/host/calendar', icon: 'ri-calendar-2-line' },
];

export default function HostLayout({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, isHost, loading, signOut } = useHostAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-100">
        <div className="flex flex-col items-center gap-3 text-foreground-600">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-700"></i>
          <p className="text-sm font-medium">Checking your host access…</p>
        </div>
      </div>
    );
  }

  if (!isHost) {
    return <Navigate to="/host/login" replace state={{ from: location.pathname }} />;
  }

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {HOST_NAV.map((item) => {
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-accent-500 text-primary-950'
                : 'text-background-300 hover:bg-primary-900 hover:text-background-50'
            }`}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              <i className={`${item.icon} text-lg`}></i>
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-2.5 px-4 py-5">
      <img src={SITE.logo} alt={`${SITE.brand} logo`} className="h-9 w-auto object-contain brightness-0 invert" />
      <div className="min-w-0">
        <p className="font-heading text-sm font-bold text-background-50">Host Portal</p>
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-accent-300">ZAMIN Stays</p>
      </div>
    </div>
  );

  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-background-100">
        <div className="flex">
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-primary-950 lg:flex">
            {brand}
            {nav}
            <div className="mt-auto flex flex-col gap-1 border-t border-primary-900 px-3 py-3">
              <Link
                to="/stays"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-background-300 transition-colors hover:bg-primary-900 hover:text-background-50"
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  <i className="ri-external-link-line text-lg"></i>
                </span>
                View public site
              </Link>
            </div>
          </aside>

          {mobileOpen && (
            <div className="fixed inset-0 z-[70] lg:hidden">
              <div className="absolute inset-0 bg-foreground-950/50" onClick={() => setMobileOpen(false)} aria-hidden="true" />
              <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-primary-950">
                {brand}
                {nav}
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-40 border-b border-background-200 bg-background-50/95 backdrop-blur">
              <div className="flex items-center gap-3 px-4 py-3 md:px-6">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-700 lg:hidden"
                  aria-label="Open menu"
                >
                  <i className="ri-menu-line text-xl"></i>
                </button>
                <p className="min-w-0 flex-1 truncate font-heading text-sm font-semibold text-foreground-950 md:text-base">
                  ZAMIN Stays · Host
                </p>
                <span className="hidden items-center gap-1.5 rounded-full border border-background-300 px-3 py-1.5 text-[11px] font-semibold text-foreground-600 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                  {user?.email}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    void signOut().then(() => navigate('/host/login'));
                  }}
                  className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-3 py-2 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100"
                >
                  <i className="ri-logout-box-r-line text-base"></i>
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            </header>

            <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">{title}</h1>
                  {subtitle && <p className="mt-1 text-sm text-foreground-600">{subtitle}</p>}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
              </div>
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminToastProvider>
  );
}