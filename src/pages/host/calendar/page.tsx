import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import HostLayout from '@/pages/host/components/HostLayout';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  Segmented,
  btnPrimary,
  btnSmall,
  inputClass,
  selectClass,
} from '@/pages/admin/components/AdminUI';
import { useHostPortal } from '@/hooks/useHostPortal';
import { useStayAvailabilityBlocks } from '@/hooks/useStayAdminData';
import { addAvailabilityBlock, deleteAvailabilityBlock } from '@/utils/stayAdmin';
import type { Booking, StayAvailabilityBlock, StayBlockReason } from '@/types/stays';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const REASONS: { value: StayBlockReason; label: string }[] = [
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OWNER_STAY', label: 'Owner stay' },
];

function ymd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function covers(day: string, start: string, end: string): boolean {
  return day >= start && day < end;
}

function buildMonthGrid(cursor: Date): string[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - offset);
  return Array.from({ length: 42 }).map((_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return ymd(day);
  });
}

export default function HostCalendarPage() {
  const [params, setParams] = useSearchParams();
  const { stays, bookings, loading, error, refetch } = useHostPortal();
  const { notify } = useAdminToast();

  const stayParam = params.get('stay') ?? '';
  const activeId = stayParam || stays[0]?.id || '';
  const activeStay = stays.find((stay) => stay.id === activeId) ?? null;

  const { blocks, refetch: refetchBlocks } = useStayAvailabilityBlocks(activeId || undefined);

  const [view, setView] = useState<'month' | 'week'>('month');
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [blockEnd, setBlockEnd] = useState('');
  const [reason, setReason] = useState<StayBlockReason>('BLOCKED');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const stayBookings = useMemo<Booking[]>(
    () =>
      bookings.filter(
        (booking) =>
          booking.stay_id === activeId && booking.status !== 'CANCELLED' && booking.status !== 'REFUNDED',
      ),
    [bookings, activeId],
  );

  const days = useMemo(() => {
    if (view === 'month') return buildMonthGrid(cursor);
    const first = new Date(cursor);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - offset);
    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return ymd(day);
    });
  }, [cursor, view]);

  const today = ymd(new Date());
  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const shift = (amount: number) => {
    const next = new Date(cursor);
    if (view === 'month') next.setMonth(cursor.getMonth() + amount);
    else next.setDate(cursor.getDate() + amount * 7);
    setCursor(next);
  };

  const selectStay = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('stay', value);
    else next.delete('stay');
    setParams(next, { replace: true });
    setSelectedDay(null);
  };

  const blockDay = async () => {
    if (!activeId || !selectedDay) return;
    const end = blockEnd || selectedDay;
    if (end < selectedDay) {
      notify({ title: 'Invalid range', message: 'End date must be on or after the start date.', tone: 'error' });
      return;
    }
    setBusy(true);
    try {
      const endExclusive = new Date(`${end}T00:00:00`);
      endExclusive.setDate(endExclusive.getDate() + 1);
      await addAvailabilityBlock(
        activeId,
        { start_date: selectedDay, end_date: ymd(endExclusive), reason, note: note.trim() || null },
        null,
      );
      await refetchBlocks();
      notify({ title: 'Dates blocked', message: `${selectedDay} → ${end}`, tone: 'success' });
      setSelectedDay(null);
      setBlockEnd('');
      setNote('');
    } catch (err) {
      notify({ title: 'Could not block dates', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const removeBlock = async (block: StayAvailabilityBlock) => {
    setBusy(true);
    try {
      await deleteAvailabilityBlock(block.id);
      await refetchBlocks();
      notify({ title: 'Block removed', tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not remove block', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <HostLayout title="My Calendar">
        <LoadingBlock rows={6} />
      </HostLayout>
    );
  }

  if (error) {
    return (
      <HostLayout title="My Calendar">
        <ErrorState message="Couldn’t load your calendar." onRetry={refetch} />
      </HostLayout>
    );
  }

  if (stays.length === 0) {
    return (
      <HostLayout title="My Calendar" subtitle="Bookings and blocked dates for your stays.">
        <EmptyState icon="ri-home-4-line" title="No listings yet." message="Your calendar appears once ZAMIN Stays adds your properties." />
      </HostLayout>
    );
  }

  return (
    <HostLayout
      title="My Calendar"
      subtitle="See your bookings and block dates you don’t want to sell."
      actions={
        <Link to="/host/stays" className={btnPrimary}>
          <i className="ri-home-4-line text-base"></i> My listings
        </Link>
      }
    >
      <div className="mb-4 flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => shift(-1)} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button type="button" onClick={() => setCursor(new Date())} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
              Today
            </button>
            <button type="button" onClick={() => shift(1)} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
          <span className="font-heading text-lg font-semibold text-foreground-950">{monthLabel}</span>
          <div className="ml-auto">
            <Segmented
              options={[{ value: 'month', label: 'Month' }, { value: 'week', label: 'Week' }]}
              value={view}
              onChange={(value) => setView(value as 'month' | 'week')}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <select className={selectClass} value={activeId} onChange={(event) => selectStay(event.target.value)}>
            {stays.map((stay) => (
              <option key={stay.id} value={stay.id}>{stay.title}</option>
            ))}
          </select>
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-foreground-600">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-primary-500" /> Booked</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-background-300" /> Blocked</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-accent-500" /> Maintenance</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card bodyClassName="p-0" className="overflow-hidden">
          <div className="grid grid-cols-7 border-b border-background-100 bg-background-100">
            {WEEKDAYS.map((day) => (
              <div key={day} className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-foreground-600">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const inMonth = view === 'week' || day.slice(0, 7) === ymd(cursor).slice(0, 7);
              const dayBookings = stayBookings.filter((booking) => covers(day, booking.check_in, booking.check_out));
              const dayBlocks = blocks.filter((block) => block.start_date <= day && block.end_date > day);
              const isToday = day === today;
              const chips = [
                ...dayBookings.map((booking) => ({ id: `b-${booking.id}`, label: booking.guest_name.split(' ')[0], tone: 'booked' as const })),
                ...dayBlocks.map((block) => ({
                  id: `k-${block.id}`,
                  label: block.reason === 'MAINTENANCE' ? 'Maintenance' : 'Blocked',
                  tone: block.reason === 'MAINTENANCE' ? ('maintenance' as const) : ('blocked' as const),
                })),
              ];
              return (
                <div key={day} className={`min-h-[92px] border-b border-r border-background-100 p-1.5 ${inMonth ? '' : 'bg-background-100/60'} ${view === 'week' ? 'min-h-[240px]' : ''}`}>
                  <div className="mb-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => { setSelectedDay(day); setBlockEnd(day); }}
                      className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        isToday ? 'bg-primary-800 text-background-50 dark:text-foreground-950' : 'text-foreground-700 hover:bg-background-200'
                      }`}
                    >
                      {Number(day.slice(-2))}
                    </button>
                    {chips.length > 2 && <span className="text-[10px] font-semibold text-foreground-500">+{chips.length - 2}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    {chips.slice(0, view === 'week' ? chips.length : 2).map((chip) => {
                      const chipClass =
                        chip.tone === 'booked'
                          ? 'bg-primary-500 text-background-50'
                          : chip.tone === 'maintenance'
                            ? 'bg-accent-500 text-background-50'
                            : 'bg-background-300 text-foreground-800';
                      return (
                        <span key={chip.id} className={`truncate rounded px-1.5 py-0.5 text-[10px] font-semibold ${chipClass}`} title={chip.label}>
                          {chip.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card title="Block dates" icon="ri-calendar-close-line">
            {!activeStay ? (
              <p className="text-sm text-foreground-600">Select a property to block dates.</p>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-foreground-600">
                  Blocking dates for <strong className="text-foreground-900">{activeStay.title}</strong>.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Start</span>
                    <input type="date" className={inputClass} value={selectedDay ?? ''} onChange={(event) => setSelectedDay(event.target.value)} />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">End</span>
                    <input type="date" className={inputClass} value={blockEnd} onChange={(event) => setBlockEnd(event.target.value)} />
                  </label>
                </div>
                <select className={selectClass} value={reason} onChange={(event) => setReason(event.target.value as StayBlockReason)}>
                  {REASONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <input className={inputClass} placeholder="Note (optional)" value={note} onChange={(event) => setNote(event.target.value)} />
                <button type="button" disabled={busy || !selectedDay} onClick={blockDay} className={btnPrimary + ' justify-center'}>
                  <i className="ri-lock-line text-base"></i> Block these dates
                </button>
              </div>
            )}
          </Card>

          <Card title="Blocked ranges" icon="ri-list-check" bodyClassName="p-0">
            {blocks.length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-foreground-500">No blocked dates for this property.</p>
            ) : (
              <ul className="divide-y divide-background-100">
                {blocks.map((block) => (
                  <li key={block.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground-900">{block.start_date} → {block.end_date}</p>
                      <p className="text-xs text-foreground-500">{block.reason}{block.note ? ` · ${block.note}` : ''}</p>
                    </div>
                    <button type="button" disabled={busy} onClick={() => removeBlock(block)} className={`${btnSmall} border-primary-200 text-primary-700 hover:bg-primary-50`}>
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Upcoming bookings" icon="ri-calendar-check-line" bodyClassName="p-0">
            {stayBookings.filter((booking) => booking.check_out >= today).length === 0 ? (
              <p className="px-5 py-6 text-center text-sm text-foreground-500">No upcoming bookings.</p>
            ) : (
              <ul className="divide-y divide-background-100">
                {stayBookings
                  .filter((booking) => booking.check_out >= today)
                  .sort((a, b) => a.check_in.localeCompare(b.check_in))
                  .slice(0, 8)
                  .map((booking) => (
                    <li key={booking.id} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground-900">{booking.guest_name}</p>
                        <Badge tone="secondary">{booking.guests} guests</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-foreground-500">{booking.check_in} → {booking.check_out}</p>
                    </li>
                  ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </HostLayout>
  );
}