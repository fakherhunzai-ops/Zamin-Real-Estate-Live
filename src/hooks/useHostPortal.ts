import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchHostBookings, fetchHostProfile, fetchHostStays } from '@/utils/hostPortal';
import { hostNetOf } from '@/utils/stayOps';
import type { Booking, Host, Stay } from '@/types/stays';

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

/** Everything the signed-in host can see: their stays, bookings and earnings. */
export function useHostPortal() {
  const [stays, setStays] = useState<Stay[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [staysData, bookingsData, profileData] = await Promise.all([
        fetchHostStays(),
        fetchHostBookings(),
        fetchHostProfile(),
      ]);
      setStays(staysData);
      setBookings(bookingsData);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your host data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const metrics = useMemo(() => {
    const today = iso(new Date());
    const in30 = iso(new Date(Date.now() + 30 * 86_400_000));
    const stayIds = new Set(stays.map((stay) => stay.id));
    const ownBookings = bookings.filter((booking) => stayIds.has(booking.stay_id));

    const published = stays.filter((stay) => stay.status === 'PUBLISHED');
    const upcoming = ownBookings
      .filter((booking) => booking.status === 'CONFIRMED' && booking.check_in >= today)
      .sort((a, b) => a.check_in.localeCompare(b.check_in));
    const revenueBookings = ownBookings.filter((booking) => REVENUE_STATUSES.has(booking.status));

    const grossRevenue = revenueBookings.reduce((sum, booking) => sum + (booking.total || 0), 0);
    const netEarnings = revenueBookings.reduce((sum, booking) => sum + hostNetOf(booking), 0);
    const pendingPayout = ownBookings
      .filter((booking) => booking.status === 'CHECKED_OUT')
      .reduce((sum, booking) => sum + hostNetOf(booking), 0);

    const totalNights = published.length * 30;
    const bookedNights = ownBookings
      .filter((booking) => booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN')
      .reduce((sum, booking) => sum + overlapNights(booking.check_in, booking.check_out, today, in30), 0);
    const occupancy = totalNights > 0 ? Math.round((bookedNights / totalNights) * 100) : 0;

    const avgNightly =
      published.length > 0
        ? Math.round(published.reduce((sum, stay) => sum + (stay.base_nightly_rate || 0), 0) / published.length)
        : 0;

    return {
      listings: stays.length,
      published: published.length,
      upcomingCount: upcoming.length,
      activeBookings: ownBookings.filter(
        (booking) => booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN',
      ).length,
      grossRevenue,
      netEarnings,
      pendingPayout,
      occupancy,
      avgNightly,
    };
  }, [stays, bookings]);

  return {
    stays,
    bookings,
    profile,
    metrics,
    loading,
    error,
    refetch: fetchData,
  };
}