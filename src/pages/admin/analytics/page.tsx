import { useMemo, useState } from 'react';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  StatCard,
  btnGhost,
  inputClass,
  labelClass,
  selectClass,
} from '@/pages/admin/components/AdminUI';
import { useStays } from '@/hooks/useStays';
import { useBookings } from '@/hooks/useBookings';
import { formatPKR } from '@/utils/stays';
import { hostNetOf } from '@/utils/stayOps';

function BarChart({ data, format }: { data: { label: string; value: number }[]; format?: (value: number) => string }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  if (data.length === 0) return <p className="py-8 text-center text-sm text-foreground-500">No data in this range.</p>;
  return (
    <div className="flex h-48 items-end gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-primary-500/85 transition-all hover:bg-primary-600"
              style={{ height: `${Math.max(4, (item.value / max) * 100)}%` }}
              title={`${item.label}: ${format ? format(item.value) : item.value}`}
            />
          </div>
          <span className="truncate text-[10px] font-medium text-foreground-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { stays, loading: staysLoading, error: staysError, refetch: refetchStays } = useStays({ includeDrafts: true });
  const { bookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useBookings();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [destination, setDestination] = useState('ALL');
  const [stayId, setStayId] = useState('ALL');

  const destinations = useMemo(() => {
    const map = new Map<string, string>();
    stays.forEach((stay) => {
      if (stay.destination) map.set(stay.destination.id, stay.destination.name);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [stays]);

  const scopedStays = useMemo(
    () => stays.filter((stay) => (destination === 'ALL' ? true : stay.destination_id === destination)),
    [stays, destination],
  );
  const scopedIds = useMemo(() => new Set(scopedStays.map((stay) => stay.id)), [scopedStays]);

  const scopedBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        if (stayId !== 'ALL' && booking.stay_id !== stayId) return false;
        if (!scopedIds.has(booking.stay_id)) return false;
        if (from && booking.check_in < from) return false;
        if (to && booking.check_in > to) return false;
        return true;
      }),
    [bookings, scopedIds, stayId, from, to],
  );

  const metrics = useMemo(() => {
    const active = scopedBookings.filter((booking) => booking.status !== 'CANCELLED' && booking.status !== 'REFUNDED');
    const cancelled = scopedBookings.filter((booking) => booking.status === 'CANCELLED');
    const revenue = active.reduce((sum, booking) => sum + (booking.total || 0), 0);
    const nights = active.reduce((sum, booking) => sum + (booking.nights || 0), 0);
    const zamin = active.reduce((sum, booking) => sum + (booking.service_fee || 0), 0);
    const payouts = scopedBookings.filter((booking) => booking.status === 'CHECKED_OUT').reduce((sum, booking) => sum + hostNetOf(booking), 0);
    const confirmed = active.length;
    const cancellationRate = scopedBookings.length > 0 ? Math.round((cancelled.length / scopedBookings.length) * 100) : 0;

    const start = from ? new Date(`${from}T00:00:00`) : new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
    const end = to ? new Date(`${to}T00:00:00`) : new Date();
    const dayCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));

    const capacity = scopedStays.filter((stay) => stay.status === 'PUBLISHED').length * dayCount;
    const occupancy = capacity > 0 ? Math.round((nights / capacity) * 100) : 0;

    const revenueByMonth = new Map<string, number>();
    active.forEach((booking) => {
      const key = booking.check_in.slice(0, 7);
      revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + booking.total);
    });
    const bookingsByMonth = new Map<string, number>();
    active.forEach((booking) => {
      const key = booking.check_in.slice(0, 7);
      bookingsByMonth.set(key, (bookingsByMonth.get(key) ?? 0) + 1);
    });
    const revenueByDestination = new Map<string, number>();
    active.forEach((booking) => {
      const name = booking.stay?.destination?.name ?? 'Unassigned';
      revenueByDestination.set(name, (revenueByDestination.get(name) ?? 0) + booking.total);
    });

    return {
      revenue,
      confirmed,
      occupancy,
      adr: nights > 0 ? Math.round(revenue / nights) : 0,
      avgStay: confirmed > 0 ? (nights / confirmed).toFixed(1) : '0',
      cancellationRate,
      zamin,
      payouts,
      revenueByMonth: [...revenueByMonth.entries()].sort().slice(-6).map(([label, value]) => ({ label, value })),
      bookingsByMonth: [...bookingsByMonth.entries()].sort().slice(-6).map(([label, value]) => ({ label, value })),
      revenueByDestination: [...revenueByDestination.entries()].map(([label, value]) => ({ label, value })),
    };
  }, [scopedBookings, scopedStays, from, to]);

  const loading = staysLoading || bookingsLoading;
  const error = staysError || bookingsError;
  const refresh = () => { refetchStays(); refetchBookings(); };

  return (
    <AdminLayout title="Analytics" subtitle="Booking performance across ZAMIN Stays.">
      <div className="mb-6 flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-1.5"><span className={labelClass}>From</span><input type="date" className={inputClass} value={from} onChange={(event) => setFrom(event.target.value)} /></label>
          <label className="flex flex-col gap-1.5"><span className={labelClass}>To</span><input type="date" className={inputClass} value={to} onChange={(event) => setTo(event.target.value)} /></label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Destination</span>
            <select className={selectClass} value={destination} onChange={(event) => { setDestination(event.target.value); setStayId('ALL'); }}>
              <option value="ALL">All destinations</option>
              {destinations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Stay</span>
            <select className={selectClass} value={stayId} onChange={(event) => setStayId(event.target.value)}>
              <option value="ALL">All stays</option>
              {scopedStays.map((stay) => <option key={stay.id} value={stay.id}>{stay.title}</option>)}
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load analytics." onRetry={refresh} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="ri-line-chart-line"
          title="No booking data yet."
          message="Analytics populate automatically as bookings come in."
          action={<button type="button" onClick={refresh} className={btnGhost}><i className="ri-refresh-line text-base"></i> Refresh</button>}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Booking Revenue" value={formatPKR(metrics.revenue)} icon="ri-money-dollar-circle-line" tone="primary" />
            <StatCard label="Confirmed Bookings" value={metrics.confirmed} icon="ri-calendar-check-line" />
            <StatCard label="Occupancy" value={`${metrics.occupancy}%`} icon="ri-pie-chart-2-line" tone="accent" />
            <StatCard label="Average Daily Rate" value={formatPKR(metrics.adr)} icon="ri-price-tag-3-line" />
            <StatCard label="Avg Stay Length" value={`${metrics.avgStay} nights`} icon="ri-hotel-bed-line" />
            <StatCard label="Cancellation Rate" value={`${metrics.cancellationRate}%`} icon="ri-close-circle-line" />
            <StatCard label="ZAMIN Revenue" value={formatPKR(metrics.zamin)} icon="ri-hand-coin-line" />
            <StatCard label="Host Payouts" value={formatPKR(metrics.payouts)} icon="ri-wallet-3-line" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card title="Revenue Over Time" icon="ri-line-chart-line">
              <BarChart data={metrics.revenueByMonth} format={(value) => formatPKR(value)} />
            </Card>
            <Card title="Bookings Over Time" icon="ri-bar-chart-2-line">
              <BarChart data={metrics.bookingsByMonth} />
            </Card>
            <Card title="Revenue by Destination" icon="ri-map-pin-2-line">
              <BarChart data={metrics.revenueByDestination} format={(value) => formatPKR(value)} />
            </Card>
            <Card title="Occupancy by Property" icon="ri-home-4-line">
              <div className="flex flex-col gap-3">
                {scopedStays.slice(0, 6).map((stay) => {
                  const nights = scopedBookings
                    .filter((booking) => booking.stay_id === stay.id && booking.status !== 'CANCELLED')
                    .reduce((sum, booking) => sum + (booking.nights || 0), 0);
                  const pct = Math.min(100, Math.round((nights / 30) * 100));
                  return (
                    <div key={stay.id}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="truncate font-medium text-foreground-700">{stay.title}</span>
                        <span className="text-foreground-500">{nights} nights</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-background-200">
                        <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {scopedStays.length === 0 && <p className="text-sm text-foreground-500">No stays in this selection.</p>}
              </div>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}