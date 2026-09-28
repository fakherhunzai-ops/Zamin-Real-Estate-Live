import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import {
  Badge,
  BookingStatusBadge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  SectionLabel,
  StatCard,
  btnGhost,
  btnSmall,
  btnPrimary,
  tableWrap,
  theadClass,
  tdClass,
  thClass,
} from '@/pages/admin/components/AdminUI';
import { useAdminOverview } from '@/hooks/useAdminOverview';
import { formatPKR } from '@/utils/stays';
import type { Booking } from '@/types/stays';

function locationOf(booking: Booking): string {
  return [booking.stay?.area?.name, booking.stay?.destination?.name].filter(Boolean).join(', ') || '—';
}

function BookingRows({ rows, dateLabel }: { rows: Booking[]; dateLabel: 'check_in' | 'check_out' }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        compact
        icon="ri-calendar-line"
        title={dateLabel === 'check_in' ? 'No upcoming check-ins.' : 'No upcoming check-outs.'}
      />
    );
  }
  return (
    <div className={tableWrap}>
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className={theadClass}>
          <tr>
            <th className={thClass}>Guest</th>
            <th className={thClass}>Stay</th>
            <th className={thClass}>Location</th>
            <th className={thClass}>{dateLabel === 'check_in' ? 'Check-in' : 'Check-out'}</th>
            <th className={thClass}>Guests</th>
            <th className={thClass}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 6).map((booking) => (
            <tr key={booking.id} className="border-t border-background-100">
              <td className={tdClass}>
                <Link to={`/admin/bookings/${booking.id}`} className="font-medium text-foreground-950 hover:text-primary-700">
                  {booking.guest_name}
                </Link>
                <p className="text-xs text-foreground-500">{booking.reference}</p>
              </td>
              <td className={`${tdClass} text-foreground-700`}>{booking.stay?.title ?? '—'}</td>
              <td className={`${tdClass} text-foreground-600`}>{locationOf(booking)}</td>
              <td className={`${tdClass} font-medium text-foreground-800`}>
                {dateLabel === 'check_in' ? booking.check_in : booking.check_out}
              </td>
              <td className={`${tdClass} text-foreground-600`}>{booking.guests}</td>
              <td className={tdClass}>
                <BookingStatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminStaysDashboardPage() {
  const {
    metrics,
    upcomingCheckInList,
    upcomingCheckOutList,
    pendingStays,
    recentBookings,
    alerts,
    loading,
    error,
    refetch,
  } = useAdminOverview();

  return (
    <AdminLayout
      title="ZAMIN Stays Overview"
      subtitle="Manage bookings, properties, hosts and operations."
      actions={
        <>
          <Link to="/admin/bookings" className={btnGhost}>
            <i className="ri-calendar-check-line text-base"></i> Bookings
          </Link>
          <Link to="/admin/stays/new" className={btnPrimary}>
            <i className="ri-add-line text-base"></i> Add Stay
          </Link>
        </>
      }
    >
      {loading ? (
        <LoadingBlock label="Loading dashboard…" rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load dashboard data." onRetry={refetch} />
      ) : (
        <div className="flex flex-col gap-8">
          {/* Properties */}
          <section>
            <SectionLabel className="mb-3">Portfolio</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Stays" value={metrics.totalStays} icon="ri-home-4-line" />
              <StatCard label="Published Stays" value={metrics.publishedStays} icon="ri-upload-cloud-2-line" tone="primary" />
              <StatCard label="Pending Verification" value={metrics.pendingVerification} icon="ri-shield-star-line" tone="accent" />
              <StatCard label="Managed Properties" value={metrics.managedStays} icon="ri-vip-diamond-line" />
            </div>
          </section>

          {/* Operations */}
          <section>
            <SectionLabel className="mb-3">Operations</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Active Bookings" value={metrics.activeBookings} icon="ri-calendar-check-line" />
              <StatCard label="Upcoming Check-ins" value={metrics.upcomingCheckIns} icon="ri-login-circle-line" />
              <StatCard label="Upcoming Check-outs" value={metrics.upcomingCheckOuts} icon="ri-logout-circle-line" />
              <StatCard
                label="Occupancy Rate"
                value={`${metrics.occupancyRate}%`}
                icon="ri-pie-chart-2-line"
                hint="Next 30 days, published stays"
                tone="accent"
              />
            </div>
          </section>

          {/* Financials */}
          <section>
            <SectionLabel className="mb-3">Financials</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Booking Revenue"
                value={formatPKR(metrics.bookingRevenue)}
                icon="ri-money-dollar-circle-line"
                hint="Confirmed & completed bookings"
                tone="primary"
              />
              <StatCard label="ZAMIN Revenue" value={formatPKR(metrics.zaminRevenue)} icon="ri-hand-coin-line" hint="Service fees collected" />
              <StatCard label="Pending Payouts" value={formatPKR(metrics.pendingPayouts)} icon="ri-wallet-3-line" tone="accent" />
              <StatCard
                label="Average Nightly Rate"
                value={formatPKR(metrics.avgNightlyRate)}
                icon="ri-price-tag-3-line"
                hint="Across published stays"
              />
            </div>
          </section>

          {/* Alerts */}
          <Card
            title="Operational Alerts"
            icon="ri-alert-line"
            actions={<Badge tone="muted">{alerts.length}</Badge>}
            bodyClassName="p-0"
          >
            {alerts.length === 0 ? (
              <div className="p-5">
                <EmptyState compact icon="ri-checkbox-circle-line" title="Nothing needs attention right now." />
              </div>
            ) : (
              <ul className="divide-y divide-background-100">
                {alerts.map((alert) => (
                  <li key={alert.id}>
                    <Link to={alert.to ?? '#'} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-background-100">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                          alert.tone === 'urgent' ? 'bg-accent-500 text-background-50' : alert.tone === 'warn' ? 'bg-accent-100 text-accent-800' : 'bg-secondary-100 text-secondary-900'
                        }`}
                      >
                        <i className={`${alert.icon} text-base`}></i>
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground-950">{alert.title}</p>
                        <p className="text-xs text-foreground-600">{alert.message}</p>
                      </div>
                      <i className="ri-arrow-right-s-line ml-auto text-foreground-400"></i>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-base font-semibold text-foreground-950">Upcoming Check-ins</h2>
                <Link to="/admin/bookings" className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                  View all
                </Link>
              </div>
              <BookingRows rows={upcomingCheckInList} dateLabel="check_in" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-base font-semibold text-foreground-950">Upcoming Check-outs</h2>
                <Link to="/admin/operations/cleaning" className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                  Cleaning
                </Link>
              </div>
              <BookingRows rows={upcomingCheckOutList} dateLabel="check_out" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card
              title="Pending Verification"
              icon="ri-shield-star-line"
              actions={
                <Link to="/admin/stays/pending" className={`${btnSmall} border-accent-300 text-accent-900 hover:bg-accent-100`}>
                  Review
                </Link>
              }
              bodyClassName="p-0"
            >
              {pendingStays.length === 0 ? (
                <div className="p-5">
                  <EmptyState compact icon="ri-shield-check-line" title="No stays awaiting verification." />
                </div>
              ) : (
                <ul className="divide-y divide-background-100">
                  {pendingStays.slice(0, 5).map((stay) => (
                    <li key={stay.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="min-w-0 flex-1">
                        <Link to={`/admin/stays/${stay.id}`} className="block truncate text-sm font-semibold text-foreground-950 hover:text-primary-700">
                          {stay.title}
                        </Link>
                        <p className="truncate text-xs text-foreground-500">
                          {[stay.area?.name, stay.destination?.name].filter(Boolean).join(', ') || 'No location'}
                          {stay.host_name ? ` · ${stay.host_name}` : ''}
                        </p>
                      </div>
                      <Badge tone="secondary" icon="ri-time-line">Pending</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              title="Recent Bookings"
              icon="ri-history-line"
              actions={
                <Link to="/admin/bookings" className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                  View all
                </Link>
              }
              bodyClassName="p-0"
            >
              {recentBookings.length === 0 ? (
                <div className="p-5">
                  <EmptyState compact icon="ri-inbox-line" title="No bookings yet." />
                </div>
              ) : (
                <ul className="divide-y divide-background-100">
                  {recentBookings.map((booking) => (
                    <li key={booking.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="min-w-0 flex-1">
                        <Link to={`/admin/bookings/${booking.id}`} className="block truncate text-sm font-semibold text-foreground-950 hover:text-primary-700">
                          {booking.guest_name}
                        </Link>
                        <p className="truncate text-xs text-foreground-500">
                          {booking.stay?.title ?? '—'} · {booking.check_in} → {booking.check_out}
                        </p>
                      </div>
                      <span className="whitespace-nowrap text-sm font-semibold text-primary-700">
                        {formatPKR(booking.total, booking.currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}