import { formatPKR, nightsBetween, estimateStay } from '@/utils/stays';
import type { Stay, StayQuote } from '@/types/stays';

type Props = {
  stay: Stay;
  checkIn: string;
  checkOut: string;
  guests: string;
  quote: StayQuote | null;
  quoteLoading: boolean;
  onCheckIn: (value: string) => void;
  onCheckOut: (value: string) => void;
  onGuests: (value: string) => void;
  onReserve: () => void;
};

export default function StayBookingCard({
  stay,
  checkIn,
  checkOut,
  guests,
  quote,
  quoteLoading,
  onCheckIn,
  onCheckOut,
  onGuests,
  onReserve,
}: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const nights = nightsBetween(checkIn, checkOut);
  const fallback = estimateStay(stay, nights);

  const usingQuote = Boolean(quote && quote.nights > 0);
  const subtotal = usingQuote ? quote!.nightly_subtotal : fallback.subtotal;
  const cleaningFee = usingQuote ? quote!.cleaning_fee : fallback.cleaningFee;
  const serviceFee = usingQuote ? quote!.service_fee : fallback.serviceFee;
  const discount = usingQuote ? quote!.discount : 0;
  const total = usingQuote ? quote!.total : fallback.total;
  const servicePct = usingQuote ? quote!.service_fee_percent : stay.service_fee_percent;
  const discountPct = usingQuote ? quote!.discount_percent : 0;

  const unavailable = Boolean(quote && quote.nights > 0 && !quote.available);
  const overCapacity = quote?.reason === 'OVER_CAPACITY';
  const canReserve = nights > 0 && !unavailable && !overCapacity;

  const fieldClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none';

  return (
    <div className="rounded-card border border-background-200 bg-background-50 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-heading text-2xl font-bold text-primary-700">
          {formatPKR(stay.base_nightly_rate, stay.currency)}
        </span>
        <span className="text-sm text-foreground-600">per night</span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="bk-checkin" className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground-500">
              Check-in
            </label>
            <input
              id="bk-checkin"
              type="date"
              min={today}
              value={checkIn}
              onChange={(event) => onCheckIn(event.target.value)}
              className={`mt-1.5 ${fieldClass}`}
            />
          </div>
          <div>
            <label htmlFor="bk-checkout" className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground-500">
              Check-out
            </label>
            <input
              id="bk-checkout"
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(event) => onCheckOut(event.target.value)}
              className={`mt-1.5 ${fieldClass}`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="bk-guests" className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground-500">
            Guests
          </label>
          <select
            id="bk-guests"
            value={guests}
            onChange={(event) => onGuests(event.target.value)}
            className={`mt-1.5 cursor-pointer ${fieldClass}`}
          >
            {Array.from({ length: Math.max(1, stay.guest_capacity) }).map((_, index) => (
              <option key={index + 1} value={String(index + 1)}>
                {index + 1} {index === 0 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 border-t border-background-200 pt-5 text-sm">
        {nights <= 0 ? (
          <p className="text-foreground-600">Select your dates to see a nights & pricing breakdown.</p>
        ) : (
          <>
            <div className="flex items-center justify-between text-foreground-700">
              <span>
                {formatPKR(usingQuote ? Math.round(subtotal / nights) : fallback.nightly, stay.currency)} × {nights}{' '}
                {nights === 1 ? 'night' : 'nights'}
              </span>
              <span>{formatPKR(subtotal, stay.currency)}</span>
            </div>
            {cleaningFee > 0 && (
              <div className="flex items-center justify-between text-foreground-700">
                <span>Cleaning fee</span>
                <span>{formatPKR(cleaningFee, stay.currency)}</span>
              </div>
            )}
            {serviceFee > 0 && (
              <div className="flex items-center justify-between text-foreground-700">
                <span>Service fee{servicePct > 0 ? ` (${servicePct}%)` : ''}</span>
                <span>{formatPKR(serviceFee, stay.currency)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex items-center justify-between text-accent-700">
                <span>Long-stay discount{discountPct > 0 ? ` (${discountPct}%)` : ''}</span>
                <span>-{formatPKR(discount, stay.currency)}</span>
              </div>
            )}
            <div className="mt-1 flex items-center justify-between border-t border-background-200 pt-3 font-semibold text-foreground-950">
              <span>Total</span>
              <span className="flex items-center gap-2">
                {quoteLoading && <i className="ri-loader-4-line animate-spin text-sm text-foreground-500"></i>}
                {formatPKR(total, stay.currency)}
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-foreground-500">
              <i className="ri-shield-check-line"></i>
              Calculated by ZAMIN — the final total is confirmed on the server.
            </p>
          </>
        )}
      </div>

      {unavailable && (
        <p className="mt-4 flex items-start gap-2 rounded-md bg-background-200 px-3 py-2.5 text-sm text-foreground-700">
          <i className="ri-calendar-close-line mt-0.5"></i>
          These dates overlap an existing booking or a blocked period. Please choose other dates.
        </p>
      )}
      {overCapacity && (
        <p className="mt-4 flex items-start gap-2 rounded-md bg-background-200 px-3 py-2.5 text-sm text-foreground-700">
          <i className="ri-group-line mt-0.5"></i>
          This stay accepts up to {stay.guest_capacity} guests. Reduce the guest count to continue.
        </p>
      )}

      <button
        type="button"
        onClick={onReserve}
        disabled={!canReserve}
        className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-foreground-950"
      >
        <i className="ri-calendar-check-line text-base"></i>
        {unavailable ? 'Dates unavailable' : 'Reserve this stay'}
      </button>

      <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-foreground-500">
        <i className="ri-information-line mt-0.5"></i>
        You won&apos;t be charged here. This creates a reservation request that ZAMIN confirms with you
        directly — payment is arranged offline.
      </p>
    </div>
  );
}