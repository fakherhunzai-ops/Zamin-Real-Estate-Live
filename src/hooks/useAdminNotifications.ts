import { useMemo } from 'react';
import { useStays } from '@/hooks/useStays';
import { useBookings } from '@/hooks/useBookings';

export type AdminNotification = {
  id: string;
  title: string;
  message: string;
  icon: string;
  tone: 'info' | 'warn' | 'urgent';
  to: string;
};

function iso(offsetDays = 0): string {
  return new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
}

/** Notification-center feed derived from real stays + bookings. */
export function useAdminNotifications() {
  const { stays, refetch: refetchStays } = useStays({ includeDrafts: true });
  const { bookings, refetch: refetchBookings } = useBookings();

  const notifications = useMemo<AdminNotification[]>(() => {
    const today = iso(0);
    const in3 = iso(3);
    const tomorrow = iso(1);
    const list: AdminNotification[] = [];

    stays
      .filter((stay) => stay.status === 'PENDING')
      .slice(0, 4)
      .forEach((stay) => {
        list.push({
          id: `stay-${stay.id}`,
          title: 'New stay submitted',
          message: `${stay.title} is awaiting verification.`,
          icon: 'ri-shield-star-line',
          tone: 'info',
          to: '/admin/stays/pending',
        });
      });

    bookings
      .filter((booking) => booking.status === 'CONFIRMED' && booking.check_in >= today && booking.check_in <= in3)
      .slice(0, 3)
      .forEach((booking) => {
        list.push({
          id: `in-${booking.id}`,
          title: 'Upcoming check-in',
          message: `${booking.guest_name} · ${booking.check_in}`,
          icon: 'ri-login-circle-line',
          tone: 'info',
          to: `/admin/bookings/${booking.id}`,
        });
      });

    bookings
      .filter((booking) => booking.status === 'CHECKED_IN' && booking.check_out === tomorrow)
      .slice(0, 3)
      .forEach((booking) => {
        list.push({
          id: `clean-${booking.id}`,
          title: 'Cleaning required',
          message: `${booking.guest_name} checks out tomorrow.`,
          icon: 'ri-brush-line',
          tone: 'warn',
          to: '/admin/operations/cleaning',
        });
      });

    bookings
      .filter((booking) => booking.status === 'AWAITING_PAYMENT')
      .slice(0, 2)
      .forEach((booking) => {
        list.push({
          id: `pay-${booking.id}`,
          title: 'Payment pending',
          message: `${booking.reference} · awaiting payment.`,
          icon: 'ri-bank-card-line',
          tone: 'warn',
          to: `/admin/bookings/${booking.id}`,
        });
      });

    if (bookings.some((booking) => booking.status === 'CHECKED_OUT')) {
      list.push({
        id: 'payouts',
        title: 'Host payouts pending',
        message: 'Completed stays are ready for settlement.',
        icon: 'ri-hand-coin-line',
        tone: 'info',
        to: '/admin/payouts',
      });
    }

    return list.slice(0, 8);
  }, [stays, bookings]);

  return {
    notifications,
    count: notifications.length,
    refetch: () => {
      refetchStays();
      refetchBookings();
    },
  };
}