import { useMemo } from 'react';
import { useStays } from '@/hooks/useStays';
import { useBookings } from '@/hooks/useBookings';
import type { Booking, Stay } from '@/types/stays';

export type AdminAlert = {
  id: string;
  tone: 'info' | 'warn' | 'urgent';
  icon: string;
  title: string;
  message: string;
  to?: string;
};

const REVENUE_STATUSES = new Set(['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT']);

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function overlapNights(start: string, end: string, rangeStart: string, rangeEnd: string): number {
  const a = start > rangeStart ? start : rangeStart;
  const b = end < rangeEnd ? end : rangeEnd;
  if (b <= a) return 0;
  const diff = new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime();
  return Math.max(0, Math.round(diff / 86_400_000));
}

/** Aggregated operational + financial metrics for the ZAMIN Stays dashboard. */
export function useAdminOverview() {
  const staysState = useStays({ includeDrafts: true });
  const bookingsState = useBookings();
  const { stays, loading: staysLoading, error: staysError, refetch: refetchStays } = staysState;
  const { bookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = bookingsState;

  const data = useMemo(() => {
    const today = iso(new Date());
    const in30 = iso(new Date(Date.now() + 30 * 86_400_000));
    const tomorrow = iso(new Date(Date.now() + 86_400_000));

    const published = stays.filter((stay) => stay.status === 'PUBLISHED');
    const pending = stays.filter((stay) => stay.status === 'PENDING');
    const managed = stays.filter((stay) => stay.management_type === 'MANAGED');

    const upcomingCheckInList = bookings
      .filter((booking) => booking.status === 'CONFIRMED' && booking.check_in >= today)
      .sort((a, b) => a.check_in.localeCompare(b.check_in));
    const upcomingCheckOutList = bookings
      .filter((booking) => booking.status === 'CHECKED_IN' && booking.check_out >= today)
      .sort((a, b) => a.check_out.localeCompare(b.check_out));

    const activeBookings = bookings.filter(
      (booking) => booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN',
    );

    const revenueBookings = bookings.filter((booking) => REVENUE_STATUSES.has(booking.status));
    const bookingRevenue = revenueBookings.reduce((sum, booking) => sum + (booking.total || 0), 0);
    const zaminRevenue = revenueBookings.reduce((sum, booking) => sum + (booking.service_fee || 0), 0);
    const pendingPayouts = bookings
      .filter((booking) => booking.status === 'CHECKED_OUT')
      .reduce((sum, booking) => sum + ((booking.total || 0) - (booking.service_fee || 0)), 0);

    const totalNights = published.length * 30;
    const bookedNights = bookings
      .filter((booking) => booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN')
      .reduce((sum, booking) => sum + overlapNights(booking.check_in, booking.check_out, today, in30), 0);
    const occupancyRate = totalNights > 0 ? Math.round((bookedNights / totalNights) * 100) : 0;

    const avgNightlyRate =
      published.length > 0
        ? Math.round(published.reduce((sum, stay) => sum + (stay.base_nightly_rate || 0), 0) / published.length)
        : 0;

    const recentBookings = [...bookings]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 6);

    const checkoutsTomorrow = bookings.filter(
      (booking) => booking.status === 'CHECKED_IN' && booking.check_out === tomorrow,
    );

    const alerts: AdminAlert[] = [];
    if (checkoutsTomorrow.length > 0) {
      alerts.push({
        id: 'cleaning',
        tone: 'warn',
        icon: 'ri-brush-line',
        title: `${checkoutsTomorrow.length} check-out${checkoutsTomorrow.length > 1 ? 's' : ''} tomorrow`,
        message: 'Cleaning and turnover required before the next check-in.',
        to: '/admin/operations/cleaning',
      });
    }
    if (pending.length > 0) {
      alerts.push({
        id: 'pending',
        tone: 'info',
        icon: 'ri-shield-star-line',
        title: `${pending.length} stay${pending.length > 1 ? 's' : ''} awaiting verification`,
        message: 'Review submitted host properties and approve or request changes.',
        to: '/admin/stays/pending',
      });
    }
    if (upcomingCheckInList.filter((booking) => booking.check_in === today).length > 0) {
      alerts.push({
        id: 'checkin-today',
        tone: 'urgent',
        icon: 'ri-login-circle-line',
        title: 'Guests checking in today',
        message: 'Confirm access details and welcome instructions.',
        to: '/admin/bookings',
      });
    }
    if (pendingPayouts > 0) {
      alerts.push({
        id: 'payouts',
        tone: 'info',
        icon: 'ri-hand-coin-line',
        title: 'Host payouts pending',
        message: 'Completed stays are ready for host settlement.',
        to: '/admin/payouts',
      });
    }

    return {
      metrics: {
        totalStays: stays.length,
        publishedStays: published.length,
        pendingVerification: pending.length,
        managedStays: managed.length,
        activeBookings: activeBookings.length,
        upcomingCheckIns: upcomingCheckInList.length,
        upcomingCheckOuts: upcomingCheckOutList.length,
        occupancyRate,
        bookingRevenue,
        zaminRevenue,
        pendingPayouts,
        avgNightlyRate,
      },
      upcomingCheckInList,
      upcomingCheckOutList,
      pendingStays: pending,
      recentBookings,
      alerts,
      bookingCountByStay: bookings.reduce<Record<string, number>>((acc, booking) => {
        acc[booking.stay_id] = (acc[booking.stay_id] ?? 0) + 1;
        return acc;
      }, {}),
    };
  }, [stays, bookings]);

  const refetch = () => {
    refetchStays();
    refetchBookings();
  };

  return {
    ...data,
    stays,
    bookings,
    loading: staysLoading || bookingsLoading,
    error: staysError || bookingsError,
    refetch,
  };
}

export type { Booking, Stay };