import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  BookingStatusBadge,
  EmptyState,
  ErrorState,
  LoadingBlock,
  Pagination,
  Segmented,
  btnGhost,
  btnPrimary,
  btnSmall,
  inputClass,
  selectClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from '@/pages/admin/components/AdminUI';
import { useBookings } from '@/hooks/useBookings';
import { formatPKR } from '@/utils/stays';
import { PAYMENT_STATUS_META, locationOfBooking, paymentStatusOf } from '@/utils/stayOps';
import { updateBookingStatus } from '@/utils/stayAdmin';
import type { Booking, BookingStatus } from '@/types/stays';

const PAGE_SIZE = 10;

const PAY_TONE = { PAID: 'primary', PENDING: 'secondary', FAILED: 'muted', REFUNDED: 'muted' } as const;

const FILTERS: { value: BookingStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CHECKED_IN', label: 'Checked in' },
  { value: 'CHECKED_OUT', label: 'Checked out' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
];

const NEXT_ACTIONS: Partial<Record<BookingStatus, { label: string; icon: string; next: BookingStatus }[]>> = {
  PENDING: [
    { label: 'Confirm', icon: 'ri-check-line', next: 'CONFIRMED' },
    { label: 'Cancel', icon: 'ri-close-line', next: 'CANCELLED' },
  ],
  AWAITING_PAYMENT: [
    { label: 'Confirm', icon: 'ri-check-line', next: 'CONFIRMED' },
    { label: 'Cancel', icon: 'ri-close-line', next: 'CANCELLED' },
  ],
  CONFIRMED: [
    { label: 'Check in', icon: 'ri-login-circle-line', next: 'CHECKED_IN' },
    { label: 'Cancel', icon: 'ri-close-line', next: 'CANCELLED' },
  ],
  CHECKED_IN: [{ label: 'Check out', icon: 'ri-logout-circle-line', next: 'CHECKED_OUT' }],
  CANCELLED: [{ label: 'Mark refunded', icon: 'ri-refund-2-line', next: 'REFUNDED' }],
};

export default function AdminBookingsPage() {
  const { bookings, loading, error, refetch } = useBookings();
  const { notify } = useAdminToast();
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('ALL');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);

  const destinations = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((booking) => {
      if (booking.stay?.destination?.name) set.add(booking.stay.destination.name);
    });
    return [...set];
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (filter !== 'ALL' && booking.status !== filter) return false;
      if (destination !== 'ALL' && booking.stay?.destination?.name !== destination) return false;
      if (from && booking.check_in < from) return false;
      if (to && booking.check_in > to) return false;
      if (q) {
        const haystack = `${booking.reference} ${booking.guest_name} ${booking.guest_phone} ${booking.guest_email ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [bookings, filter, destination, from, to, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const advance = async (booking: Booking, status: BookingStatus) => {
    setBusyId(booking.id);
    try {
      await updateBookingStatus(booking.id, status);
      await refetch();
      notify({ title: `Booking ${status.toLowerCase()}`, message: booking.reference, tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not update booking', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout
      title="Bookings"
      subtitle="Manage all ZAMIN Stays reservations."
      actions={
        <Link to="/admin/calendar" className={btnPrimary}>
          <i className="ri-calendar-2-line text-base"></i> Calendar
        </Link>
      }
    >
      <div className="mb-4 flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
              <i className="ri-search-line text-base"></i>
            </span>
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search booking, guest, phone" className={`${inputClass} pl-9`} />
          </div>
          <select className={selectClass} value={destination} onChange={(event) => { setDestination(event.target.value); setPage(1); }}>
            <option value="ALL">All destinations</option>
            {destinations.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <input type="date" className={inputClass} value={from} onChange={(event) => { setFrom(event.target.value); setPage(1); }} aria-label="Check-in from" />
          <input type="date" className={inputClass} value={to} onChange={(event) => { setTo(event.target.value); setPage(1); }} aria-label="Check-in to" />
        </div>
        <Segmented options={FILTERS.map((item) => ({ value: item.value, label: item.label }))} value={filter} onChange={(value) => { setFilter(value as BookingStatus | 'ALL'); setPage(1); }} />
      </div>

      {loading ? (
        <LoadingBlock rows={8} />
      ) : error ? (
        <ErrorState message="Couldn’t load bookings." onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="ri-calendar-check-line"
          title={bookings.length === 0 ? 'No bookings yet.' : 'No bookings match your filters.'}
          message={bookings.length === 0 ? 'Reservations made on the site will appear here.' : 'Try adjusting the search or date range.'}
          action={
            bookings.length > 0 ? (
              <button type="button" onClick={() => { setSearch(''); setFilter('ALL'); setDestination('ALL'); setFrom(''); setTo(''); }} className={btnGhost}>
                <i className="ri-close-line text-base"></i> Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Booking</th>
                <th className={thClass}>Stay</th>
                <th className={thClass}>Guest</th>
                <th className={thClass}>Check-in</th>
                <th className={thClass}>Check-out</th>
                <th className={thClass}>Nights</th>
                <th className={thClass}>Guests</th>
                <th className={thClass}>Total</th>
                <th className={thClass}>Payment</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((booking) => {
                const payStatus = paymentStatusOf(booking.status);
                const pay = PAYMENT_STATUS_META[payStatus];
                const actions = NEXT_ACTIONS[booking.status] ?? [];
                const busy = busyId === booking.id;
                return (
                  <tr key={booking.id} className="border-t border-background-100 align-top">
                    <td className={tdClass}>
                      <Link to={`/admin/bookings/${booking.id}`} className="font-mono text-xs font-semibold text-foreground-900 hover:text-primary-700">
                        {booking.reference}
                      </Link>
                      <p className="mt-0.5 text-xs text-foreground-500">{locationOfBooking(booking)}</p>
                    </td>
                    <td className={`${tdClass} text-foreground-700`}>{booking.stay?.title ?? '—'}</td>
                    <td className={tdClass}>
                      <p className="font-medium text-foreground-900">{booking.guest_name}</p>
                      <p className="text-xs text-foreground-500">{booking.guest_phone}</p>
                    </td>
                    <td className={`${tdClass} text-foreground-700`}>{booking.check_in}</td>
                    <td className={`${tdClass} text-foreground-700`}>{booking.check_out}</td>
                    <td className={`${tdClass} text-foreground-600`}>{booking.nights}</td>
                    <td className={`${tdClass} text-foreground-600`}>{booking.guests}</td>
                    <td className={`${tdClass} font-semibold text-primary-700`}>{formatPKR(booking.total, booking.currency)}</td>
                    <td className={tdClass}>
                      <Badge tone={PAY_TONE[payStatus]} icon={pay.icon}>
                        {pay.label}
                      </Badge>
                    </td>
                    <td className={tdClass}><BookingStatusBadge status={booking.status} /></td>
                    <td className={tdClass}>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Link to={`/admin/bookings/${booking.id}`} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                          <i className="ri-eye-line"></i> View
                        </Link>
                        {actions.map((action) => (
                          <button key={action.next} type="button" disabled={busy} onClick={() => advance(booking, action.next)} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                            <i className={action.icon}></i> {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination page={current} pageCount={pageCount} onPage={setPage} total={filtered.length} />
        </div>
      )}
    </AdminLayout>
  );
}