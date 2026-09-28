import { useState } from 'react';
import type { FormEvent } from 'react';
import { SITE } from '@/utils/site';
import { formatPKR } from '@/utils/stays';
import { createStayBooking, type CreateStayBookingResult } from '@/utils/stayBooking';
import type { Stay, StayQuote } from '@/types/stays';
import { Link } from 'react-router-dom';

type Props = {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  guests: string;
  quote: StayQuote | null;
  nights: number;
  unavailable: boolean;
  onBooked: () => void;
};

type Errors = Record<string, string>;

const REASON_MESSAGES: Record<string, string> = {
  UNAVAILABLE: 'Those dates are no longer available. Please pick different dates.',
  INVALID_DATES: 'Please choose a valid check-in and check-out.',
  OVER_CAPACITY: 'That is more guests than this stay allows.',
  STAY_UNAVAILABLE: 'This stay is not accepting bookings right now.',
  NAME_REQUIRED: 'Please enter your name.',
  PHONE_REQUIRED: 'Please enter your phone number.',
};

export default function StayReservationForm({
  stay,
  checkIn,
  checkOut,
  guests,
  quote,
  nights,
  unavailable,
  onBooked,
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<CreateStayBookingResult | null>(null);

  const location = [stay.area?.name, stay.destination?.name].filter(Boolean).join(', ');
  const whatsappHref = `${SITE.whatsappHref}?text=${encodeURIComponent(
    `Hi ZAMIN, I'd like to book "${stay.title}"${location ? ` (${location})` : ''}${
      nights > 0 ? ` for ${nights} ${nights === 1 ? 'night' : 'nights'} from ${checkIn} to ${checkOut}` : ''
    } for ${guests} guests.`,
  )}`;

  const inputClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = 'Please enter your name.';
    if (!phone.trim()) next.phone = 'Please enter your phone number.';
    const trimmedEmail = email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      next.email = 'Enter a valid email address.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (nights <= 0) {
      setStatus('error');
      setErrorMsg('Please choose a valid check-in and check-out date.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    try {
      const data = await createStayBooking({
        stayId: stay.id,
        checkIn,
        checkOut,
        guests: Number(guests) || 1,
        guestName: name.trim(),
        guestPhone: phone.trim(),
        guestEmail: trimmedEmail || null,
        notes: message.trim() || null,
      });
      if (!data.success) {
        setStatus('error');
        setErrorMsg(REASON_MESSAGES[data.reason ?? ''] ?? 'We could not confirm those dates. Please try again.');
        return;
      }
      setResult(data);
      setStatus('success');
      onBooked();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success' && result) {
    return (
      <div className="rounded-card border border-accent-300 bg-accent-100/60 p-5 md:p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-2xl text-background-50">
          <i className="ri-check-line"></i>
        </span>
        <h2 className="mt-4 font-heading text-xl font-semibold text-foreground-950">Reservation requested</h2>
        <p className="mt-1.5 text-sm text-foreground-700">
          Thank you, {name.split(' ')[0] || 'there'} — we&apos;ve reserved your dates and ZAMIN will
          confirm availability and payment with you shortly.
        </p>

        <dl className="mt-4 grid grid-cols-1 gap-3 rounded-md border border-background-200 bg-background-50 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-foreground-600">Reference</dt>
            <dd className="font-mono font-semibold text-foreground-900">{result.reference}</dd>
          </div>
          <div>
            <dt className="text-foreground-600">Dates</dt>
            <dd className="font-semibold text-foreground-900">{checkIn} → {checkOut}</dd>
          </div>
          <div>
            <dt className="text-foreground-600">Guests</dt>
            <dd className="font-semibold text-foreground-900">{guests}</dd>
          </div>
          <div>
            <dt className="text-foreground-600">Estimated total</dt>
            <dd className="font-semibold text-primary-700">
              {formatPKR(result.quote?.total ?? quote?.total ?? 0, stay.currency)}
            </dd>
          </div>
        </dl>

        <Link
          to={`/booking/${result.reference}`}
          className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
        >
          <i className="ri-file-text-line text-base"></i>
          View / print your confirmation
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <a href={SITE.phoneHref} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-primary-300 px-3 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50">
            <i className="ri-phone-line text-base"></i>
            Call {SITE.phoneDisplay}
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-primary-300 px-3 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50">
            <i className="ri-whatsapp-line text-base"></i>
            Message on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="stay-reservation" className="rounded-card border border-background-200 bg-background-50 p-5 md:p-6">
      <h2 className="font-heading text-xl font-semibold text-foreground-950">Reserve this stay</h2>
      <p className="mt-1 text-sm text-foreground-600">
        Confirm your dates and details — availability and the total are checked on the server before
        your request is created.
      </p>

      <div className="mt-4 rounded-md border border-background-200 bg-background-100 p-3 text-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-2 text-foreground-700">
            <i className="ri-calendar-line text-accent-600"></i>
            {nights > 0 ? `${checkIn} → ${checkOut}` : 'Choose your dates'}
          </span>
          <span className="flex items-center gap-2 text-foreground-700">
            <i className="ri-group-line text-accent-600"></i>
            {guests} guests · {Math.max(0, nights)} {nights === 1 ? 'night' : 'nights'}
          </span>
          {quote && quote.nights > 0 && (
            <span className="flex items-center gap-2 font-semibold text-primary-700">
              <i className="ri-money-rupee-circle-line"></i>
              {formatPKR(quote.total, stay.currency)} total
            </span>
          )}
        </div>
      </div>

      {unavailable ? (
        <p className="mt-4 flex items-start gap-2 rounded-md bg-background-200 px-3 py-2.5 text-sm text-foreground-700">
          <i className="ri-calendar-close-line mt-0.5"></i>
          Those dates aren&apos;t available. Please choose different dates in the booking card, then
          reserve again.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="rs-name" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Name</label>
            <input id="rs-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} />
            {errors.name && <span className="text-xs text-primary-700">{errors.name}</span>}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="rs-phone" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Phone</label>
              <input id="rs-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 3XX XXXXXXX" className={inputClass} />
              {errors.phone && <span className="text-xs text-primary-700">{errors.phone}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="rs-email" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Email (optional)</label>
              <input id="rs-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputClass} />
              {errors.email && <span className="text-xs text-primary-700">{errors.email}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="rs-message" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Message (optional)</label>
            <textarea id="rs-message" rows={3} maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Anything we should know about your trip?" className={`${inputClass} resize-none`}></textarea>
            <span className="text-right text-xs text-foreground-500">{message.length}/500</span>
          </div>

          {status === 'error' && (
            <p className="flex items-start gap-2 rounded-md bg-primary-50 px-3 py-2.5 text-sm text-primary-800">
              <i className="ri-error-warning-line mt-0.5"></i>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || nights <= 0}
            className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-foreground-950"
          >
            {status === 'loading' ? (
              <>
                <i className="ri-loader-4-line animate-spin text-base"></i>
                Checking availability…
              </>
            ) : (
              <>
                <i className="ri-calendar-check-line text-base"></i>
                Request reservation
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}