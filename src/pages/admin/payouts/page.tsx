import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import {
  Badge,
  EmptyState,
  ErrorState,
  LoadingBlock,
  StatCard,
  btnGhost,
  btnSmall,
  inputClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from '@/pages/admin/components/AdminUI';
import { useBookings } from '@/hooks/useBookings';
import { formatPKR } from '@/utils/stays';
import { commissionOf, hostNetOf, payoutStatusOf } from '@/utils/stayOps';

const PAYOUT_META = {
  PENDING: { label: 'Pending', tone: 'accent' as const, icon: 'ri-time-line' },
  SCHEDULED: { label: 'Scheduled', tone: 'secondary' as const, icon: 'ri-calendar-line' },
} as const;

export default function AdminPayoutsPage() {
  const { bookings, loading, error, refetch } = useBookings();
  const [search, setSearch] = useState('');

  const rows = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === 'CHECKED_OUT' || booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN')
        .sort((a, b) => b.check_out.localeCompare(a.check_out)),
    [bookings],
  );

  const summary = useMemo(() => {
    let pending = 0;
    let scheduled = 0;
    rows.forEach((booking) => {
      const status = payoutStatusOf(booking.status);
      if (status === 'PENDING') pending += hostNetOf(booking);
      if (status === 'SCHEDULED') scheduled += hostNetOf(booking);
    });
    return { pending, scheduled };
  }, [rows]);

  const q = search.trim().toLowerCase();
  const filtered = rows.filter((booking) =>
    q ? `${booking.stay?.title ?? ''} ${booking.reference}`.toLowerCase().includes(q) : true,
  );

  return (
    <AdminLayout
      title="Payouts"
      subtitle="Host settlement amounts derived from completed stays."
      actions={
        <Link to="/admin/settings" className={btnGhost}>
          <i className="ri-settings-3-line text-base"></i> Commission settings
        </Link>
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pending Payouts" value={formatPKR(summary.pending)} icon="ri-time-line" tone="accent" hint="Completed stays awaiting settlement" />
        <StatCard label="Scheduled Payouts" value={formatPKR(summary.scheduled)} icon="ri-calendar-line" hint="Upcoming & in-progress stays" />
        <StatCard label="Failed Payouts" value={formatPKR(0)} icon="ri-error-warning-line" hint="No failed settlements" />
      </div>

      <div className="mb-4 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="relative md:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
            <i className="ri-search-line text-base"></i>
          </span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search host / booking" className={`${inputClass} pl-9`} />
        </div>
      </div>

      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load payouts." onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="ri-hand-coin-line"
          title="No pending payouts."
          message="Host payouts appear here once stays are completed."
        />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Host</th>
                <th className={thClass}>Booking</th>
                <th className={thClass}>Booking Value</th>
                <th className={thClass}>ZAMIN Commission</th>
                <th className={thClass}>Deductions</th>
                <th className={thClass}>Host Net</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Payout Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const status = payoutStatusOf(booking.status);
                if (status === 'NOT_DUE') return null;
                const meta = PAYOUT_META[status];
                return (
                  <tr key={booking.id} className="border-t border-background-100 align-top">
                    <td className={`${tdClass} text-foreground-900`}>
                      {booking.stay?.title ? (
                        <Link to={`/admin/stays/${booking.stay.id}`} className="font-medium hover:text-primary-700">
                          {booking.stay.title}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className={tdClass}>
                      <Link to={`/admin/bookings/${booking.id}`} className="font-mono text-xs font-semibold text-foreground-900 hover:text-primary-700">
                        {booking.reference}
                      </Link>
                    </td>
                    <td className={`${tdClass} font-medium text-foreground-900`}>{formatPKR(booking.total, booking.currency)}</td>
                    <td className={`${tdClass} text-primary-700`}>{formatPKR(commissionOf(booking), booking.currency)}</td>
                    <td className={`${tdClass} text-foreground-500`}>{formatPKR(0, booking.currency)}</td>
                    <td className={`${tdClass} font-semibold text-foreground-950`}>{formatPKR(hostNetOf(booking), booking.currency)}</td>
                    <td className={tdClass}><Badge tone={meta.tone} icon={meta.icon}>{meta.label}</Badge></td>
                    <td className={`${tdClass} text-xs text-foreground-500`}>—</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 text-xs text-foreground-500">
        <i className="ri-information-line mt-0.5"></i>
        Host net = booking total − ZAMIN commission (service fee). Settlement runs through your configured payment rail.
      </p>

      <div className="mt-4">
        <Link to="/admin/payments" className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
          <i className="ri-bank-card-line"></i> View payments
        </Link>
      </div>
    </AdminLayout>
  );
}