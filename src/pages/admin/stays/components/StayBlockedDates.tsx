import { useState } from 'react';
import { useStayAvailabilityBlocks } from '@/hooks/useStayAdminData';
import { useStayCalendar } from '@/hooks/useStayCalendar';
import { addAvailabilityBlock, deleteAvailabilityBlock } from '@/utils/stayAdmin';
import type { StayBlockReason } from '@/types/stays';

const REASONS: { value: StayBlockReason; label: string }[] = [
  { value: 'BLOCKED', label: 'Blocked' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OWNER_STAY', label: 'Owner stay' },
];

const inputClass =
  'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none';

export default function StayBlockedDates({ stayId }: { stayId: string }) {
  const { blocks, loading, refetch } = useStayAvailabilityBlocks(stayId);
  const { calendar } = useStayCalendar(stayId);
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    reason: 'BLOCKED' as StayBlockReason,
    note: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const addBlock = async () => {
    setError(null);
    if (!form.start_date || !form.end_date || form.end_date <= form.start_date) {
      setError('Pick a start and a later end date.');
      return;
    }
    setSaving(true);
    try {
      await addAvailabilityBlock(
        stayId,
        {
          start_date: form.start_date,
          end_date: form.end_date,
          reason: form.reason,
          note: form.note.trim() || null,
        },
        null,
      );
      setForm({ start_date: '', end_date: '', reason: 'BLOCKED', note: '' });
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not block those dates.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteAvailabilityBlock(id);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove the block.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground-600">
        Blocked and booked dates are excluded from new reservations automatically. Guests cannot
        double-book these ranges.
      </p>

      {calendar?.booked && calendar.booked.length > 0 && (
        <div className="rounded-card border border-background-200 bg-background-50 p-4">
          <p className="mb-2 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">
            Booked nights
          </p>
          <div className="flex flex-wrap gap-2">
            {calendar.booked.map((range, index) => (
              <span key={`${range.start}-${index}`} className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-900">
                {range.start} → {range.end}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-card border border-background-200 bg-background-50">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-background-100 text-xs uppercase tracking-wide text-foreground-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Range</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
              <th className="px-4 py-3 font-semibold">Note</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-foreground-500">Loading…</td>
              </tr>
            ) : blocks.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-foreground-500">
                  No blocked dates. Every unsold night is bookable.
                </td>
              </tr>
            ) : (
              blocks.map((block) => (
                <tr key={block.id} className="border-t border-background-100">
                  <td className="px-4 py-3 font-medium text-foreground-900">
                    {block.start_date} → {block.end_date}
                  </td>
                  <td className="px-4 py-3 text-foreground-600">{block.reason}</td>
                  <td className="px-4 py-3 text-foreground-600">{block.note || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remove(block.id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-primary-200 text-primary-700 transition-colors hover:bg-primary-50"
                      aria-label="Unblock"
                    >
                      <i className="ri-delete-bin-line text-base"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-background-200 bg-background-50 p-4">
        <p className="mb-3 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">
          Block dates
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input className={inputClass} type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <input className={inputClass} type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          <select className={`cursor-pointer ${inputClass}`} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value as StayBlockReason })}>
            {REASONS.map((reason) => (
              <option key={reason.value} value={reason.value}>{reason.label}</option>
            ))}
          </select>
          <input className={inputClass} placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
        {error && <p className="mt-3 text-sm text-primary-700">{error}</p>}
        <button
          type="button"
          onClick={addBlock}
          disabled={saving}
          className="mt-3 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:opacity-60 dark:text-foreground-950"
        >
          <i className={`${saving ? 'ri-loader-4-line animate-spin' : 'ri-calendar-close-line'} text-base`}></i>
          Block these dates
        </button>
      </div>
    </div>
  );
}