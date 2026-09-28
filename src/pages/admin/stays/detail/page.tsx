import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import StayRateRulesEditor from '@/pages/admin/stays/components/StayRateRulesEditor';
import StayBlockedDates from '@/pages/admin/stays/components/StayBlockedDates';
import {
  Badge,
  BookingStatusBadge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  ManagementBadge,
  StayStatusBadge,
  Tabs,
  VerifiedBadge,
  btnGhost,
  btnPrimary,
  btnSmall,
  tdClass,
  thClass,
  theadClass,
  tableWrap,
} from '@/pages/admin/components/AdminUI';
import { useAdminStay } from '@/hooks/useAdminStay';
import { useBookings } from '@/hooks/useBookings';
import { coverImage, formatNightly, formatPKR, stayAmenities } from '@/utils/stays';
import { setStayFeatured, setStayStatus, setStayVerified } from '@/utils/stayAdmin';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'operations', label: 'Operations' },
  { id: 'financials', label: 'Financials' },
  { id: 'activity', label: 'Activity' },
];

export default function AdminStayDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { stay, loading, error, refetch } = useAdminStay(id);
  const { bookings, refetch: refetchBookings } = useBookings();
  const { notify } = useAdminToast();
  const [tab, setTab] = useState('overview');
  const [busy, setBusy] = useState(false);

  const stayBookings = useMemo(
    () => (stay ? bookings.filter((booking) => booking.stay_id === stay.id) : []),
    [bookings, stay],
  );

  const financials = useMemo(() => {
    const active = stayBookings.filter((booking) => booking.status !== 'CANCELLED' && booking.status !== 'REFUNDED');
    const revenue = active.reduce((sum, booking) => sum + (booking.total || 0), 0);
    const zamin = active.reduce((sum, booking) => sum + (booking.service_fee || 0), 0);
    const completed = stayBookings.filter((booking) => booking.status === 'CHECKED_OUT');
    const payout = completed.reduce((sum, booking) => sum + ((booking.total || 0) - (booking.service_fee || 0)), 0);
    const bookedNights = active.reduce((sum, booking) => sum + (booking.nights || 0), 0);
    return { revenue, zamin, payout, hostNet: revenue - zamin, bookedNights };
  }, [stayBookings]);

  const refreshAll = async () => {
    await refetch();
    await refetchBookings();
  };

  const runAction = async (fn: () => Promise<void>, message: string) => {
    setBusy(true);
    try {
      await fn();
      await refreshAll();
      notify({ title: message, tone: 'success' });
    } catch (err) {
      notify({ title: 'Action failed', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Stay details">
        <LoadingBlock label="Loading stay…" rows={5} />
      </AdminLayout>
    );
  }

  if (error || !stay) {
    return (
      <AdminLayout title="Stay details">
        <ErrorState message={error || 'This stay could not be found.'} onRetry={refetch} />
      </AdminLayout>
    );
  }

  const image = coverImage(stay);
  const amenities = stayAmenities(stay);
  const upcoming = stayBookings
    .filter((booking) => booking.status === 'CONFIRMED' && booking.check_in >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.check_in.localeCompare(b.check_in))[0];

  const activity = [
    { label: 'Stay created', at: stay.created_at, icon: 'ri-add-circle-line' },
    { label: 'Last updated', at: stay.updated_at, icon: 'ri-edit-line' },
    ...(stay.verified_at ? [{ label: 'Verified by ZAMIN', at: stay.verified_at, icon: 'ri-shield-check-line' }] : []),
    ...stayBookings.map((booking) => ({
      label: `Booking ${booking.reference} · ${booking.guest_name}`,
      at: booking.created_at,
      icon: 'ri-calendar-check-line',
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <AdminLayout
      title={stay.title}
      subtitle={[stay.area?.name, stay.destination?.name].filter(Boolean).join(', ') || `/${stay.slug}`}
      actions={
        <>
          <Link to={`/admin/stays/${stay.id}/edit`} className={btnPrimary}>
            <i className="ri-edit-line text-base"></i> Edit
          </Link>
          <Link to={`/stays/${stay.slug}`} className={btnGhost}>
            <i className="ri-external-link-line text-base"></i> Preview
          </Link>
          {stay.status === 'PUBLISHED' ? (
            <button type="button" disabled={busy} onClick={() => runAction(() => setStayStatus(stay.id, 'PAUSED'), 'Listing paused')} className={btnGhost}>
              <i className="ri-pause-circle-line text-base"></i> Pause
            </button>
          ) : (
            <button type="button" disabled={busy} onClick={() => runAction(() => setStayStatus(stay.id, 'PUBLISHED'), 'Stay published')} className={btnGhost}>
              <i className="ri-upload-cloud-2-line text-base"></i> Publish
            </button>
          )}
        </>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StayStatusBadge status={stay.status} />
        <VerifiedBadge verified={stay.verified} />
        <ManagementBadge type={stay.management_type} />
        {stay.featured && <Badge tone="secondary" icon="ri-star-fill">Featured</Badge>}
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-6">
        {tab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card title="Property" icon="ri-home-4-line" className="xl:col-span-2" bodyClassName="p-0">
              <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
                <div className="h-56 w-full overflow-hidden bg-background-100 md:h-full">
                  {image ? (
                    <img src={image} alt={stay.title} className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-background-400">
                      <i className="ri-image-line text-4xl"></i>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Nightly rate</span>
                    <span className="font-heading text-lg font-bold text-primary-700">{formatNightly(stay.base_nightly_rate, stay.currency)}</span>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-foreground-500">Guests</dt><dd className="font-semibold text-foreground-900">{stay.guest_capacity}</dd></div>
                    <div><dt className="text-foreground-500">Bedrooms</dt><dd className="font-semibold text-foreground-900">{stay.bedrooms}</dd></div>
                    <div><dt className="text-foreground-500">Beds</dt><dd className="font-semibold text-foreground-900">{stay.beds}</dd></div>
                    <div><dt className="text-foreground-500">Bathrooms</dt><dd className="font-semibold text-foreground-900">{stay.bathrooms}</dd></div>
                    <div><dt className="text-foreground-500">Check-in</dt><dd className="font-semibold text-foreground-900">{stay.check_in_time ?? '—'}</dd></div>
                    <div><dt className="text-foreground-500">Check-out</dt><dd className="font-semibold text-foreground-900">{stay.check_out_time ?? '—'}</dd></div>
                  </dl>
                  <div className="mt-1">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-500">Amenities</p>
                    {amenities.length === 0 ? (
                      <p className="text-sm text-foreground-500">No amenities added yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {amenities.map((amenity) => (
                          <span key={amenity.id} className="inline-flex items-center gap-1 rounded-md bg-background-100 px-2 py-1 text-xs font-medium text-foreground-700">
                            {amenity.icon && <i className={`${amenity.icon} text-sm`}></i>}
                            {amenity.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-6">
              <Card title="Host" icon="ri-user-heart-line">
                <p className="text-sm font-semibold text-foreground-950">{stay.host_name || 'Unassigned'}</p>
                {stay.host_phone && <p className="mt-1 text-sm text-foreground-600">{stay.host_phone}</p>}
                {stay.host_email && <p className="text-sm text-foreground-600">{stay.host_email}</p>}
                <div className="mt-3">
                  <ManagementBadge type={stay.management_type} />
                </div>
              </Card>
              <Card title="Upcoming booking" icon="ri-calendar-check-line">
                {upcoming ? (
                  <div className="flex flex-col gap-1 text-sm">
                    <Link to={`/admin/bookings/${upcoming.id}`} className="font-semibold text-foreground-950 hover:text-primary-700">
                      {upcoming.guest_name}
                    </Link>
                    <p className="text-foreground-600">{upcoming.check_in} → {upcoming.check_out}</p>
                    <p className="text-foreground-600">{upcoming.guests} guests · {formatPKR(upcoming.total, upcoming.currency)}</p>
                    <div className="mt-1"><BookingStatusBadge status={upcoming.status} /></div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground-500">No upcoming bookings.</p>
                )}
              </Card>
              <Card title="Verification" icon="ri-shield-check-line">
                <VerifiedBadge verified={stay.verified} />
                <p className="mt-2 text-sm text-foreground-600">
                  {stay.verified_at ? `Verified on ${new Date(stay.verified_at).toLocaleDateString()}` : 'Not verified yet.'}
                </p>
              </Card>
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          stayBookings.length === 0 ? (
            <EmptyState icon="ri-calendar-line" title="No bookings for this stay yet." />
          ) : (
            <div className={tableWrap}>
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className={theadClass}>
                  <tr>
                    <th className={thClass}>Reference</th>
                    <th className={thClass}>Guest</th>
                    <th className={thClass}>Dates</th>
                    <th className={thClass}>Total</th>
                    <th className={thClass}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stayBookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-background-100">
                      <td className={tdClass}>
                        <Link to={`/admin/bookings/${booking.id}`} className="font-mono text-xs font-semibold text-foreground-900 hover:text-primary-700">
                          {booking.reference}
                        </Link>
                      </td>
                      <td className={`${tdClass} text-foreground-700`}>{booking.guest_name}</td>
                      <td className={`${tdClass} text-foreground-600`}>{booking.check_in} → {booking.check_out}</td>
                      <td className={`${tdClass} font-semibold text-primary-700`}>{formatPKR(booking.total, booking.currency)}</td>
                      <td className={tdClass}><BookingStatusBadge status={booking.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {tab === 'calendar' && (
          <Card title="Availability & blocked dates" icon="ri-calendar-2-line">
            <StayBlockedDates stayId={stay.id} />
          </Card>
        )}

        {tab === 'pricing' && (
          <Card title="Pricing rules" icon="ri-price-tag-3-line">
            <StayRateRulesEditor stayId={stay.id} baseRate={stay.base_nightly_rate} />
          </Card>
        )}

        {tab === 'reviews' && (
          <EmptyState
            icon="ri-star-line"
            title="No reviews yet."
            message="Guests can leave a review after a completed stay. Reviews appear here for moderation."
          />
        )}

        {tab === 'operations' && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card title="Cleaning" icon="ri-brush-line" bodyClassName="p-0">
              {stayBookings.filter((booking) => booking.status === 'CHECKED_OUT' || booking.status === 'CHECKED_IN').length === 0 ? (
                <div className="p-5"><EmptyState compact icon="ri-brush-line" title="No turnovers scheduled." /></div>
              ) : (
                <ul className="divide-y divide-background-100">
                  {stayBookings
                    .filter((booking) => booking.status === 'CHECKED_OUT' || booking.status === 'CHECKED_IN')
                    .map((booking) => (
                      <li key={booking.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                        <div>
                          <p className="text-sm font-semibold text-foreground-900">Turnover after {booking.guest_name}</p>
                          <p className="text-xs text-foreground-500">Check-out {booking.check_out}</p>
                        </div>
                        <Badge tone={booking.status === 'CHECKED_OUT' ? 'accent' : 'secondary'}>
                          {booking.status === 'CHECKED_OUT' ? 'To do' : 'In progress'}
                        </Badge>
                      </li>
                    ))}
                </ul>
              )}
            </Card>
            <Card title="Maintenance" icon="ri-hammer-line">
              <EmptyState compact icon="ri-hammer-line" title="No maintenance issues reported." />
            </Card>
          </div>
        )}

        {tab === 'financials' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card><p className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Booking revenue</p><p className="mt-2 font-heading text-2xl font-bold text-foreground-950">{formatPKR(financials.revenue)}</p></Card>
            <Card><p className="text-xs font-semibold uppercase tracking-wide text-foreground-500">ZAMIN revenue</p><p className="mt-2 font-heading text-2xl font-bold text-primary-700">{formatPKR(financials.zamin)}</p></Card>
            <Card><p className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Host net</p><p className="mt-2 font-heading text-2xl font-bold text-foreground-950">{formatPKR(financials.hostNet)}</p></Card>
            <Card><p className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Completed payouts</p><p className="mt-2 font-heading text-2xl font-bold text-accent-700">{formatPKR(financials.payout)}</p></Card>
          </div>
        )}

        {tab === 'activity' && (
          <Card title="Activity" icon="ri-history-line" bodyClassName="p-0">
            <ul className="divide-y divide-background-100">
              {activity.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-background-100 text-foreground-600">
                    <i className={`${item.icon} text-base`}></i>
                  </span>
                  <p className="flex-1 text-sm text-foreground-800">{item.label}</p>
                  <span className="text-xs text-foreground-500">{new Date(item.at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => runAction(() => setStayVerified(stay.id, !stay.verified), stay.verified ? 'Marked unverified' : 'Marked verified')} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
          <i className="ri-shield-check-line"></i> {stay.verified ? 'Unverify' : 'Verify'}
        </button>
        <button type="button" disabled={busy} onClick={() => runAction(() => setStayFeatured(stay.id, !stay.featured), stay.featured ? 'Unfeatured' : 'Featured')} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
          <i className="ri-star-line"></i> {stay.featured ? 'Unfeature' : 'Feature'}
        </button>
      </div>
    </AdminLayout>
  );
}