import { Link } from 'react-router-dom';
import HostLayout from '@/pages/host/components/HostLayout';
import {
  Badge,
  BookingStatusBadge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  StatCard,
  StayStatusBadge,
  btnPrimary,
  tdClass,
  thClass,
  theadClass,
  tableWrap,
} from '@/pages/admin/components/AdminUI';
import { useHostPortal } from '@/hooks/useHostPortal';
import { coverImage, formatPKR } from '@/utils/stays';

function isoToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function HostDashboardPage() {
  const { stays, bookings, profile, metrics, loading, error, refetch } = useHostPortal();

  const stayIds = new Set(stays.map((stay) => stay.id));
  const myBookings = bookings.filter((booking) => stayIds.has(booking.stay_id));
  const today = isoToday();
  const upcoming = myBookings
    .filter((booking) => booking.status === 'CONFIRMED' && booking.check_in >= today)
    .sort((a, b) => a.check_in.localeCompare(b.check_in))
    .slice(0, 6);
  const recent = [...myBookings].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5);

  if (loading) {
    return (
      <HostLayout title="Host dashboard">
        <LoadingBlock rows={6} />
      </HostLayout>
    );
  }

  if (error) {
    return (
      <HostLayout title="Host dashboard">
        <ErrorState message="Couldn’t load your host data." onRetry={refetch} />
      </HostLayout>
    );
  }

  return (
    <HostLayout
      title={profile?.name ? `Welcome back, ${profile.name.split(' ')[0]}` : 'Host dashboard'}
      subtitle="Your listings, bookings and earnings at a glance."
      actions={
        <Link to="/host/stays" className={btnPrimary}>
          <i className="ri-home-4-line text-base"></i> My listings
        </Link>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="My Listings" value={metrics.listings} icon="ri-home-4-line" />
        <StatCard label="Published" value={metrics.published} icon="ri-checkbox-circle-line" tone="primary" />
        <StatCard label="Upcoming Check-ins" value={metrics.upcomingCount} icon="ri-login-circle-line" tone="accent" />
        <StatCard label="Net Earnings" value={formatPKR(metrics.netEarnings)} icon="ri-hand-coin-line" tone="primary" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-2">
          <Card title="Upcoming check-ins" icon="ri-calendar-check-line" bodyClassName="p-0">
            {upcoming.length === 0 ? (
              <div className="p-5">
                <EmptyState compact icon="ri-calendar-check-line" title="No upcoming check-ins." />
              </div>
            ) : (
              <div className={tableWrap + ' border-0'}>
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className={theadClass}>
                    <tr>
                      <th className={thClass}>Guest</th>
                      <th className={thClass}>Stay</th>
                      <th className={thClass}>Check-in</th>
                      <th className={thClass}>Guests</th>
                      <th className={thClass}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map((booking) => (
                      <tr key={booking.id} className="border-t border-background-100">
                        <td className={tdClass}>
                          <p className="font-medium text-foreground-900">{booking.guest_name}</p>
                          <p className="text-xs text-foreground-500">{booking.reference}</p>
                        </td>
                        <td className={`${tdClass} text-foreground-700`}>{booking.stay?.title ?? '—'}</td>
                        <td className={`${tdClass} text-foreground-700`}>{booking.check_in}</td>
                        <td className={`${tdClass} text-foreground-600`}>{booking.guests}</td>
                        <td className={tdClass}><BookingStatusBadge status={booking.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Recent bookings" icon="ri-history-line" bodyClassName="p-0">
            {recent.length === 0 ? (
              <div className="p-5">
                <EmptyState compact icon="ri-calendar-line" title="No bookings yet." message="Reservations for your stays appear here." />
              </div>
            ) : (
              <ul className="divide-y divide-background-100">
                {recent.map((booking) => (
                  <li key={booking.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground-900">{booking.guest_name}</p>
                      <p className="text-xs text-foreground-500">
                        {booking.stay?.title ?? 'Stay'} · {booking.check_in} → {booking.check_out}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary-700">{formatPKR(booking.total, booking.currency)}</span>
                    <BookingStatusBadge status={booking.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card title="Earnings snapshot" icon="ri-wallet-3-line">
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-foreground-600">Gross revenue</dt>
                <dd className="font-semibold text-foreground-950">{formatPKR(metrics.grossRevenue)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground-600">Net earnings</dt>
                <dd className="font-semibold text-primary-700">{formatPKR(metrics.netEarnings)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground-600">Awaiting payout</dt>
                <dd className="font-semibold text-foreground-950">{formatPKR(metrics.pendingPayout)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-background-100 pt-3">
                <dt className="text-foreground-600">Occupancy (30 days)</dt>
                <dd className="font-semibold text-foreground-950">{metrics.occupancy}%</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground-600">Avg. nightly rate</dt>
                <dd className="font-semibold text-foreground-950">{formatPKR(metrics.avgNightly)}</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-start gap-2 text-xs text-foreground-500">
              <i className="ri-information-line mt-0.5"></i>
              Net earnings are your booking value minus the ZAMIN commission (service fee).
            </p>
          </Card>

          <Card title="My listings" icon="ri-home-4-line" bodyClassName="p-0">
            {stays.length === 0 ? (
              <div className="p-5">
                <EmptyState compact icon="ri-home-4-line" title="No listings yet." message="Once ZAMIN adds your stays, they’ll appear here." />
              </div>
            ) : (
              <ul className="divide-y divide-background-100">
                {stays.slice(0, 6).map((stay) => {
                  const image = coverImage(stay);
                  return (
                    <li key={stay.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="h-11 w-14 shrink-0 overflow-hidden rounded-md bg-background-100">
                        {image ? (
                          <img src={image} alt={stay.title} className="h-full w-full object-cover object-top" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-background-400">
                            <i className="ri-image-line"></i>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link to="/host/stays" className="block truncate text-sm font-medium text-foreground-950 hover:text-primary-700">
                          {stay.title}
                        </Link>
                        <p className="truncate text-xs text-foreground-500">
                          {[stay.area?.name, stay.destination?.name].filter(Boolean).join(', ') || '—'}
                        </p>
                      </div>
                      <StayStatusBadge status={stay.status} />
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {profile && profile.status === 'SUSPENDED' && (
            <Card title="Account status" icon="ri-alert-line">
              <Badge tone="urgent" icon="ri-alert-line">Suspended</Badge>
              <p className="mt-2 text-sm text-foreground-600">
                Your host account is suspended. Contact ZAMIN Stays support to resolve it.
              </p>
            </Card>
          )}
        </div>
      </div>
    </HostLayout>
  );
}