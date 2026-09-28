import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSidebar from '@/pages/admin/components/AdminSidebar';
import AdminTopbar from '@/pages/admin/components/AdminTopbar';
import { AdminToastProvider } from '@/pages/admin/components/AdminToast';

const COLLAPSE_KEY = 'zamin-admin-sidebar-collapsed';

export default function AdminLayout({
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
  const { isAdmin, loading } = useAdminAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-100">
        <div className="flex flex-col items-center gap-3 text-foreground-600">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-700"></i>
          <p className="text-sm font-medium">Checking your access…</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <AdminToastProvider>
      <div className="min-h-screen bg-background-100">
        <div className="flex">
          {/* Desktop sidebar */}
          <aside
            className={`sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block ${
              collapsed ? 'w-[74px]' : 'w-72'
            }`}
          >
            <AdminSidebar collapsed={collapsed} />
          </aside>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="fixed inset-0 z-[70] lg:hidden">
              <div
                className="absolute inset-0 bg-foreground-950/50"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute left-0 top-0 h-full w-72">
                <AdminSidebar collapsed={false} mobile onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <AdminTopbar
              onOpenMenu={() => setMobileOpen(true)}
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed((prev) => !prev)}
            />

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