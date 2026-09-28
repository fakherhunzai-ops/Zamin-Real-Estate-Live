import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { ADMIN_QUICK_ADD } from '@/pages/admin/adminNav';

type SearchStay = { id: string; title: string; slug: string; status: string };
type SearchBooking = { id: string; reference: string; guest_name: string; guest_phone: string };

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onOutside]);
  return ref;
}

const TONE_DOT: Record<string, string> = {
  info: 'bg-secondary-500',
  warn: 'bg-accent-500',
  urgent: 'bg-accent-600',
};

export default function AdminTopbar({
  onOpenMenu,
  collapsed,
  onToggleCollapse,
}: {
  onOpenMenu: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const navigate = useNavigate();
  const { user, signOut } = useAdminAuth();
  const { notifications, count } = useAdminNotifications();

  const [query, setQuery] = useState('');
  const [stays, setStays] = useState<SearchStay[]>([]);
  const [bookings, setBookings] = useState<SearchBooking[]>([]);
  const [searchLoaded, setSearchLoaded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [openPanel, setOpenPanel] = useState<'none' | 'notifications' | 'quick' | 'profile'>('none');

  const searchRef = useClickOutside<HTMLDivElement>(() => setSearchOpen(false));
  const notifRef = useClickOutside<HTMLDivElement>(() => setOpenPanel((p) => (p === 'notifications' ? 'none' : p)));
  const quickRef = useClickOutside<HTMLDivElement>(() => setOpenPanel((p) => (p === 'quick' ? 'none' : p)));
  const profileRef = useClickOutside<HTMLDivElement>(() => setOpenPanel((p) => (p === 'profile' ? 'none' : p)));

  const loadSearchData = async () => {
    if (searchLoaded) return;
    setSearchLoaded(true);
    const [stayRes, bookingRes] = await Promise.all([
      supabase.from('stays').select('id,title,slug,status').order('created_at', { ascending: false }).limit(200),
      supabase.from('bookings').select('id,reference,guest_name,guest_phone').order('created_at', { ascending: false }).limit(200),
    ]);
    setStays((stayRes.data as SearchStay[]) ?? []);
    setBookings((bookingRes.data as SearchBooking[]) ?? []);
  };

  const trimmed = query.trim().toLowerCase();
  const stayResults = trimmed
    ? stays.filter((stay) => stay.title.toLowerCase().includes(trimmed) || stay.slug.includes(trimmed)).slice(0, 5)
    : [];
  const bookingResults = trimmed
    ? bookings
        .filter(
          (booking) =>
            booking.reference.toLowerCase().includes(trimmed) ||
            booking.guest_name.toLowerCase().includes(trimmed) ||
            (booking.guest_phone ?? '').includes(trimmed),
        )
        .slice(0, 5)
    : [];
  const hasResults = stayResults.length > 0 || bookingResults.length > 0;

  const goTo = (to: string) => {
    setQuery('');
    setSearchOpen(false);
    navigate(to);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-background-200 bg-background-50/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-700 lg:hidden"
          aria-label="Open menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-700 transition-colors hover:bg-background-100 lg:flex"
          aria-label="Toggle sidebar"
        >
          <i className={`${collapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'} text-xl`}></i>
        </button>

        {/* Global search */}
        <div ref={searchRef} className="relative min-w-0 flex-1 max-w-xl">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
            <i className="ri-search-line text-base"></i>
          </span>
          <input
            type="search"
            value={query}
            onFocus={() => {
              setSearchOpen(true);
              void loadSearchData();
            }}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search stays, bookings, guests…"
            className="w-full rounded-md border border-background-300 bg-background-50 py-2.5 pl-9 pr-3 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none"
          />
          {searchOpen && trimmed && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-card border border-background-200 bg-background-50 shadow-none">
              {!hasResults ? (
                <p className="px-4 py-6 text-center text-sm text-foreground-500">No matches for “{query}”.</p>
              ) : (
                <div className="max-h-80 overflow-y-auto py-1">
                  {stayResults.length > 0 && (
                    <>
                      <p className="px-4 py-2 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-400">
                        Stays
                      </p>
                      {stayResults.map((stay) => (
                        <button
                          key={stay.id}
                          type="button"
                          onClick={() => goTo(`/admin/stays/${stay.id}`)}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-background-100"
                        >
                          <span className="flex h-6 w-6 items-center justify-center text-foreground-500">
                            <i className="ri-home-4-line"></i>
                          </span>
                          <span className="min-w-0 flex-1 truncate text-sm text-foreground-900">{stay.title}</span>
                          <span className="text-[11px] font-semibold uppercase text-foreground-400">{stay.status}</span>
                        </button>
                      ))}
                    </>
                  )}
                  {bookingResults.length > 0 && (
                    <>
                      <p className="px-4 py-2 font-label text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-400">
                        Bookings
                      </p>
                      {bookingResults.map((booking) => (
                        <button
                          key={booking.id}
                          type="button"
                          onClick={() => goTo(`/admin/bookings/${booking.id}`)}
                          className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-background-100"
                        >
                          <span className="flex h-6 w-6 items-center justify-center text-foreground-500">
                            <i className="ri-calendar-check-line"></i>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-foreground-900">{booking.guest_name}</span>
                            <span className="block truncate text-xs text-foreground-500">{booking.reference}</span>
                          </span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-background-300 px-3 py-1.5 text-[11px] font-semibold text-foreground-600 xl:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          {import.meta.env.DEV ? 'Staging' : 'Live'}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {/* Quick add */}
          <div ref={quickRef} className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel((p) => (p === 'quick' ? 'none' : 'quick'))}
              className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md bg-primary-800 px-3 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
            >
              <i className="ri-add-line text-base"></i>
              <span className="hidden sm:inline">Quick add</span>
              <i className="ri-arrow-down-s-line text-base"></i>
            </button>
            {openPanel === 'quick' && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-card border border-background-200 bg-background-50 py-1">
                {ADMIN_QUICK_ADD.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpenPanel('none')}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-800 transition-colors hover:bg-background-100"
                  >
                    <span className="flex h-4 w-4 items-center justify-center text-accent-600">
                      <i className={`${item.icon} text-base`}></i>
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel((p) => (p === 'notifications' ? 'none' : 'notifications'))}
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-700 transition-colors hover:bg-background-100"
              aria-label="Notifications"
            >
              <i className="ri-notification-3-line text-lg"></i>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-primary-950">
                  {count}
                </span>
              )}
            </button>
            {openPanel === 'notifications' && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-card border border-background-200 bg-background-50">
                <div className="border-b border-background-100 px-4 py-3">
                  <p className="font-heading text-sm font-semibold text-foreground-950">Notifications</p>
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-foreground-500">You&apos;re all caught up.</p>
                ) : (
                  <div className="max-h-80 overflow-y-auto py-1">
                    {notifications.map((item) => (
                      <Link
                        key={item.id}
                        to={item.to}
                        onClick={() => setOpenPanel('none')}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-background-100"
                      >
                        <span className="mt-1 flex h-4 w-4 items-center justify-center">
                          <span className={`h-2 w-2 rounded-full ${TONE_DOT[item.tone]}`} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground-900">{item.title}</span>
                          <span className="block text-xs text-foreground-500">{item.message}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel((p) => (p === 'profile' ? 'none' : 'profile'))}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-background-300 py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-background-100"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-800 font-heading text-sm font-bold text-background-50">
                {(user?.email ?? 'A').charAt(0).toUpperCase()}
              </span>
              <i className="ri-arrow-down-s-line hidden text-base text-foreground-500 sm:block"></i>
            </button>
            {openPanel === 'profile' && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-card border border-background-200 bg-background-50">
                <div className="border-b border-background-100 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground-950">Signed in</p>
                  <p className="truncate text-xs text-foreground-500">{user?.email}</p>
                </div>
                <Link
                  to="/admin/settings"
                  onClick={() => setOpenPanel('none')}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-800 transition-colors hover:bg-background-100"
                >
                  <i className="ri-settings-3-line text-base text-foreground-500"></i> Settings
                </Link>
                <Link
                  to="/stays"
                  onClick={() => setOpenPanel('none')}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-800 transition-colors hover:bg-background-100"
                >
                  <i className="ri-external-link-line text-base text-foreground-500"></i> View public site
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpenPanel('none');
                    void signOut();
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 border-t border-background-100 px-4 py-2.5 text-left text-sm font-semibold text-primary-800 transition-colors hover:bg-background-100"
                >
                  <i className="ri-logout-box-r-line text-base"></i> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}