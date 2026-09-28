import { useMemo, useState } from 'react';
import type { StayCalendar } from '@/types/stays';

type Props = {
  calendar: StayCalendar | null;
  checkIn: string;
  checkOut: string;
  onRangeChange: (checkIn: string, checkOut: string) => void;
};

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function iso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayIso(): string {
  return iso(new Date());
}

type DayState = 'past' | 'booked' | 'blocked' | 'available';

/** A date is unavailable when it falls inside a booked or blocked range [start, end). */
export function isUnavailable(calendar: StayCalendar | null, dateIso: string): boolean {
  if (!calendar) return false;
  const inRange = (start: string, end: string) => dateIso >= start && dateIso < end;
  return (
    calendar.booked.some((range) => inRange(range.start, range.end)) ||
    calendar.blocks.some((range) => inRange(range.start, range.end))
  );
}

/** True when any night in [start, end) is unavailable. */
export function rangeHasUnavailable(
  calendar: StayCalendar | null,
  start: string,
  end: string,
): boolean {
  if (!calendar || !start || !end || end <= start) return false;
  const cursor = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  while (cursor < last) {
    if (isUnavailable(calendar, iso(cursor))) return true;
    cursor.setDate(cursor.getDate() + 1);
  }
  return false;
}

export default function StayAvailabilityCalendar({ calendar, checkIn, checkOut, onRangeChange }: Props) {
  const now = new Date();
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));

  const cells = useMemo(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const result: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i += 1) result.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) result.push(new Date(year, monthIndex, day));
    return result;
  }, [month]);

  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const stateFor = (dateIso: string): DayState => {
    if (dateIso < todayIso()) return 'past';
    if (!calendar) return 'available';
    const inRange = (start: string, end: string) => dateIso >= start && dateIso < end;
    if (calendar.booked.some((range) => inRange(range.start, range.end))) return 'booked';
    if (calendar.blocks.some((range) => inRange(range.start, range.end))) return 'blocked';
    return 'available';
  };

  const handleClick = (dateIso: string) => {
    if (stateFor(dateIso) !== 'available' && dateIso < todayIso()) return;
    if (!checkIn || (checkIn && checkOut) || dateIso <= checkIn) {
      onRangeChange(dateIso, '');
      return;
    }
    onRangeChange(checkIn, dateIso);
  };

  const dayClass = (dateIso: string): string => {
    const state = stateFor(dateIso);
    if (dateIso === checkIn || dateIso === checkOut) {
      return 'bg-primary-800 text-background-50 font-semibold';
    }
    if (checkIn && checkOut && dateIso > checkIn && dateIso < checkOut) {
      return 'bg-primary-100 text-primary-900';
    }
    switch (state) {
      case 'past':
        return 'text-background-300 cursor-default';
      case 'booked':
        return 'bg-background-200 text-foreground-400 line-through cursor-not-allowed';
      case 'blocked':
        return 'bg-secondary-100 text-secondary-900 cursor-not-allowed';
      default:
        return 'text-foreground-800 hover:bg-primary-50 cursor-pointer';
    }
  };

  const navButton =
    'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-700 transition-colors hover:bg-background-100';

  return (
    <div className="rounded-card border border-background-200 bg-background-50 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground-950">Availability</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={navButton}
            onClick={() => setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            <i className="ri-arrow-left-s-line text-lg"></i>
          </button>
          <span className="min-w-[130px] text-center text-sm font-semibold text-foreground-900">{monthLabel}</span>
          <button
            type="button"
            className={navButton}
            onClick={() => setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            <i className="ri-arrow-right-s-line text-lg"></i>
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-foreground-500">
        Tap a date, then tap check-out. Booked and blocked nights can&apos;t be selected.
      </p>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <span key={day} className="py-1 text-center text-[11px] font-bold uppercase tracking-wide text-foreground-500">
            {day.slice(0, 2)}
          </span>
        ))}
        {cells.map((date, index) => {
          if (!date) return <span key={`blank-${index}`} />;
          const dateIso = iso(date);
          const disabled = stateFor(dateIso) === 'booked' || stateFor(dateIso) === 'blocked';
          return (
            <button
              key={dateIso}
              type="button"
              disabled={disabled || dateIso < todayIso()}
              onClick={() => handleClick(dateIso)}
              className={`flex h-9 items-center justify-center rounded-md text-sm transition-colors ${dayClass(dateIso)}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground-600">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border border-background-300 bg-background-50"></span> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-background-200"></span> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-secondary-100"></span> Blocked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-primary-800"></span> Your stay
        </span>
      </div>
    </div>
  );
}