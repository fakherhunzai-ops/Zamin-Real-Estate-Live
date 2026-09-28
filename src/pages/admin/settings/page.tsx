import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Card,
  ErrorState,
  LoadingBlock,
  Tabs,
  btnPrimary,
  inputClass,
  labelClass,
  selectClass,
} from '@/pages/admin/components/AdminUI';
import { useStaySettings } from '@/hooks/useStaySettings';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'booking', label: 'Booking' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'payments', label: 'Payments' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'policies', label: 'Policies' },
  { id: 'support', label: 'Support' },
];

const NOTIFICATIONS = [
  { key: 'booking_received', label: 'Booking received' },
  { key: 'booking_confirmed', label: 'Booking confirmed' },
  { key: 'booking_cancelled', label: 'Booking cancelled' },
  { key: 'checkin_reminder', label: 'Check-in reminder' },
  { key: 'host_new_booking', label: 'Host — new booking' },
  { key: 'host_property_approved', label: 'Host — property approved' },
  { key: 'host_property_rejected', label: 'Host — property rejected' },
  { key: 'review_request', label: 'Review request' },
  { key: 'payout_notification', label: 'Payout notification' },
];

type FormState = {
  default_currency: string;
  default_service_fee_percent: string;
  default_commission_percent: string;
  default_cleaning_fee: string;
  long_stay_discount_percent: string;
  long_stay_min_nights: string;
  min_booking_notice_days: string;
  max_advance_booking_days: string;
  default_check_in_time: string;
  default_check_out_time: string;
  cancellation_policy: string;
  support_email: string;
  support_phone: string;
  support_whatsapp: string;
  notifications: Record<string, boolean>;
};

const EMPTY: FormState = {
  default_currency: 'PKR',
  default_service_fee_percent: '5',
  default_commission_percent: '10',
  default_cleaning_fee: '0',
  long_stay_discount_percent: '10',
  long_stay_min_nights: '7',
  min_booking_notice_days: '1',
  max_advance_booking_days: '365',
  default_check_in_time: '14:00',
  default_check_out_time: '11:00',
  cancellation_policy: '',
  support_email: '',
  support_phone: '',
  support_whatsapp: '',
  notifications: {},
};

export default function AdminSettingsPage() {
  const { settings, loading, error, refetch, save } = useStaySettings();
  const { notify } = useAdminToast();
  const [tab, setTab] = useState('general');
  const [form, setForm] = useState<FormState>({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setForm({
      default_currency: settings.default_currency ?? 'PKR',
      default_service_fee_percent: String(settings.default_service_fee_percent ?? 5),
      default_commission_percent: String(settings.default_commission_percent ?? 10),
      default_cleaning_fee: String(settings.default_cleaning_fee ?? 0),
      long_stay_discount_percent: String(settings.long_stay_discount_percent ?? 10),
      long_stay_min_nights: String(settings.long_stay_min_nights ?? 7),
      min_booking_notice_days: String(settings.min_booking_notice_days ?? 1),
      max_advance_booking_days: String(settings.max_advance_booking_days ?? 365),
      default_check_in_time: settings.default_check_in_time ?? '14:00',
      default_check_out_time: settings.default_check_out_time ?? '11:00',
      cancellation_policy: settings.cancellation_policy ?? '',
      support_email: settings.support_email ?? '',
      support_phone: settings.support_phone ?? '',
      support_whatsapp: settings.support_whatsapp ?? '',
      notifications: settings.notifications ?? {},
    });
  }, [settings]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleNotification = (key: string) =>
    setForm((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: !prev.notifications[key] } }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const num = (value: string) => Number(value);
    if (num(form.default_service_fee_percent) < 0 || num(form.default_service_fee_percent) > 100) {
      notify({ title: 'Invalid service fee', message: 'Service fee must be between 0 and 100.', tone: 'error' });
      return;
    }
    if (num(form.default_commission_percent) < 0 || num(form.default_commission_percent) > 100) {
      notify({ title: 'Invalid commission', message: 'Commission must be between 0 and 100.', tone: 'error' });
      return;
    }
    setSaving(true);
    try {
      await save({
        default_currency: form.default_currency.trim() || 'PKR',
        default_service_fee_percent: num(form.default_service_fee_percent) || 0,
        default_commission_percent: num(form.default_commission_percent) || 0,
        default_cleaning_fee: Math.round(num(form.default_cleaning_fee)) || 0,
        long_stay_discount_percent: num(form.long_stay_discount_percent) || 0,
        long_stay_min_nights: Math.max(1, Math.floor(num(form.long_stay_min_nights)) || 1),
        min_booking_notice_days: Math.max(0, Math.floor(num(form.min_booking_notice_days)) || 0),
        max_advance_booking_days: Math.max(1, Math.floor(num(form.max_advance_booking_days)) || 365),
        default_check_in_time: form.default_check_in_time.trim() || '14:00',
        default_check_out_time: form.default_check_out_time.trim() || '11:00',
        cancellation_policy: form.cancellation_policy.trim() || null,
        support_email: form.support_email.trim() || null,
        support_phone: form.support_phone.trim() || null,
        support_whatsapp: form.support_whatsapp.trim() || null,
        notifications: form.notifications,
      });
      notify({ title: 'Settings saved', message: 'New quotes and rules use these values.', tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not save settings', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings" subtitle="Platform-wide defaults for ZAMIN Stays.">
      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load settings." onRetry={refetch} />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />

          {tab === 'general' && (
            <Card title="General" icon="ri-settings-3-line">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>Default currency</span>
                  <select className={selectClass} value={form.default_currency} onChange={(event) => set('default_currency', event.target.value)}>
                    <option value="PKR">PKR — Pakistani Rupee</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="AED">AED — UAE Dirham</option>
                  </select>
                </label>
              </div>
            </Card>
          )}

          {tab === 'booking' && (
            <Card title="Booking rules" icon="ri-calendar-check-line">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Minimum booking notice (days)</span><input type="number" min="0" className={inputClass} value={form.min_booking_notice_days} onChange={(event) => set('min_booking_notice_days', event.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Max advance booking (days)</span><input type="number" min="1" className={inputClass} value={form.max_advance_booking_days} onChange={(event) => set('max_advance_booking_days', event.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Default check-in time</span><input className={inputClass} value={form.default_check_in_time} onChange={(event) => set('default_check_in_time', event.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Default check-out time</span><input className={inputClass} value={form.default_check_out_time} onChange={(event) => set('default_check_out_time', event.target.value)} /></label>
              </div>
            </Card>
          )}

          {tab === 'pricing' && (
            <Card title="Pricing defaults" icon="ri-price-tag-3-line">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Default service fee (%)</span><input type="number" min="0" max="100" step="0.5" className={inputClass} value={form.default_service_fee_percent} onChange={(event) => set('default_service_fee_percent', event.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Default cleaning fee ({form.default_currency})</span><input type="number" min="0" className={inputClass} value={form.default_cleaning_fee} onChange={(event) => set('default_cleaning_fee', event.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Long-stay discount (%)</span><input type="number" min="0" max="100" step="0.5" className={inputClass} value={form.long_stay_discount_percent} onChange={(event) => set('long_stay_discount_percent', event.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Long-stay minimum nights</span><input type="number" min="1" className={inputClass} value={form.long_stay_min_nights} onChange={(event) => set('long_stay_min_nights', event.target.value)} /></label>
              </div>
              <p className="mt-3 text-xs text-foreground-500">
                The service fee is added to the nightly subtotal. The long-stay discount is applied once the minimum nights are reached.
              </p>
            </Card>
          )}

          {tab === 'payments' && (
            <Card title="Payments" icon="ri-bank-card-line">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Default commission (%)</span><input type="number" min="0" max="100" step="0.5" className={inputClass} value={form.default_commission_percent} onChange={(event) => set('default_commission_percent', event.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Payout rail</span><select className={selectClass} disabled value="manual"><option value="manual">Manual settlement</option></select></label>
              </div>
              <p className="mt-3 text-xs text-foreground-500">
                Connect a payment provider to capture card payments and automate settlement.
              </p>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card title="Notifications" icon="ri-notification-3-line">
              <p className="mb-4 text-sm text-foreground-600">Choose which email notifications are sent to guests and hosts.</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {NOTIFICATIONS.map((item) => (
                  <label key={item.key} className="flex cursor-pointer items-center gap-2.5 rounded-md border border-background-200 px-3 py-2.5 text-sm text-foreground-800 transition-colors hover:bg-background-100">
                    <input type="checkbox" className="h-4 w-4 cursor-pointer accent-primary-700" checked={Boolean(form.notifications[item.key])} onChange={() => toggleNotification(item.key)} />
                    {item.label}
                  </label>
                ))}
              </div>
            </Card>
          )}

          {tab === 'policies' && (
            <Card title="Policies" icon="ri-file-shield-2-line">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Default cancellation policy</span>
                <textarea rows={6} className={`${inputClass} resize-y`} value={form.cancellation_policy} onChange={(event) => set('cancellation_policy', event.target.value)} placeholder="Free cancellation up to 7 days before check-in…" />
              </label>
            </Card>
          )}

          {tab === 'support' && (
            <Card title="Support" icon="ri-customer-service-2-line">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Support email</span><input type="email" className={inputClass} value={form.support_email} onChange={(event) => set('support_email', event.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Support phone</span><input className={inputClass} value={form.support_phone} onChange={(event) => set('support_phone', event.target.value)} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Support WhatsApp</span><input className={inputClass} value={form.support_whatsapp} onChange={(event) => set('support_whatsapp', event.target.value)} /></label>
              </div>
            </Card>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-background-200 pt-5">
            {settings && <p className="mr-auto text-xs text-foreground-500">Last updated {new Date(settings.updated_at).toLocaleString()}</p>}
            <button type="submit" disabled={saving} className={btnPrimary}>
              <i className={`${saving ? 'ri-loader-4-line animate-spin' : 'ri-save-3-line'} text-base`}></i>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}