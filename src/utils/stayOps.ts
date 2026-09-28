import type { Booking, BookingStatus } from '@/types/stays';

export type DerivedPaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';

export const PAYMENT_STATUS_META: Record<DerivedPaymentStatus, { label: string; className: string; icon: string }> = {
  PAID: { label: 'Paid', className: 'bg-primary-100 text-primary-800', icon: 'ri-checkbox-circle-line' },
  PENDING: { label: 'Pending', className: 'bg-secondary-100 text-secondary-900', icon: 'ri-time-line' },
  FAILED: { label: 'Failed', className: 'bg-background-200 text-foreground-600', icon: 'ri-close-circle-line' },
  REFUNDED: { label: 'Refunded', className: 'bg-background-200 text-foreground-600', icon: 'ri-refund-2-line' },
};

/** Payment state derived from the authoritative booking status. */
export function paymentStatusOf(status: BookingStatus): DerivedPaymentStatus {
  if (status === 'CONFIRMED' || status === 'CHECKED_IN' || status === 'CHECKED_OUT') return 'PAID';
  if (status === 'CANCELLED') return 'FAILED';
  if (status === 'REFUNDED') return 'REFUNDED';
  return 'PENDING';
}

/** Platform commission (service fee) for a booking. */
export function commissionOf(booking: Booking): number {
  return booking.service_fee || 0;
}

/** Host net amount = booking total minus the platform service fee. */
export function hostNetOf(booking: Booking): number {
  return (booking.total || 0) - commissionOf(booking);
}

export type PayoutStatus = 'PENDING' | 'SCHEDULED' | 'NOT_DUE';

/** Payout state once a stay is completed. */
export function payoutStatusOf(status: BookingStatus): PayoutStatus {
  if (status === 'CHECKED_OUT') return 'PENDING';
  if (status === 'CONFIRMED' || status === 'CHECKED_IN') return 'SCHEDULED';
  return 'NOT_DUE';
}

export type CleaningTask = {
  booking: Booking;
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED';
  urgent: boolean;
};

/** Turnover tasks derived from bookings (a cleaning is due after every stay). */
export function cleaningTasksFromBookings(bookings: Booking[]): CleaningTask[] {
  const today = new Date().toISOString().slice(0, 10);
  return bookings
    .filter((booking) => booking.status === 'CHECKED_OUT' || booking.status === 'CHECKED_IN' || booking.status === 'CONFIRMED')
    .map((booking) => {
      const status: CleaningTask['status'] =
        booking.status === 'CHECKED_OUT'
          ? 'TO_DO'
          : booking.status === 'CHECKED_IN'
            ? 'IN_PROGRESS'
            : 'COMPLETED';
      const urgent = booking.status === 'CHECKED_OUT' && booking.check_out >= today;
      return { booking, status, urgent };
    })
    .sort((a, b) => a.booking.check_out.localeCompare(b.booking.check_out));
}

export function locationOfBooking(booking: Booking): string {
  return [booking.stay?.area?.name, booking.stay?.destination?.name].filter(Boolean).join(', ') || '—';
}