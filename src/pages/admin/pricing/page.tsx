import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import StayRateRulesEditor from '@/pages/admin/stays/components/StayRateRulesEditor';
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  btnGhost,
  btnPrimary,
  inputClass,
  labelClass,
  selectClass,
} from '@/pages/admin/components/AdminUI';
import { useStays } from '@/hooks/useStays';
import { useStaySettings } from '@/hooks/useStaySettings';
import { saveRateRule, updateStay } from '@/utils/stayAdmin';
import { formatPKR } from '@/utils/stays';
import type { Stay } from '@/types/stays';

function previewNights(stay: Stay, serviceFeePercent: number) {
  const nights = 3;
  const subtotal = stay.base_nightly_rate * nights;
  const serviceFee = Math.round((subtotal * serviceFeePercent) / 100);
  const total = subtotal + stay.cleaning_fee + serviceFee;
  return { nights, subtotal, serviceFee, total, hostNet: total - serviceFee };
}

export default function AdminPricingPage() {
  const [params, setParams] = useSearchParams();
  const stayParam = params.get('stay') ?? '';
  const { stays, loading, error, refetch } = useStays({ includeDrafts: true });
  const { settings } = useStaySettings();
  const { notify } = useAdminToast();

  const selected = useMemo(() => stays.find((stay) => stay.id === stayParam) ?? null, [stays, stayParam]);

  const [base, setBase] = useState('');
  const [cleaning, setCleaning] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [saving, setSaving] = useState(false);

  const [bulkStart, setBulkStart] = useState('');
  const [bulkEnd, setBulkEnd] = useState('');
  const [bulkRate, setBulkRate] = useState('');
  const [bulkLabel, setBulkLabel] = useState('Special rate');
  const [bulkSaving, setBulkSaving] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setBase(String(selected.base_nightly_rate));
    setCleaning(String(selected.cleaning_fee));
    setServiceFee(String(selected.service_fee_percent));
  }, [selected]);

  const selectStay = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set('stay', value);
    else next.delete('stay');
    setParams(next, { replace: true });
  };

  const saveBase = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateStay(selected.id, {
        base_nightly_rate: Math.round(Number(base)) || 0,
        cleaning_fee: Math.round(Number(cleaning)) || 0,
        service_fee_percent: Number(serviceFee) || 0,
      });
      await refetch();
      notify({ title: 'Pricing saved', message: 'New quotes use these values immediately.', tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not save pricing', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const saveBulk = async () => {
    if (!selected) return;
    if (!bulkStart || !bulkEnd || bulkEnd < bulkStart || !bulkRate) {
      notify({ title: 'Check the range', message: 'Pick a valid start/end range and a nightly rate.', tone: 'error' });
      return;
    }
    setBulkSaving(true);
    try {
      await saveRateRule(selected.id, {
        label: bulkLabel.trim() || 'Special rate',
        rule_type: 'DATE_RANGE',
        start_date: bulkStart,
        end_date: bulkEnd,
        nightly_rate: Math.round(Number(bulkRate)) || 0,
        min_nights: 1,
        priority: 5,
        is_active: true,
      });
      notify({ title: 'Date range rate added', message: `${bulkStart} → ${bulkEnd}`, tone: 'success' });
      setBulkStart('');
      setBulkEnd('');
      setBulkRate('');
    } catch (err) {
      notify({ title: 'Could not add rate', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBulkSaving(false);
    }
  };

  const preview = selected ? previewNights(selected, Number(serviceFee) || 0) : null;
  const effectiveFee = selected && selected.service_fee_percent > 0 ? selected.service_fee_percent : settings?.default_service_fee_percent ?? 0;

  return (
    <AdminLayout
      title="Pricing"
      subtitle="Set base rates, seasonal overrides and date-specific pricing."
      actions={
        <Link to="/admin/settings" className={btnGhost}>
          <i className="ri-settings-3-line text-base"></i> Platform defaults
        </Link>
      }
    >
      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load properties." onRetry={refetch} />
      ) : stays.length === 0 ? (
        <EmptyState
          icon="ri-price-tag-3-line"
          title="No properties to price yet"
          message="Add a stay first, then come back to fine-tune its rates."
          action={<Link to="/admin/stays/new" className={btnPrimary}><i className="ri-add-line text-base"></i> Add a stay</Link>}
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="rounded-card border border-background-200 bg-background-50 p-4">
            <label className="flex flex-col gap-1.5 md:max-w-md">
              <span className={labelClass}>Property</span>
              <select className={selectClass} value={stayParam} onChange={(event) => selectStay(event.target.value)}>
                <option value="">Select a property…</option>
                {stays.map((stay) => (
                  <option key={stay.id} value={stay.id}>{stay.title}</option>
                ))}
              </select>
            </label>
          </div>

          {!selected ? (
            <EmptyState icon="ri-hand-coin-line" title="Select a property" message="Pick a property above to edit its base rate, rate rules and date-range pricing." />
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="flex flex-col gap-6">
                <Card title="Base pricing" icon="ri-money-dollar-circle-line">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <label className="flex flex-col gap-1.5"><span className={labelClass}>Base nightly rate (PKR)</span><input type="number" className={inputClass} value={base} onChange={(event) => setBase(event.target.value)} /></label>
                    <label className="flex flex-col gap-1.5"><span className={labelClass}>Cleaning fee (PKR)</span><input type="number" className={inputClass} value={cleaning} onChange={(event) => setCleaning(event.target.value)} /></label>
                    <label className="flex flex-col gap-1.5"><span className={labelClass}>Service fee (%)</span><input type="number" className={inputClass} value={serviceFee} onChange={(event) => setServiceFee(event.target.value)} /></label>
                  </div>
                  <p className="mt-3 text-xs text-foreground-500">
                    Leave the service fee at 0 to use the platform default of {settings?.default_service_fee_percent ?? 0}%.
                  </p>
                  <button type="button" disabled={saving} onClick={saveBase} className={btnPrimary + ' mt-4'}>
                    <i className={`${saving ? 'ri-loader-4-line animate-spin' : 'ri-save-3-line'} text-base`}></i> Save base pricing
                  </button>
                </Card>

                <Card title="Rate rules & seasonal pricing" icon="ri-price-tag-3-line">
                  <StayRateRulesEditor stayId={selected.id} baseRate={selected.base_nightly_rate} />
                </Card>

                <Card title="Bulk date-range update" icon="ri-calendar-line">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <label className="flex flex-col gap-1.5"><span className={labelClass}>From</span><input type="date" className={inputClass} value={bulkStart} onChange={(event) => setBulkStart(event.target.value)} /></label>
                    <label className="flex flex-col gap-1.5"><span className={labelClass}>To</span><input type="date" className={inputClass} value={bulkEnd} onChange={(event) => setBulkEnd(event.target.value)} /></label>
                    <label className="flex flex-col gap-1.5"><span className={labelClass}>Nightly rate</span><input type="number" className={inputClass} value={bulkRate} onChange={(event) => setBulkRate(event.target.value)} placeholder="e.g. 20000" /></label>
                    <label className="flex flex-col gap-1.5"><span className={labelClass}>Label</span><input className={inputClass} value={bulkLabel} onChange={(event) => setBulkLabel(event.target.value)} /></label>
                  </div>
                  <button type="button" disabled={bulkSaving} onClick={saveBulk} className={btnPrimary + ' mt-4'}>
                    <i className={`${bulkSaving ? 'ri-loader-4-line animate-spin' : 'ri-add-line'} text-base`}></i> Apply to date range
                  </button>
                </Card>
              </div>

              <div className="flex flex-col gap-6">
                <Card title="Preview (3 nights)" icon="ri-line-chart-line">
                  {preview && (
                    <dl className="flex flex-col gap-2.5 text-sm">
                      <div className="flex items-center justify-between"><dt className="text-foreground-600">Nightly subtotal</dt><dd className="font-medium text-foreground-900">{formatPKR(preview.subtotal)}</dd></div>
                      <div className="flex items-center justify-between"><dt className="text-foreground-600">Cleaning fee</dt><dd className="font-medium text-foreground-900">{formatPKR(selected.cleaning_fee)}</dd></div>
                      <div className="flex items-center justify-between"><dt className="text-foreground-600">Service fee ({effectiveFee}%)</dt><dd className="font-medium text-foreground-900">{formatPKR(preview.serviceFee)}</dd></div>
                      <div className="mt-1 flex items-center justify-between border-t border-background-200 pt-3">
                        <dt className="font-semibold text-foreground-950">Guest price</dt>
                        <dd className="font-heading text-lg font-bold text-primary-700">{formatPKR(preview.total)}</dd>
                      </div>
                      <div className="flex items-center justify-between"><dt className="text-foreground-600">Host earnings</dt><dd className="font-medium text-foreground-900">{formatPKR(preview.hostNet)}</dd></div>
                      <div className="flex items-center justify-between"><dt className="text-foreground-600">ZAMIN earnings</dt><dd className="font-medium text-primary-700">{formatPKR(preview.serviceFee)}</dd></div>
                    </dl>
                  )}
                  <p className="mt-3 text-xs text-foreground-500">
                    Preview only. Final totals are always recalculated on the server when a booking is created.
                  </p>
                </Card>

                {settings && (
                  <Card title="Long-stay discount" icon="ri-calendar-check-line">
                    <p className="text-sm text-foreground-700">
                      Stays of <strong>{settings.long_stay_min_nights}+ nights</strong> get{' '}
                      <strong>{settings.long_stay_discount_percent}%</strong> off the nightly subtotal.
                    </p>
                    <Link to="/admin/settings" className="mt-3 inline-flex text-sm font-semibold text-primary-700 hover:underline">
                      Change in Settings
                    </Link>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}