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
import { PAYMENT_STATUS_META, paymentStatusOf } from '@/utils/stayOps';

const PAY_TONE = { PAID: 'primary', PENDING: 'secondary', FAILED: 'muted', REFUNDED: 'muted' } as const;

export default function AdminPaymentsPage() {
  const { bookings, loading, error, refetch } = useBookings();
  const [search, setSearch] = useState('');

  const summary = useMemo(() => {
    let paid = 0;
    let pending = 0;
    let refunded = 0;
    bookings.forEach((booking) => {
      const status = paymentStatusOf(booking.status);
      if (status === 'PAID') paid += booking.total;
      else if (status === 'REFUNDED') refunded += booking.total;
      else if (status === 'PENDING') pending += booking.total;
    });
    return { paid, pending, refunded };
  }, [bookings]);

  const q = search.trim().toLowerCase();
  const filtered = bookings.filter((booking) =>
    q ? `${booking.reference} ${booking.guest_name}`.toLowerCase().includes(q) : true,
  );

  return (
    <AdminLayout title="Payments" subtitle="Payment status for every ZAMIN Stays booking.">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Collected" value={formatPKR(summary.paid)} icon="ri-checkbox-circle-line" tone="primary" />
        <StatCard label="Pending" value={formatPKR(summary.pending)} icon="ri-time-line" />
        <StatCard label="Refunded" value={formatPKR(summary.refunded)} icon="ri-refund-2-line" />
      </div>

      <div className="mb-4 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="relative md:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
            <i className="ri-search-line text-base"></i>
          </span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search payment / guest" className={`${inputClass} pl-9`} />
        </div>
      </div>

      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load payments." onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="ri-bank-card-line"
          title={bookings.length === 0 ? 'No payments yet.' : 'No payments match your search.'}
          message={bookings.length === 0 ? 'Payment records appear here as bookings are created.' : undefined}
        />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Payment ID</th>
                <th className={thClass}>Booking</th>
                <th className={thClass}>Guest</th>
                <th className={thClass}>Amount</th>
                <th className={thClass}>Method</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Date</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => {
                const status = paymentStatusOf(booking.status);
                const meta = PAYMENT_STATUS_META[status];
                return (
                  <tr key={booking.id} className="border-t border-background-100 align-top">
                    <td className={`${tdClass} font-mono text-xs font-semibold text-foreground-900`}>PMT-{booking.reference}</td>
                    <td className={tdClass}>
                      <Link to={`/admin/bookings/${booking.id}`} className="font-mono text-xs font-semibold text-foreground-900 hover:text-primary-700">
                        {booking.reference}
                      </Link>
                      <p className="text-xs text-foreground-500">{booking.stay?.title ?? '—'}</p>
                    </td>
                    <td className={`${tdClass} text-foreground-700`}>{booking.guest_name}</td>
                    <td className={`${tdClass} font-semibold text-primary-700`}>{formatPKR(booking.total, booking.currency)}</td>
                    <td className={`${tdClass} text-foreground-500`}>Not recorded</td>
                    <td className={tdClass}><Badge tone={PAY_TONE[status]} icon={meta.icon}>{meta.label}</Badge></td>
                    <td className={`${tdClass} text-xs text-foreground-500`}>{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td className={tdClass}>
                      <div className="flex justify-end">
                        <Link to={`/admin/bookings/${booking.id}`} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                          <i className="ri-eye-line"></i> Booking
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 text-xs text-foreground-500">
        <i className="ri-information-line mt-0.5"></i>
        Payment status is derived from each booking. Connect a payment provider to capture method and settlement details.
      </p>

      <div className="mt-4">
        <Link to="/admin/payouts" className={btnGhost}>
          <i className="ri-hand-coin-line text-base"></i> View host payouts
        </Link>
      </div>
    </AdminLayout>
  );
}