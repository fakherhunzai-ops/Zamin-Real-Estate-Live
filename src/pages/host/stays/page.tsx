import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HostLayout from '@/pages/host/components/HostLayout';
import HostStayEditor from '@/pages/host/stays/components/HostStayEditor';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  EmptyState,
  ErrorState,
  LoadingBlock,
  ManagementBadge,
  StayStatusBadge,
  VerifiedBadge,
  btnGhost,
  btnPrimary,
  btnSmall,
} from '@/pages/admin/components/AdminUI';
import { useHostPortal } from '@/hooks/useHostPortal';
import { setHostStayStatus } from '@/utils/hostPortal';
import { coverImage, formatNightly } from '@/utils/stays';
import type { Stay } from '@/types/stays';

export default function HostStaysPage() {
  const { stays, bookings, loading, error, refetch } = useHostPortal();
  const { notify } = useAdminToast();
  const [editing, setEditing] = useState<Stay | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const bookingCounts = useMemo(
    () =>
      bookings.reduce<Record<string, number>>((acc, booking) => {
        acc[booking.stay_id] = (acc[booking.stay_id] ?? 0) + 1;
        return acc;
      }, {}),
    [bookings],
  );

  const setStatus = async (stay: Stay, status: 'PUBLISHED' | 'PAUSED') => {
    setBusyId(stay.id);
    try {
      await setHostStayStatus(stay.id, status);
      await refetch();
      notify({ title: status === 'PUBLISHED' ? 'Listing published' : 'Listing paused', message: stay.title, tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not update listing', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <HostLayout
      title="My Listings"
      subtitle="Manage the details, pricing and availability of your stays."
      actions={
        <Link to="/host/calendar" className={btnPrimary}>
          <i className="ri-calendar-2-line text-base"></i> My calendar
        </Link>
      }
    >
      {loading ? (
        <LoadingBlock rows={4} />
      ) : error ? (
        <ErrorState message="Couldn’t load your listings." onRetry={refetch} />
      ) : stays.length === 0 ? (
        <EmptyState
          icon="ri-home-4-line"
          title="No listings linked to your account yet"
          message="Once ZAMIN Stays adds properties under your email, they’ll appear here for you to manage."
          action={
            <Link to="/stays/host/apply" className={btnPrimary}>
              <i className="ri-add-line text-base"></i> Submit a property
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {stays.map((stay) => {
            const image = coverImage(stay);
            const busy = busyId === stay.id;
            return (
              <article key={stay.id} className="flex flex-col overflow-hidden rounded-card border border-background-200 bg-background-50">
                <div className="h-44 w-full overflow-hidden bg-background-100">
                  {image ? (
                    <img src={image} alt={stay.title} className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-background-400">
                      <i className="ri-image-line text-4xl"></i>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <StayStatusBadge status={stay.status} />
                    <VerifiedBadge verified={stay.verified} />
                    <ManagementBadge type={stay.management_type} />
                  </div>
                  <div>
                    <h2 className="font-heading text-base font-semibold text-foreground-950">{stay.title}</h2>
                    <p className="mt-0.5 text-sm text-foreground-600">
                      {[stay.area?.name, stay.destination?.name].filter(Boolean).join(', ') || 'Location not set'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-foreground-600">
                    <span className="font-semibold text-primary-700">{formatNightly(stay.base_nightly_rate, stay.currency)}</span>
                    <span className="flex items-center gap-1">
                      <i className="ri-calendar-check-line text-accent-600"></i>
                      {bookingCounts[stay.id] ?? 0} bookings
                    </span>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <button type="button" onClick={() => setEditing(stay)} className={btnSmall + ' border-primary-300 text-primary-700 hover:bg-primary-50'}>
                      <i className="ri-edit-line"></i> Edit
                    </button>
                    <Link to={`/host/calendar?stay=${stay.id}`} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
                      <i className="ri-calendar-2-line"></i> Calendar
                    </Link>
                    <Link to={`/stays/${stay.slug}`} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
                      <i className="ri-external-link-line"></i> Preview
                    </Link>
                    {stay.status === 'PUBLISHED' ? (
                      <button type="button" disabled={busy} onClick={() => setStatus(stay, 'PAUSED')} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
                        <i className="ri-pause-circle-line"></i> Pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy || !stay.verified}
                        title={stay.verified ? 'Publish this listing' : 'Awaiting ZAMIN verification before it can go live'}
                        onClick={() => setStatus(stay, 'PUBLISHED')}
                        className={btnSmall + ' border-primary-300 text-primary-700 hover:bg-primary-50'}
                      >
                        <i className="ri-upload-cloud-2-line"></i> Publish
                      </button>
                    )}
                  </div>

                  {!stay.verified && (
                    <p className="flex items-start gap-2 rounded-md bg-secondary-100 px-3 py-2 text-xs text-secondary-900">
                      <i className="ri-shield-star-line mt-0.5"></i>
                      Pending ZAMIN verification — it will go live once approved.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <Link to="/stays/host/apply" className={btnGhost}>
          <i className="ri-add-line text-base"></i> Submit another property
        </Link>
      </div>

      {editing && (
        <HostStayEditor
          stay={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            await refetch();
            setEditing(null);
            notify({ title: 'Listing updated', tone: 'success' });
          }}
        />
      )}
    </HostLayout>
  );
}