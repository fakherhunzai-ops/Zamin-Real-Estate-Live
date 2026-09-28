import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  Card,
  ErrorState,
  LoadingBlock,
  Segmented,
  btnGhost,
  btnPrimary,
  btnSmall,
  inputClass,
  selectClass,
} from '@/pages/admin/components/AdminUI';
import { useStays } from '@/hooks/useStays';
import { useBookings } from '@/hooks/useBookings';
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
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const start = new Date(first);
  start.setDate(first.getDate() - offset);
  return Array.from({ length: 42 }).map((_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return ymd(day);
  });
}

export default function AdminCalendarPage() {
  const [params, setParams] = useSearchParams();
  const stayParam = params.get('stay') ?? '';
  const { stays, loading: staysLoading, error: staysError, refetch: refetchStays } = useStays({ includeDrafts: true });
  const { bookings, loading: bookingsLoading, refetch: refetchBookings } = useBookings();
  const { blocks, refetch: refetchBlocks } = useStayAvailabilityBlocks(stayParam || undefined);
  const { notify } = useAdminToast();

  const [view, setView] = useState<'month' | 'week'>('month');
  const [cursor, setCursor] = useState(() => new Date());
  const [destination, setDestination] = useState('ALL');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [blockEnd, setBlockEnd] = useState('');
  const [reason, setReason] = useState<StayBlockReason>('BLOCKED');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

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

  const scopedBookings = useMemo<Booking[]>(
    () =>
      bookings.filter(
        (booking) =>
          scopedIds.has(booking.stay_id) && booking.status !== 'CANCELLED' && booking.status !== 'REFUNDED',
      ),
    [bookings, scopedIds],
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
  };

  const blockDay = async () => {
    if (!stayParam) {
      notify({ title: 'Select a property first', message: 'Choose a property to block dates for it.', tone: 'info' });
      return;
    }
    if (!selectedDay) return;
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
        stayParam,
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

  const refresh = () => {
    refetchStays();
    refetchBookings();
    refetchBlocks();
  };

  const stayName = (id: string) => stays.find((stay) => stay.id === id)?.title ?? 'Stay';

  return (
    <AdminLayout
      title="Calendar"
      subtitle="Bookings, blocked dates and maintenance across your properties."
      actions={
        <Link to="/admin/bookings" className={btnPrimary}>
          <i className="ri-calendar-check-line text-base"></i> Bookings
        </Link>
      }
    >
      <div className="mb-4 flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => shift(-1)} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button type="button" onClick={() => { setCursor(new Date()); }} className={btnSmall + ' border-background-300 text-foreground-700 hover:bg-background-100'}>
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select className={selectClass} value={destination} onChange={(event) => setDestination(event.target.value)}>
            <option value="ALL">All destinations</option>
            {destinations.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <select className={selectClass} value={stayParam} onChange={(event) => selectStay(event.target.value)}>
            <option value="">All properties</option>
            {scopedStays.map((stay) => (
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

      {staysLoading || bookingsLoading ? (
        <LoadingBlock rows={6} />
      ) : staysError ? (
        <ErrorState message="Couldn’t load calendar." onRetry={refresh} />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card bodyClassName="p-0" className="overflow-hidden">
            <div className="grid grid-cols-7 border-b border-background-100 bg-background-100">
              {WEEKDAYS.map((day) => (
                <div key={day} className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-foreground-600">{day}</div>
              ))}
            </div>
            <div className={`grid grid-cols-7 ${view === 'month' ? '' : ''}`}>
              {days.map((day) => {
                const inMonth = view === 'week' || day.slice(0, 7) === ymd(cursor).slice(0, 7);
                const dayBookings = scopedBookings.filter((booking) => covers(day, booking.check_in, booking.check_out));
                const dayBlocks = blocks.filter((block) => block.start_date <= day && block.end_date > day);
                const isToday = day === today;
                const chips = [
                  ...dayBookings.map((booking) => ({
                    id: `b-${booking.id}`,
                    label: booking.guest_name.split(' ')[0],
                    tone: 'booked' as const,
                    to: `/admin/bookings/${booking.id}`,
                  })),
                  ...dayBlocks.map((block) => ({
                    id: `k-${block.id}`,
                    label: block.reason === 'MAINTENANCE' ? 'Maintenance' : 'Blocked',
                    tone: block.reason === 'MAINTENANCE' ? ('maintenance' as const) : ('blocked' as const),
                  })),
                ];
                return (
                  <div
                    key={day}
                    className={`min-h-[92px] border-b border-r border-background-100 p-1.5 ${inMonth ? '' : 'bg-background-100/60'} ${view === 'week' ? 'min-h-[240px]' : ''}`}
                  >
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
                        return chip.to ? (
                          <Link key={chip.id} to={chip.to} className={`truncate rounded px-1.5 py-0.5 text-[10px] font-semibold ${chipClass}`} title={chip.label}>
                            {chip.label}
                          </Link>
                        ) : (
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
              {!stayParam ? (
                <p className="text-sm text-foreground-600">Select a specific property above to block dates or create a maintenance block.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-foreground-600">
                    Blocking dates for <strong className="text-foreground-900">{stayName(stayParam)}</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Start</span><input type="date" className={inputClass} value={selectedDay ?? ''} onChange={(event) => setSelectedDay(event.target.value)} /></label>
                    <label className="flex flex-col gap-1.5"><span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">End</span><input type="date" className={inputClass} value={blockEnd} onChange={(event) => setBlockEnd(event.target.value)} /></label>
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
                <p className="px-5 py-6 text-center text-sm text-foreground-500">
                  {stayParam ? 'No blocked dates for this property.' : 'Choose a property to see its blocks.'}
                </p>
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

            <Card title="Legend" icon="ri-information-line">
              <div className="flex flex-col gap-2 text-sm text-foreground-700">
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-primary-500" /> Booked — confirmed reservation</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-background-300" /> Blocked — unavailable</span>
                <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-accent-500" /> Maintenance block</span>
              </div>
              <div className="mt-4">
                <Badge tone="outline" icon="ri-information-line">Click a date to block · click a booking to open it</Badge>
              </div>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}