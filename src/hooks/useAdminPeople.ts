import { useMemo } from 'react';
import { useStays } from '@/hooks/useStays';
import { useBookings } from '@/hooks/useBookings';
import type { Booking, Stay } from '@/types/stays';

export type HostSummary = {
  key: string;
  name: string;
  email: string | null;
  phone: string | null;
  stays: Stay[];
  managementTypes: string[];
  bookings: number;
  earnings: number;
  verified: boolean;
};

export type GuestSummary = {
  key: string;
  name: string;
  phone: string;
  email: string | null;
  totalBookings: number;
  completed: number;
  cancelled: number;
  totalSpend: number;
  joined: string;
  bookings: Booking[];
};

function hostKey(stay: Stay): string {
  return (stay.host_email || stay.host_phone || stay.host_name || 'unassigned').toLowerCase();
}

function guestKey(booking: Booking): string {
  return (booking.guest_phone || booking.guest_email || booking.guest_name || 'unknown').toLowerCase();
}

/** Host + guest directories derived from real stays and bookings. */
export function useAdminPeople() {
  const { stays, loading: staysLoading, error: staysError, refetch: refetchStays } = useStays({ includeDrafts: true });
  const { bookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useBookings();

  const hosts = useMemo<HostSummary[]>(() => {
    const map = new Map<string, HostSummary>();
    stays.forEach((stay) => {
      const key = hostKey(stay);
      const existing = map.get(key) ?? {
        key,
        name: stay.host_name || 'Unassigned host',
        email: stay.host_email,
        phone: stay.host_phone,
        stays: [],
        managementTypes: [],
        bookings: 0,
        earnings: 0,
        verified: true,
      };
      existing.name = existing.name || stay.host_name || 'Unassigned host';
      existing.email = existing.email || stay.host_email;
      existing.phone = existing.phone || stay.host_phone;
      existing.stays.push(stay);
      if (!existing.managementTypes.includes(stay.management_type)) {
        existing.managementTypes.push(stay.management_type);
      }
      if (!stay.verified) existing.verified = false;
      map.set(key, existing);
    });

    const stayToHost = new Map<string, string>();
    stays.forEach((stay) => stayToHost.set(stay.id, hostKey(stay)));
    bookings.forEach((booking) => {
      if (booking.status === 'CANCELLED') return;
      const host = map.get(stayToHost.get(booking.stay_id) ?? '');
      if (!host) return;
      host.bookings += 1;
      host.earnings += booking.total || 0;
    });

    return [...map.values()].sort((a, b) => b.stays.length - a.stays.length);
  }, [stays, bookings]);

  const guests = useMemo<GuestSummary[]>(() => {
    const map = new Map<string, GuestSummary>();
    bookings.forEach((booking) => {
      const key = guestKey(booking);
      const existing = map.get(key) ?? {
        key,
        name: booking.guest_name,
        phone: booking.guest_phone,
        email: booking.guest_email,
        totalBookings: 0,
        completed: 0,
        cancelled: 0,
        totalSpend: 0,
        joined: booking.created_at,
        bookings: [],
      };
      existing.totalBookings += 1;
      if (booking.status === 'CHECKED_OUT') existing.completed += 1;
      if (booking.status === 'CANCELLED') existing.cancelled += 1;
      if (booking.status !== 'CANCELLED' && booking.status !== 'REFUNDED') {
        existing.totalSpend += booking.total || 0;
      }
      if (booking.created_at < existing.joined) existing.joined = booking.created_at;
      existing.bookings.push(booking);
      map.set(key, existing);
    });

    return [...map.values()].sort((a, b) => b.totalSpend - a.totalSpend);
  }, [bookings]);

  return {
    hosts,
    guests,
    stays,
    bookings,
    loading: staysLoading || bookingsLoading,
    error: staysError || bookingsError,
    refetch: () => {
      refetchStays();
      refetchBookings();
    },
  };
}