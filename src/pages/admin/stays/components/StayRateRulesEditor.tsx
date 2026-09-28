import { useState } from 'react';
import { useStayRateRules } from '@/hooks/useStayAdminData';
import { deleteRateRule, saveRateRule } from '@/utils/stayAdmin';
import { formatPKR } from '@/utils/stays';
import type { StayRateRuleType } from '@/types/stays';

const RULE_TYPES: { value: StayRateRuleType; label: string }[] = [
  { value: 'DATE_RANGE', label: 'Date range' },
  { value: 'WEEKEND', label: 'Weekend (Fri–Sun)' },
  { value: 'SEASONAL', label: 'Seasonal' },
  { value: 'PEAK', label: 'Peak' },
];

const inputClass =
  'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none';

export default function StayRateRulesEditor({ stayId, baseRate }: { stayId: string; baseRate: number }) {
  const { rules, loading, refetch } = useStayRateRules(stayId);
  const [form, setForm] = useState({
    label: '',
    rule_type: 'DATE_RANGE' as StayRateRuleType,
    start_date: '',
    end_date: '',
    nightly_rate: '',
    priority: '0',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const addRule = async () => {
    setError(null);
    if (!form.label.trim() || !form.nightly_rate) {
      setError('Give the rule a label and a nightly rate.');
      return;
    }
    setSaving(true);
    try {
      await saveRateRule(stayId, {
        label: form.label.trim(),
        rule_type: form.rule_type,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        nightly_rate: Number(form.nightly_rate) || 0,
        min_nights: 1,
        priority: Number(form.priority) || 0,
        is_active: true,
      });
      setForm({ label: '', rule_type: 'DATE_RANGE', start_date: '', end_date: '', nightly_rate: '', priority: '0' });
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the rule.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteRateRule(id);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the rule.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground-600">
        Base rate is <strong>{formatPKR(baseRate)}</strong> / night. Add rules to override specific
        dates, weekends or seasons. Higher priority wins when rules overlap.
      </p>

      <div className="overflow-x-auto rounded-card border border-background-200 bg-background-50">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-background-100 text-xs uppercase tracking-wide text-foreground-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Label</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Dates</th>
              <th className="px-4 py-3 font-semibold">Rate</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-foreground-500">
                  Loading rules…
                </td>
              </tr>
            ) : rules.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-foreground-500">
                  No rate rules yet — the base rate applies to every night.
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule.id} className="border-t border-background-100">
                  <td className="px-4 py-3 font-medium text-foreground-900">{rule.label}</td>
                  <td className="px-4 py-3 text-foreground-600">{rule.rule_type}</td>
                  <td className="px-4 py-3 text-foreground-600">
                    {rule.rule_type === 'WEEKEND'
                      ? 'All weekends'
                      : `${rule.start_date || '—'} → ${rule.end_date || '—'}`}
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary-700">{formatPKR(rule.nightly_rate)}</td>
                  <td className="px-4 py-3 text-foreground-600">{rule.priority}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remove(rule.id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-primary-200 text-primary-700 transition-colors hover:bg-primary-50"
                      aria-label="Delete rule"
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
          Add a rate rule
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input className={inputClass} placeholder="Label (e.g. Peak summer)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <select className={`cursor-pointer ${inputClass}`} value={form.rule_type} onChange={(e) => setForm({ ...form, rule_type: e.target.value as StayRateRuleType })}>
            {RULE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <input className={inputClass} type="number" min={0} placeholder="Nightly rate (PKR)" value={form.nightly_rate} onChange={(e) => setForm({ ...form, nightly_rate: e.target.value })} />
          {form.rule_type !== 'WEEKEND' && (
            <>
              <input className={inputClass} type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              <input className={inputClass} type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </>
          )}
          <input className={inputClass} type="number" placeholder="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
        </div>
        {error && <p className="mt-3 text-sm text-primary-700">{error}</p>}
        <button
          type="button"
          onClick={addRule}
          disabled={saving}
          className="mt-3 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:opacity-60 dark:text-foreground-950"
        >
          <i className={`${saving ? 'ri-loader-4-line animate-spin' : 'ri-add-line'} text-base`}></i>
          Add rule
        </button>
      </div>
    </div>
  );
}