import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ADMIN_NAV, isNavActive } from '@/pages/admin/adminNav';
import { SITE } from '@/utils/site';

export default function AdminSidebar({
  collapsed,
  onNavigate,
  mobile = false,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  mobile?: boolean;
}) {
  const location = useLocation();
  const isCollapsed = collapsed && !mobile;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ADMIN_NAV.forEach((group) => {
      initial[group.id] = true;
    });
    return initial;
  });

  useEffect(() => {
    const active = ADMIN_NAV.find((group) => group.items.some((item) => isNavActive(location.pathname, item.to)));
    if (active) setOpenGroups((prev) => ({ ...prev, [active.id]: true }));
  }, [location.pathname]);

  const toggle = (id: string) => setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex h-full flex-col bg-primary-950">
      <div className={`flex items-center gap-2.5 px-4 py-5 ${isCollapsed ? 'justify-center' : ''}`}>
        {isCollapsed ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-500 font-heading text-lg font-bold text-primary-950">
            Z
          </span>
        ) : (
          <>
            <img
              src={SITE.logo}
              alt={`${SITE.brand} logo`}
              className="h-9 w-auto object-contain brightness-0 invert"
            />
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold text-background-50">ZAMIN Admin</p>
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-accent-300">
                Stays &amp; Real Estate
              </p>
            </div>
          </>
        )}
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        {ADMIN_NAV.map((group) => {
          const isOpen = openGroups[group.id];
          const groupActive = group.items.some((item) => isNavActive(location.pathname, item.to));
          return (
            <div key={group.id} className="mb-1.5">
              {group.label && !isCollapsed && (
                <button
                  type="button"
                  onClick={() => toggle(group.id)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-2 text-left font-label text-[10px] font-bold uppercase tracking-[0.16em] text-background-400 transition-colors hover:text-background-200"
                >
                  <span>{group.label}</span>
                  <i className={`ri-arrow-down-s-line text-sm transition-transform ${isOpen ? '' : '-rotate-90'}`}></i>
                </button>
              )}
              {group.label && isCollapsed && <div className="mx-2 my-2 border-t border-primary-900" />}

              {(!group.label || isOpen || isCollapsed) && (
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const active = isNavActive(location.pathname, item.to);
                    return (
                      <Link
                        key={`${group.id}-${item.to}`}
                        to={item.to}
                        onClick={onNavigate}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isCollapsed ? 'justify-center' : ''
                        } ${
                          active
                            ? 'bg-accent-500 text-primary-950'
                            : 'text-background-300 hover:bg-primary-900 hover:text-background-50'
                        } ${groupActive && !active ? 'text-background-200' : ''}`}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                          <i className={`${item.icon} text-lg`}></i>
                        </span>
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-primary-900 px-3 py-3">
        <Link
          to="/stays"
          onClick={onNavigate}
          title={isCollapsed ? 'View public site' : undefined}
          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-background-300 transition-colors hover:bg-primary-900 hover:text-background-50 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <span className="flex h-5 w-5 items-center justify-center">
            <i className="ri-external-link-line text-lg"></i>
          </span>
          {!isCollapsed && 'View public site'}
        </Link>
      </div>
    </div>
  );
}