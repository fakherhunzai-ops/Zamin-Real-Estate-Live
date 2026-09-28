import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useStayDestinations } from '@/hooks/useStayDestinations';
import { useStayCategories, useStayAmenities } from '@/hooks/useStayCategories';
import { useStayAreas } from '@/hooks/useStayAreas';
import { submitHostStay } from '@/utils/stayHost';
import type { ManagementType } from '@/types/stays';

type Errors = Record<string, string>;

const REASON_MESSAGES: Record<string, string> = {
  NAME_REQUIRED: 'Please enter your name.',
  PHONE_REQUIRED: 'Please enter your phone number.',
  TITLE_REQUIRED: 'Please give your property a name.',
};

export default function HostApplyForm() {
  const { destinations } = useStayDestinations();
  const { categories } = useStayCategories();
  const { amenities } = useStayAmenities();

  const [hostName, setHostName] = useState('');
  const [hostEmail, setHostEmail] = useState('');
  const [hostPhone, setHostPhone] = useState('');
  const [title, setTitle] = useState('');
  const [managementType, setManagementType] = useState<ManagementType>('LISTED');
  const [destinationId, setDestinationId] = useState('');
  const [areaId, setAreaId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [beds, setBeds] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [guestCapacity, setGuestCapacity] = useState('2');
  const [nightlyRate, setNightlyRate] = useState('');
  const [description, setDescription] = useState('');
  const [houseRules, setHouseRules] = useState('');
  const [ownershipNote, setOwnershipNote] = useState('');
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const { areas } = useStayAreas(destinationId || null);

  const amenitiesByGroup = useMemo(
    () =>
      amenities.reduce<Record<string, typeof amenities>>((acc, amenity) => {
        const key = amenity.category || 'General';
        if (!acc[key]) acc[key] = [];
        acc[key].push(amenity);
        return acc;
      }, {}),
    [amenities],
  );

  const toggleAmenity = (id: string) => {
    setAmenityIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const inputClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';
  const labelClass = 'text-sm font-semibold text-foreground-800';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (!hostName.trim()) next.hostName = 'Please enter your name.';
    if (!hostPhone.trim()) next.hostPhone = 'Please enter your phone number.';
    if (!title.trim()) next.title = 'Please give your property a name.';
    if (!destinationId) next.destination = 'Please choose a destination.';
    const rate = Number(nightlyRate);
    if (nightlyRate.trim() && (!Number.isFinite(rate) || rate < 0)) {
      next.nightlyRate = 'Enter a valid nightly rate.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus('error');
      setErrorMsg('Please fix the highlighted fields and try again.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');
    try {
      const data = await submitHostStay({
        hostName: hostName.trim(),
        hostEmail: hostEmail.trim(),
        hostPhone: hostPhone.trim(),
        title: title.trim(),
        managementType,
        destinationId: destinationId || null,
        areaId: areaId || null,
        categoryId: categoryId || null,
        address: address.trim() || null,
        bedrooms: Math.max(0, Math.floor(Number(bedrooms) || 0)),
        beds: Math.max(0, Math.floor(Number(beds) || 0)),
        bathrooms: Math.max(0, Math.floor(Number(bathrooms) || 0)),
        guestCapacity: Math.max(1, Math.floor(Number(guestCapacity) || 1)),
        baseNightlyRate: Number.isFinite(rate) ? Math.max(0, Math.round(rate)) : 0,
        description: description.trim() || null,
        houseRules: houseRules.trim() || null,
        amenityIds,
        ownershipNote: ownershipNote.trim() || null,
      });
      if (!data.success) {
        setStatus('error');
        setErrorMsg(REASON_MESSAGES[data.reason ?? ''] ?? 'We could not submit your property. Please try again.');
        return;
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-card border border-accent-300 bg-accent-100/50 p-6 md:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-3xl text-background-50">
          <i className="ri-check-line"></i>
        </span>
        <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground-950">
          Thank you — your property is in review
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground-700">
          We&apos;ve received your submission for <strong>{title}</strong>. Our team will review the
          details, and if it&apos;s a fit we&apos;ll arrange an inspection and a call to discuss
          pricing and presentation. Nothing is published until our team verifies and approves the
          listing.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/stays"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
          >
            <i className="ri-home-4-line text-base"></i>
            Explore ZAMIN Stays
          </Link>
          <Link
            to="/stays/managed-hosting"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-5 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
          >
            <i className="ri-vip-diamond-line text-base"></i>
            About managed hosting
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <i className="ri-user-3-line text-base"></i>
          </span>
          Your details
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ha-name" className={labelClass}>Full name *</label>
            <input id="ha-name" type="text" value={hostName} onChange={(e) => setHostName(e.target.value)} placeholder="e.g. Ali Karim" className={inputClass} />
            {errors.hostName && <span className="text-xs text-primary-700">{errors.hostName}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ha-phone" className={labelClass}>Phone / WhatsApp *</label>
            <input id="ha-phone" type="tel" value={hostPhone} onChange={(e) => setHostPhone(e.target.value)} placeholder="+92 3XX XXXXXXX" className={inputClass} />
            {errors.hostPhone && <span className="text-xs text-primary-700">{errors.hostPhone}</span>}
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="ha-email" className={labelClass}>Email</label>
            <input id="ha-email" type="email" value={hostEmail} onChange={(e) => setHostEmail(e.target.value)} placeholder="you@email.com" className={inputClass} />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <i className="ri-home-4-line text-base"></i>
          </span>
          Your property
        </h2>
        <div className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ha-title" className={labelClass}>Property name *</label>
            <input id="ha-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mountain View Villa Karimabad" className={inputClass} />
            {errors.title && <span className="text-xs text-primary-700">{errors.title}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={labelClass}>Hosting model</span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {([
                { value: 'LISTED', title: 'List with ZAMIN', desc: 'You run the property; we bring the guests.', icon: 'ri-key-2-line' },
                { value: 'MANAGED', title: 'ZAMIN manages it', desc: 'We handle pricing, guests, cleaning.', icon: 'ri-vip-diamond-line' },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setManagementType(option.value)}
                  className={`flex items-start gap-3 rounded-md border p-4 text-left transition-colors ${
                    managementType === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-background-300 bg-background-50 hover:border-primary-300'
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${managementType === option.value ? 'bg-primary-800 text-background-50' : 'bg-background-100 text-foreground-700'}`}>
                    <i className={`${option.icon} text-lg`}></i>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground-950">{option.title}</span>
                    <span className="mt-0.5 block text-xs text-foreground-600">{option.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ha-dest" className={labelClass}>Destination *</label>
              <select
                id="ha-dest"
                value={destinationId}
                onChange={(e) => {
                  setDestinationId(e.target.value);
                  setAreaId('');
                }}
                className={`cursor-pointer ${inputClass}`}
              >
                <option value="">Select a destination</option>
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>{destination.name}</option>
                ))}
              </select>
              {errors.destination && <span className="text-xs text-primary-700">{errors.destination}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ha-area" className={labelClass}>Area</label>
              <select
                id="ha-area"
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                disabled={!destinationId || areas.length === 0}
                className={`cursor-pointer ${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <option value="">{destinationId ? 'Select an area' : 'Choose a destination first'}</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ha-cat" className={labelClass}>Stay type</label>
              <select id="ha-cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`cursor-pointer ${inputClass}`}>
                <option value="">Select a type</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ha-address" className={labelClass}>Address / landmark</label>
              <input id="ha-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Village, road, nearest landmark" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-5">
            {([
              { id: 'ha-bedrooms', label: 'Bedrooms', value: bedrooms, set: setBedrooms },
              { id: 'ha-beds', label: 'Beds', value: beds, set: setBeds },
              { id: 'ha-baths', label: 'Bathrooms', value: bathrooms, set: setBathrooms },
              { id: 'ha-guests', label: 'Max guests', value: guestCapacity, set: setGuestCapacity },
            ]).map((field) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <label htmlFor={field.id} className={labelClass}>{field.label}</label>
                <input
                  id={field.id}
                  type="number"
                  min="0"
                  step="1"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ha-rate" className={labelClass}>PKR / night</label>
              <input id="ha-rate" type="number" min="0" step="500" value={nightlyRate} onChange={(e) => setNightlyRate(e.target.value)} placeholder="15000" className={inputClass} />
              {errors.nightlyRate && <span className="text-xs text-primary-700">{errors.nightlyRate}</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <i className="ri-file-text-line text-base"></i>
          </span>
          Details & amenities
        </h2>
        <div className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ha-desc" className={labelClass}>Description</label>
            <textarea id="ha-desc" rows={4} maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the space, views and what makes it special." className={`${inputClass} resize-none`}></textarea>
            <span className="text-right text-xs text-foreground-500">{description.length}/500</span>
          </div>

          {amenities.length > 0 && (
            <div className="flex flex-col gap-4">
              <span className={labelClass}>Amenities</span>
              {Object.entries(amenitiesByGroup).map(([group, items]) => (
                <div key={group}>
                  <p className="mb-2 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((amenity) => {
                      const active = amenityIds.includes(amenity.id);
                      return (
                        <button
                          key={amenity.id}
                          type="button"
                          onClick={() => toggleAmenity(amenity.id)}
                          aria-pressed={active}
                          className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                            active
                              ? 'border-primary-700 bg-primary-800 text-background-50'
                              : 'border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700'
                          }`}
                        >
                          {amenity.icon && (
                            <span className="flex h-4 w-4 items-center justify-center">
                              <i className={`${amenity.icon} text-sm`}></i>
                            </span>
                          )}
                          {amenity.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="ha-rules" className={labelClass}>House rules</label>
            <textarea id="ha-rules" rows={3} maxLength={500} value={houseRules} onChange={(e) => setHouseRules(e.target.value)} placeholder="Check-in times, quiet hours, smoking, pets…" className={`${inputClass} resize-none`}></textarea>
            <span className="text-right text-xs text-foreground-500">{houseRules.length}/500</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="ha-ownership" className={labelClass}>Ownership / authorization</label>
            <textarea id="ha-ownership" rows={3} maxLength={500} value={ownershipNote} onChange={(e) => setOwnershipNote(e.target.value)} placeholder="Are you the owner or an authorized representative? Any documents you can share during verification?" className={`${inputClass} resize-none`}></textarea>
            <p className="text-xs text-foreground-500">Kept private and used only for verification — never shown publicly.</p>
          </div>
        </div>
      </section>

      {status === 'error' && (
        <p className="flex items-start gap-2 rounded-md bg-primary-50 px-4 py-3 text-sm text-primary-800">
          <i className="ri-error-warning-line mt-0.5"></i>
          {errorMsg}
        </p>
      )}

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-6 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-foreground-950"
        >
          {status === 'loading' ? (
            <>
              <i className="ri-loader-4-line animate-spin text-base"></i>
              Submitting…
            </>
          ) : (
            <>
              <i className="ri-send-plane-line text-base"></i>
              Submit for review
            </>
          )}
        </button>
        <p className="text-xs text-foreground-500">
          Submitting doesn&apos;t publish your property — our team reviews every application first.
        </p>
      </div>
    </form>
  );
}