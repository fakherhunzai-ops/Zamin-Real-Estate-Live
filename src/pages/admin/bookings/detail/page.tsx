import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import ConfirmDialog from '@/pages/admin/components/ConfirmDialog';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  BookingStatusBadge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  btnGhost,
  btnPrimary,
  btnSmall,
  inputClass,
  tdClass,
  thClass,
  theadClass,
  tableWrap,
} from '@/pages/admin/components/AdminUI';
import { useBookings } from '@/hooks/useBookings';
import { formatPKR, nightsBetween } from '@/utils/stays';
import { PAYMENT_STATUS_META, locationOfBooking, paymentStatusOf } from '@/utils/stayOps';
import { updateBookingStatus } from '@/utils/stayAdmin';
import type { BookingStatus } from '@/types/stays';

const FLOW: { next: BookingStatus; label: string; icon: string; primary?: boolean }[] = [
  { next: 'CONFIRMED', label: 'Confirm Booking', icon: 'ri-check-line', primary: true },
  { next: 'CHECKED_IN', label: 'Mark Checked In', icon: 'ri-login-circle-line' },
  { next: 'CHECKED_OUT', label: 'Mark Checked Out', icon: 'ri-logout-circle-line' },
  { next: 'REFUNDED', label: 'Process Refund State', icon: 'ri-refund-2-line' },
];

export default function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { bookings, loading, error, refetch } = useBookings();
  const { notify } = useAdminToast();
  const [busy, setBusy] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const booking = useMemo(() => bookings.find((item) => item.id === id) ?? null, [bookings, id]);

  const runAction = async (status: BookingStatus) => {
    if (!booking) return;
    setBusy(true);
    try {
      await updateBookingStatus(booking.id, status);
      await refetch();
      notify({ title: `Booking ${status.toLowerCase().replace('_', ' ')}`, message: booking.reference, tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not update booking', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
      setCancelOpen(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Booking details">
        <LoadingBlock label="Loading booking…" rows={5} />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Booking details">
        <ErrorState message="Couldn’t load booking." onRetry={refetch} />
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout title="Booking details">
        <EmptyState icon="ri-calendar-line" title="Booking not found." action={<Link to="/admin/bookings" className={btnGhost}>Back to bookings</Link>} />
      </AdminLayout>
    );
  }

  const payStatus = paymentStatusOf(booking.status);
  const payMeta = PAYMENT_STATUS_META[payStatus];
  const hostNet = booking.total - booking.service_fee;
  const amountPaid = payStatus === 'PAID' ? booking.total : 0;
  const nights = booking.nights || nightsBetween(booking.check_in, booking.check_out);

  return (
    <AdminLayout
      title={`Booking ${booking.reference}`}
      subtitle={`${booking.stay?.title ?? 'Stay'} · ${locationOfBooking(booking)}`}
      actions={
        <>
          <Link to="/admin/bookings" className={btnGhost}>
            <i className="ri-arrow-left-line text-base"></i> All bookings
          </Link>
          <Link to={`/booking/${booking.reference}`} className={btnPrimary}>
            <i className="ri-file-text-line text-base"></i> Guest confirmation
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <Card
            title="Booking details"
            icon="ri-calendar-check-line"
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <BookingStatusBadge status={booking.status} />
                <Badge tone={payStatus === 'PAID' ? 'primary' : payStatus === 'PENDING' ? 'secondary' : 'muted'} icon={payMeta.icon}>
                  {payMeta.label}
                </Badge>
              </div>
            }
          >
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Check-in</dt><dd className="mt-1 font-semibold text-foreground-900">{booking.check_in}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Check-out</dt><dd className="mt-1 font-semibold text-foreground-900">{booking.check_out}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Nights</dt><dd className="mt-1 font-semibold text-foreground-900">{nights}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Guests</dt><dd className="mt-1 font-semibold text-foreground-900">{booking.guests}</dd></div>
            </dl>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Stay details" icon="ri-home-4-line">
              {booking.stay ? (
                <div className="flex flex-col gap-2 text-sm">
                  <Link to={`/admin/stays/${booking.stay.id}`} className="font-semibold text-foreground-950 hover:text-primary-700">
                    {booking.stay.title}
                  </Link>
                  <p className="text-foreground-600">{locationOfBooking(booking)}</p>
                  <Link to={`/stays/${booking.stay.slug}`} className="text-sm font-semibold text-primary-700 hover:underline">
                    View public listing
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-foreground-500">Stay removed.</p>
              )}
            </Card>

            <Card title="Guest details" icon="ri-user-line">
              <div className="flex flex-col gap-2 text-sm">
                <p className="font-semibold text-foreground-950">{booking.guest_name}</p>
                <p className="text-foreground-600">{booking.guest_phone}</p>
                {booking.guest_email && <p className="text-foreground-600">{booking.guest_email}</p>}
                <div className="mt-1 flex flex-wrap gap-2">
                  <a href={`tel:${booking.guest_phone}`} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                    <i className="ri-phone-line"></i> Call guest
                  </a>
                  {booking.guest_email && (
                    <a href={`mailto:${booking.guest_email}`} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                      <i className="ri-mail-line"></i> Email guest
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <Card title="Booking timeline" icon="ri-history-line" bodyClassName="p-0">
            <ul className="divide-y divide-background-100">
              <li className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-background-100 text-foreground-600"><i className="ri-add-circle-line"></i></span>
                <p className="flex-1 text-sm text-foreground-800">Booking created</p>
                <span className="text-xs text-foreground-500">{new Date(booking.created_at).toLocaleString()}</span>
              </li>
              <li className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary-100 text-secondary-900"><i className="ri-login-circle-line"></i></span>
                <p className="flex-1 text-sm text-foreground-800">Scheduled check-in</p>
                <span className="text-xs text-foreground-500">{booking.check_in}</span>
              </li>
              <li className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-100 text-accent-800"><i className="ri-logout-circle-line"></i></span>
                <p className="flex-1 text-sm text-foreground-800">Scheduled check-out</p>
                <span className="text-xs text-foreground-500">{booking.check_out}</span>
              </li>
              <li className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-background-100 text-foreground-600"><i className="ri-edit-line"></i></span>
                <p className="flex-1 text-sm text-foreground-800">Last updated</p>
                <span className="text-xs text-foreground-500">{new Date(booking.updated_at).toLocaleString()}</span>
              </li>
            </ul>
          </Card>

          <Card title="Internal notes" icon="ri-sticky-note-line">
            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add a note for the operations team…"
              className={`${inputClass} resize-y`}
            />
            <p className="mt-2 text-xs text-foreground-500">Notes stay on this screen for the current review session.</p>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card title="Booking summary" icon="ri-money-dollar-circle-line">
            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex items-center justify-between"><dt className="text-foreground-600">Nightly cost × {nights}</dt><dd className="font-medium text-foreground-900">{formatPKR(booking.subtotal, booking.currency)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-foreground-600">Cleaning fee</dt><dd className="font-medium text-foreground-900">{formatPKR(booking.cleaning_fee, booking.currency)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-foreground-600">Service fee</dt><dd className="font-medium text-foreground-900">{formatPKR(booking.service_fee, booking.currency)}</dd></div>
              {booking.discount > 0 && (
                <div className="flex items-center justify-between"><dt className="text-foreground-600">Discount</dt><dd className="font-medium text-accent-700">− {formatPKR(booking.discount, booking.currency)}</dd></div>
              )}
              <div className="mt-1 flex items-center justify-between border-t border-background-200 pt-3">
                <dt className="font-semibold text-foreground-950">Total</dt>
                <dd className="font-heading text-lg font-bold text-primary-700">{formatPKR(booking.total, booking.currency)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-col gap-2.5 border-t border-background-200 pt-4 text-sm">
              <div className="flex items-center justify-between"><dt className="text-foreground-600">Amount paid</dt><dd className="font-medium text-foreground-900">{formatPKR(amountPaid, booking.currency)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-foreground-600">Host earning</dt><dd className="font-medium text-foreground-900">{formatPKR(hostNet, booking.currency)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-foreground-600">ZAMIN revenue</dt><dd className="font-medium text-primary-700">{formatPKR(booking.service_fee, booking.currency)}</dd></div>
            </div>
          </Card>

          <Card title="Actions" icon="ri-flashlight-line">
            <div className="flex flex-col gap-2">
              {FLOW.filter((action) => action.next !== booking.status).map((action) => (
                <button
                  key={action.next}
                  type="button"
                  disabled={busy}
                  onClick={() => runAction(action.next)}
                  className={`${action.primary ? btnPrimary : btnGhost} w-full justify-center`}
                >
                  <i className={`${action.icon} text-base`}></i> {action.label}
                </button>
              ))}
              <button type="button" disabled={busy} onClick={() => setCancelOpen(true)} className={`${btnSmall} mt-1 w-full justify-center border-primary-200 py-2.5 text-primary-700 hover:bg-primary-50`}>
                <i className="ri-close-circle-line"></i> Cancel Booking
              </button>
              <a href={`tel:${booking.guest_phone}`} className={`${btnGhost} w-full justify-center`}>
                <i className="ri-phone-line text-base"></i> Contact Guest
              </a>
              {booking.stay && (
                <Link to={`/admin/stays/${booking.stay.id}`} className={`${btnGhost} w-full justify-center`}>
                  <i className="ri-customer-service-2-line text-base"></i> Contact Host
                </Link>
              )}
            </div>
          </Card>
        </div>
      </div>

      {booking.notes && (
        <div className="mt-6">
          <div className={tableWrap}>
            <table className="w-full text-left text-sm">
              <thead className={theadClass}><tr><th className={thClass}>Guest note</th></tr></thead>
              <tbody><tr className="border-t border-background-100"><td className={tdClass}>{booking.notes}</td></tr></tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel this booking?"
        message={`${booking.reference} will be marked as cancelled. The dates are released for rebooking.`}
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        tone="accent"
        busy={busy}
        onConfirm={() => runAction('CANCELLED')}
        onCancel={() => setCancelOpen(false)}
      />
    </AdminLayout>
  );
}