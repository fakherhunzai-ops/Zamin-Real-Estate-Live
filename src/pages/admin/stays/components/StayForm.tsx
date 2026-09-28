import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useStayDestinations } from '@/hooks/useStayDestinations';
import { useStayAmenities, useStayCategories } from '@/hooks/useStayCategories';
import StayImagesManager from './StayImagesManager';
import StayAmenityPicker from './StayAmenityPicker';
import {
  createStay,
  replaceStayAmenities,
  replaceStayImages,
  updateStay,
  type StayFormInput,
  type StayImageInput,
} from '@/utils/stayAdmin';
import { slugify } from '@/utils/stays';
import type { ManagementType, Stay, StayArea, StayStatus } from '@/types/stays';

const STATUSES: StayStatus[] = ['DRAFT', 'PENDING', 'VERIFIED', 'PUBLISHED', 'PAUSED', 'ARCHIVED'];

const inputClass =
  'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';
const labelClass = 'text-xs font-semibold uppercase tracking-wide text-foreground-600';

type FormState = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category_id: string;
  management_type: ManagementType;
  destination_id: string;
  area_id: string;
  address: string;
  latitude: string;
  longitude: string;
  guest_capacity: string;
  bedrooms: string;
  beds: string;
  bathrooms: string;
  base_nightly_rate: string;
  currency: string;
  cleaning_fee: string;
  service_fee_percent: string;
  check_in_time: string;
  check_out_time: string;
  cancellation_policy: string;
  house_rules: string;
  host_name: string;
  host_email: string;
  host_phone: string;
  status: StayStatus;
  verified: boolean;
  featured: boolean;
};

function fromStay(stay?: Stay | null): FormState {
  return {
    title: stay?.title ?? '',
    slug: stay?.slug ?? '',
    summary: stay?.summary ?? '',
    description: stay?.description ?? '',
    category_id: stay?.category_id ?? '',
    management_type: stay?.management_type ?? 'LISTED',
    destination_id: stay?.destination_id ?? '',
    area_id: stay?.area_id ?? '',
    address: stay?.address ?? '',
    latitude: stay?.latitude != null ? String(stay.latitude) : '',
    longitude: stay?.longitude != null ? String(stay.longitude) : '',
    guest_capacity: String(stay?.guest_capacity ?? 2),
    bedrooms: String(stay?.bedrooms ?? 1),
    beds: String(stay?.beds ?? 1),
    bathrooms: String(stay?.bathrooms ?? 1),
    base_nightly_rate: String(stay?.base_nightly_rate ?? ''),
    currency: stay?.currency ?? 'PKR',
    cleaning_fee: String(stay?.cleaning_fee ?? 0),
    service_fee_percent: String(stay?.service_fee_percent ?? 0),
    check_in_time: stay?.check_in_time ?? '14:00',
    check_out_time: stay?.check_out_time ?? '11:00',
    cancellation_policy: stay?.cancellation_policy ?? '',
    house_rules: stay?.house_rules ?? '',
    host_name: stay?.host_name ?? '',
    host_email: stay?.host_email ?? '',
    host_phone: stay?.host_phone ?? '',
    status: stay?.status ?? 'DRAFT',
    verified: stay?.verified ?? false,
    featured: stay?.featured ?? false,
  };
}

function Card({ id, title, icon, children }: { id?: string; title: string; icon: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-card border border-background-200 bg-background-50 p-5 md:p-6">
      <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-foreground-950">
        <span className="flex h-5 w-5 items-center justify-center text-accent-600">
          <i className={`${icon} text-lg`}></i>
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <input type={type} className={inputClass} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export default function StayForm({ stay, onSaved }: { stay?: Stay | null; onSaved?: () => void }) {
  const navigate = useNavigate();
  const { destinations } = useStayDestinations();
  const { categories } = useStayCategories();
  const { amenities } = useStayAmenities();
  const [areas, setAreas] = useState<StayArea[]>([]);

  const [form, setForm] = useState<FormState>(() => fromStay(stay));
  const [slugTouched, setSlugTouched] = useState(Boolean(stay));
  const [images, setImages] = useState<StayImageInput[]>([]);
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setForm(fromStay(stay));
    setSlugTouched(Boolean(stay));
    if (stay) {
      setImages(
        (stay.images ?? [])
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((image) => ({
            url: image.url,
            alt: image.alt,
            is_cover: image.is_cover,
            sort_order: image.sort_order,
          })),
      );
      setAmenityIds(
        (stay.amenity_links ?? [])
          .map((link) => link.amenity?.id)
          .filter((id): id is string => Boolean(id)),
      );
    }
  }, [stay]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from('stay_areas').select('*').order('sort_order', { ascending: true });
      if (active) setAreas((data as StayArea[]) ?? []);
    })();
    return () => {
      active = false;
    };
  }, []);

  const areaOptions = useMemo(
    () => areas.filter((area) => !form.destination_id || area.destination_id === form.destination_id),
    [areas, form.destination_id],
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const onTitleChange = (value: string) => {
    setForm((prev) => ({ ...prev, title: value, slug: slugTouched ? prev.slug : slugify(value) }));
  };

  const toggleAmenity = (id: string) =>
    setAmenityIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!form.title.trim()) {
      setError('A stay needs a title.');
      return;
    }
    const slug = (form.slug.trim() || slugify(form.title)).toLowerCase();
    if (!form.base_nightly_rate || Number(form.base_nightly_rate) <= 0) {
      setError('Set a nightly rate greater than zero.');
      return;
    }

    const num = (value: string) => (value.trim() === '' ? null : Number(value));
    const payload: StayFormInput = {
      title: form.title.trim(),
      slug,
      summary: form.summary.trim() || null,
      description: form.description.trim() || null,
      category_id: form.category_id || null,
      management_type: form.management_type,
      destination_id: form.destination_id || null,
      area_id: form.area_id || null,
      address: form.address.trim() || null,
      latitude: num(form.latitude),
      longitude: num(form.longitude),
      guest_capacity: Number(form.guest_capacity) || 1,
      bedrooms: Number(form.bedrooms) || 0,
      beds: Number(form.beds) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      base_nightly_rate: Math.round(Number(form.base_nightly_rate)) || 0,
      currency: form.currency || 'PKR',
      cleaning_fee: Math.round(Number(form.cleaning_fee)) || 0,
      service_fee_percent: Number(form.service_fee_percent) || 0,
      check_in_time: form.check_in_time.trim() || null,
      check_out_time: form.check_out_time.trim() || null,
      cancellation_policy: form.cancellation_policy.trim() || null,
      house_rules: form.house_rules.trim() || null,
      host_name: form.host_name.trim() || null,
      host_email: form.host_email.trim() || null,
      host_phone: form.host_phone.trim() || null,
      status: form.status,
      verified: form.verified || form.status === 'VERIFIED',
      featured: form.featured,
    };

    setSaving(true);
    try {
      let stayId = stay?.id;
      if (!stayId) {
        const created = await createStay(payload);
        stayId = created.id;
      } else {
        await updateStay(stayId, payload);
      }
      await replaceStayImages(stayId, images);
      await replaceStayAmenities(stayId, amenityIds);

      if (!stay) {
        navigate(`/admin/stays/${stayId}`, { replace: true });
        return;
      }
      setNotice('Saved. Changes are live.');
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the stay.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Card id="basics" title="Basics" icon="ri-file-text-line">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className={labelClass}>Title</span>
            <input className={inputClass} value={form.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Mountain-view villa in Karimabad" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>URL slug</span>
            <input className={inputClass} value={form.slug} onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }} placeholder="mountain-view-villa-karimabad" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Stay type</span>
            <select className={`cursor-pointer ${inputClass}`} value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">Select a type…</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className={labelClass}>Summary</span>
            <input className={inputClass} value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="One-line teaser shown on cards" />
          </label>
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className={labelClass}>Description</span>
            <textarea className={`${inputClass} resize-y`} rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </label>
        </div>
      </Card>

      <Card id="images" title="Images" icon="ri-image-2-line">
        <StayImagesManager images={images} onChange={setImages} />
      </Card>

      <Card id="location" title="Location" icon="ri-map-pin-2-line">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Destination</span>
            <select className={`cursor-pointer ${inputClass}`} value={form.destination_id} onChange={(e) => { set('destination_id', e.target.value); set('area_id', ''); }}>
              <option value="">Select…</option>
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>{destination.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Area</span>
            <select className={`cursor-pointer ${inputClass}`} value={form.area_id} onChange={(e) => set('area_id', e.target.value)}>
              <option value="">Select…</option>
              {areaOptions.map((area) => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </label>
          <TextField label="Address" value={form.address} onChange={(v) => set('address', v)} placeholder="Street / landmark" />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Latitude" value={form.latitude} onChange={(v) => set('latitude', v)} placeholder="36.316" />
            <TextField label="Longitude" value={form.longitude} onChange={(v) => set('longitude', v)} placeholder="74.659" />
          </div>
        </div>
      </Card>

      <Card id="capacity" title="Capacity & amenities" icon="ri-group-line">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <TextField label="Guests" type="number" value={form.guest_capacity} onChange={(v) => set('guest_capacity', v)} />
          <TextField label="Bedrooms" type="number" value={form.bedrooms} onChange={(v) => set('bedrooms', v)} />
          <TextField label="Beds" type="number" value={form.beds} onChange={(v) => set('beds', v)} />
          <TextField label="Bathrooms" type="number" value={form.bathrooms} onChange={(v) => set('bathrooms', v)} />
        </div>
        <div className="mt-5">
          <StayAmenityPicker amenities={amenities} selected={amenityIds} onToggle={toggleAmenity} />
        </div>
      </Card>

      <Card id="pricing" title="Pricing" icon="ri-money-dollar-circle-line">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <TextField label="Base / night (PKR)" type="number" value={form.base_nightly_rate} onChange={(v) => set('base_nightly_rate', v)} />
          <TextField label="Cleaning fee" type="number" value={form.cleaning_fee} onChange={(v) => set('cleaning_fee', v)} />
          <TextField label="Service fee %" type="number" value={form.service_fee_percent} onChange={(v) => set('service_fee_percent', v)} />
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Currency</span>
            <input className={inputClass} value={form.currency} onChange={(e) => set('currency', e.target.value)} />
          </label>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs text-foreground-500">
          <i className="ri-information-line mt-0.5"></i>
          Leave the service fee at 0 to use the platform default. Date-specific and peak rates are set
          in “Pricing rules” below (after saving).
        </p>
      </Card>

      <Card id="policies" title="Policies & host" icon="ri-shield-check-line">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextField label="Check-in time" value={form.check_in_time} onChange={(v) => set('check_in_time', v)} placeholder="14:00" />
          <TextField label="Check-out time" value={form.check_out_time} onChange={(v) => set('check_out_time', v)} placeholder="11:00" />
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Cancellation policy</span>
            <textarea className={`${inputClass} resize-y`} rows={3} value={form.cancellation_policy} onChange={(e) => set('cancellation_policy', e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>House rules</span>
            <textarea className={`${inputClass} resize-y`} rows={3} value={form.house_rules} onChange={(e) => set('house_rules', e.target.value)} />
          </label>
          <TextField label="Host name" value={form.host_name} onChange={(v) => set('host_name', v)} />
          <TextField label="Host phone" value={form.host_phone} onChange={(v) => set('host_phone', v)} />
          <TextField label="Host email" value={form.host_email} onChange={(v) => set('host_email', v)} />
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Management</span>
            <select className={`cursor-pointer ${inputClass}`} value={form.management_type} onChange={(e) => set('management_type', e.target.value as ManagementType)}>
              <option value="LISTED">ZAMIN Listed (owner-operated)</option>
              <option value="MANAGED">ZAMIN Managed (full management)</option>
            </select>
          </label>
        </div>
      </Card>

      <Card id="publishing" title="Publishing" icon="ri-upload-cloud-2-line">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Status</span>
            <select className={`cursor-pointer ${inputClass}`} value={form.status} onChange={(e) => set('status', e.target.value as StayStatus)}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <div className="flex flex-col justify-center gap-3">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground-800">
              <input type="checkbox" className="h-4 w-4 cursor-pointer accent-primary-700" checked={form.verified} onChange={(e) => set('verified', e.target.checked)} />
              Verified by ZAMIN
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground-800">
              <input type="checkbox" className="h-4 w-4 cursor-pointer accent-primary-700" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              Feature on the homepage
            </label>
          </div>
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs text-foreground-500">
          <i className="ri-information-line mt-0.5"></i>
          Only <strong>PUBLISHED</strong> stays are visible to the public. Set to PUBLISHED when the
          listing is ready.
        </p>
      </Card>

      {error && (
        <p className="flex items-start gap-2 rounded-md bg-primary-50 px-4 py-3 text-sm text-primary-800">
          <i className="ri-error-warning-line mt-0.5"></i>
          {error}
        </p>
      )}
      {notice && (
        <p className="flex items-start gap-2 rounded-md bg-accent-100 px-4 py-3 text-sm text-accent-900">
          <i className="ri-checkbox-circle-line mt-0.5"></i>
          {notice}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-background-200 bg-background-100/95 px-4 py-4 backdrop-blur md:-mx-6 md:px-6">
        <button
          type="button"
          onClick={() => navigate('/admin/stays')}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-foreground-950"
        >
          <i className={`${saving ? 'ri-loader-4-line animate-spin' : 'ri-save-3-line'} text-base`}></i>
          {saving ? 'Saving…' : stay ? 'Save changes' : 'Create stay'}
        </button>
      </div>
    </form>
  );
}