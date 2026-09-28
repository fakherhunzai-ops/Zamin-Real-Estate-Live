import { useState } from 'react';
import type { FormEvent } from 'react';
import { updateHostStay, type HostStayPatch } from '@/utils/hostPortal';
import { StayStatusBadge } from '@/pages/admin/components/AdminUI';
import type { Stay } from '@/types/stays';

const label = 'flex flex-col gap-1.5';
const labelText = 'text-xs font-semibold uppercase tracking-wide text-foreground-600';
const input =
  'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';

function numberOrNull(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function HostStayEditor({
  stay,
  onClose,
  onSaved,
}: {
  stay: Stay;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: stay.title,
    summary: stay.summary ?? '',
    description: stay.description ?? '',
    address: stay.address ?? '',
    guest_capacity: stay.guest_capacity,
    bedrooms: stay.bedrooms,
    beds: stay.beds,
    bathrooms: stay.bathrooms,
    base_nightly_rate: stay.base_nightly_rate,
    cleaning_fee: stay.cleaning_fee,
    check_in_time: stay.check_in_time ?? '',
    check_out_time: stay.check_out_time ?? '',
    house_rules: stay.house_rules ?? '',
    cancellation_policy: stay.cancellation_policy ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!form.title.trim()) {
      setError('A stay name is required.');
      return;
    }
    setSaving(true);
    const patch: HostStayPatch = {
      title: form.title.trim(),
      summary: form.summary.trim() || null,
      description: form.description.trim() || null,
      address: form.address.trim() || null,
      guest_capacity: form.guest_capacity,
      bedrooms: form.bedrooms,
      beds: form.beds,
      bathrooms: form.bathrooms,
      base_nightly_rate: form.base_nightly_rate,
      cleaning_fee: form.cleaning_fee,
      check_in_time: form.check_in_time.trim() || null,
      check_out_time: form.check_out_time.trim() || null,
      house_rules: form.house_rules.trim() || null,
      cancellation_policy: form.cancellation_policy.trim() || null,
    };
    try {
      await updateHostStay(stay.id, patch);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex justify-end">
      <div className="absolute inset-0 bg-foreground-950/50" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-background-50">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-background-200 bg-background-50 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate font-heading text-lg font-semibold text-foreground-950">{stay.title}</h2>
            <div className="mt-1"><StayStatusBadge status={stay.status} /></div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100"
            aria-label="Close"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
          <div className={label}>
            <span className={labelText}>Stay name</span>
            <input className={input} value={form.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className={label}>
            <span className={labelText}>Short summary</span>
            <input className={input} value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="One-line highlight" />
          </div>
          <div className={label}>
            <span className={labelText}>Full description</span>
            <textarea className={`${input} min-h-[120px]`} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className={label}>
            <span className={labelText}>Address</span>
            <input className={input} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className={label}>
              <span className={labelText}>Guests</span>
              <input type="number" min={1} className={input} value={form.guest_capacity} onChange={(e) => set('guest_capacity', numberOrNull(e.target.value) ?? 1)} />
            </div>
            <div className={label}>
              <span className={labelText}>Bedrooms</span>
              <input type="number" min={0} className={input} value={form.bedrooms} onChange={(e) => set('bedrooms', numberOrNull(e.target.value) ?? 0)} />
            </div>
            <div className={label}>
              <span className={labelText}>Beds</span>
              <input type="number" min={0} className={input} value={form.beds} onChange={(e) => set('beds', numberOrNull(e.target.value) ?? 0)} />
            </div>
            <div className={label}>
              <span className={labelText}>Bathrooms</span>
              <input type="number" min={0} className={input} value={form.bathrooms} onChange={(e) => set('bathrooms', numberOrNull(e.target.value) ?? 0)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={label}>
              <span className={labelText}>Nightly rate (PKR)</span>
              <input type="number" min={0} className={input} value={form.base_nightly_rate} onChange={(e) => set('base_nightly_rate', numberOrNull(e.target.value) ?? 0)} />
            </div>
            <div className={label}>
              <span className={labelText}>Cleaning fee (PKR)</span>
              <input type="number" min={0} className={input} value={form.cleaning_fee} onChange={(e) => set('cleaning_fee', numberOrNull(e.target.value) ?? 0)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className={label}>
              <span className={labelText}>Check-in time</span>
              <input className={input} value={form.check_in_time} onChange={(e) => set('check_in_time', e.target.value)} placeholder="14:00" />
            </div>
            <div className={label}>
              <span className={labelText}>Check-out time</span>
              <input className={input} value={form.check_out_time} onChange={(e) => set('check_out_time', e.target.value)} placeholder="11:00" />
            </div>
          </div>

          <div className={label}>
            <span className={labelText}>House rules</span>
            <textarea className={`${input} min-h-[90px]`} value={form.house_rules} onChange={(e) => set('house_rules', e.target.value)} />
          </div>
          <div className={label}>
            <span className={labelText}>Cancellation policy</span>
            <textarea className={`${input} min-h-[90px]`} value={form.cancellation_policy} onChange={(e) => set('cancellation_policy', e.target.value)} />
          </div>

          {error && (
            <p className="flex items-start gap-2 rounded-md bg-accent-50 px-3 py-2.5 text-sm text-accent-800">
              <i className="ri-error-warning-line mt-0.5"></i>
              {error}
            </p>
          )}

          <div className="sticky bottom-0 -mx-5 -mb-5 flex flex-wrap justify-end gap-3 border-t border-background-200 bg-background-50 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:opacity-60 dark:text-foreground-950"
            >
              {saving && <i className="ri-loader-4-line animate-spin"></i>}
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}