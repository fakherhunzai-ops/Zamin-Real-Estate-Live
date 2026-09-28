import { useState } from 'react';
import { Link } from 'react-router-dom';
import PrintButton from '@/components/base/PrintButton';
import StayReviewForm from '@/pages/booking/components/StayReviewForm';
import { BOOKING_STATUS_META, formatPKR } from '@/utils/stays';
import { SITE } from '@/utils/site';
import type { BookingConfirmation } from '@/types/stays';

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (!Number.isFinite(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BookingConfirmationCard({ booking }: { booking: BookingConfirmation }) {
  const [copied, setCopied] = useState(false);
  const meta = BOOKING_STATUS_META[booking.status];
  const location = [booking.area, booking.destination].filter(Boolean).join(', ');
  const basePath = __BASE_PATH__.replace(/\/+$/, '');
  const shareUrl = `${window.location.origin}${basePath}/booking/${booking.reference}`;
  const shareText = `My ZAMIN Stays booking ${booking.reference}${
    booking.stay_title ? ` — ${booking.stay_title}` : ''
  }: ${booking.check_in} to ${booking.check_out}.`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const row = 'flex items-center justify-between gap-4 py-2.5 text-sm';
  const divider = 'border-t border-background-200';

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="print-area rounded-card border border-background-200 bg-background-50 p-6 md:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={SITE.logo} alt={`${SITE.brand} logo`} className="h-11 w-auto object-contain" />
            <div>
              <p className="font-label text-[11px] font-bold uppercase tracking-[0.18em] text-accent-700">
                ZAMIN Stays
              </p>
              <p className="text-sm font-semibold text-foreground-800">Booking confirmation</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${meta.className}`}>
            <i className={meta.icon}></i>
            {meta.label}
          </span>
        </div>

        <div className={`mt-6 flex flex-wrap items-end justify-between gap-4 ${divider} pt-6`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-500">Reference</p>
            <p className="mt-1 font-mono text-xl font-bold tracking-wide text-foreground-950">{booking.reference}</p>
          </div>
          <p className="text-xs text-foreground-500">
            Booked {new Date(booking.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className={`mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 ${divider} pt-6`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-500">Stay</p>
            <p className="mt-1 text-sm font-semibold text-foreground-950">
              {booking.stay_title ?? 'Stay no longer listed'}
            </p>
            {location && <p className="text-sm text-foreground-600">{location}</p>}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-500">Guest</p>
            <p className="mt-1 text-sm font-semibold text-foreground-950">{booking.guest_name}</p>
            <p className="text-sm text-foreground-600">
              {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'} · {booking.nights}{' '}
              {booking.nights === 1 ? 'night' : 'nights'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-500">Check-in</p>
            <p className="mt-1 text-sm font-semibold text-foreground-950">{formatDate(booking.check_in)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-500">Check-out</p>
            <p className="mt-1 text-sm font-semibold text-foreground-950">{formatDate(booking.check_out)}</p>
          </div>
        </div>

        <div className={`mt-6 ${divider} pt-6`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-500">Price breakdown</p>
          <div className="mt-3">
            <div className={row}>
              <span className="text-foreground-700">
                {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
              </span>
              <span className="text-foreground-900">{formatPKR(booking.subtotal, booking.currency)}</span>
            </div>
            {booking.cleaning_fee > 0 && (
              <div className={row}>
                <span className="text-foreground-700">Cleaning fee</span>
                <span className="text-foreground-900">{formatPKR(booking.cleaning_fee, booking.currency)}</span>
              </div>
            )}
            {booking.service_fee > 0 && (
              <div className={row}>
                <span className="text-foreground-700">Service fee</span>
                <span className="text-foreground-900">{formatPKR(booking.service_fee, booking.currency)}</span>
              </div>
            )}
            {booking.discount > 0 && (
              <div className={row}>
                <span className="text-accent-700">Long-stay discount</span>
                <span className="text-accent-700">-{formatPKR(booking.discount, booking.currency)}</span>
              </div>
            )}
            <div className={`${divider} mt-2 flex items-center justify-between pt-3`}>
              <span className="font-heading text-base font-bold text-foreground-950">Total</span>
              <span className="font-heading text-xl font-bold text-primary-700">
                {formatPKR(booking.total, booking.currency)}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-foreground-500">
          <i className="ri-information-line mt-0.5"></i>
          This confirmation reflects the reservation recorded on ZAMIN Stays. Payment is arranged
          directly with our team. For help with this booking, contact{' '}
          <a href={SITE.phoneHref} className="font-semibold text-primary-700">{SITE.phoneDisplay}</a>.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <PrintButton label="Print / Save as PDF" />
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
        >
          <i className="ri-whatsapp-line text-base"></i>
          Share on WhatsApp
        </a>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 bg-background-50 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
        >
          <i className={`${copied ? 'ri-check-line' : 'ri-link'} text-base`}></i>
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        {booking.stay_slug && (
          <Link
            to={`/stays/${booking.stay_slug}`}
            className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:text-primary-700"
          >
            <i className="ri-arrow-right-line text-base"></i>
            View the stay
          </Link>
        )}
      </div>

      <StayReviewForm booking={booking} />
    </div>
  );
}