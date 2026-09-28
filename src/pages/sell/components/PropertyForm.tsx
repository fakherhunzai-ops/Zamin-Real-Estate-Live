import { useState } from 'react';
import { FORM_URLS, AREAS } from '@/utils/site';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import FormStatus from '@/components/base/FormStatus';
import FormSuccessPanel from '@/components/base/FormSuccessPanel';

type Errors = Record<string, string>;

const PROPERTY_TYPES = ['House', 'Apartment', 'Land / Plot', 'Commercial'];

export default function PropertyForm() {
  const { status, errorMsg, successMsg, submit, reset } = useFormSubmit(FORM_URLS.listing);
  const [errors, setErrors] = useState<Errors>({});
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => ((data.get(key) as string) || '').trim();

    const next: Errors = {};
    if (!get('owner_name')) next.owner_name = 'Please enter your name.';
    if (!get('phone')) next.phone = 'Please enter your phone number.';
    const email = get('email');
    if (!email) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (!get('purpose')) next.purpose = 'Please choose sell or rent.';
    if (!get('property_type')) next.property_type = 'Please select a property type.';
    if (!get('location')) next.location = 'Please select a location.';
    if (!get('address')) next.address = 'Please enter the property address or area.';
    if (!get('expected_price')) next.expected_price = 'Please enter an expected price.';
    if (!get('area')) next.area = 'Please enter the property area.';

    setErrors(next);
    if (Object.keys(next).length > 0) {
      event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    submit(event, {
      successMessage:
        'Thank you! Your property details have been received. A Zamin advisor will contact you to arrange your free valuation.',
      autoReply: { to: get('email'), name: get('owner_name'), type: 'listing' },
    });
  };

  const labelClass = 'text-xs font-semibold uppercase tracking-wide text-foreground-600';
  const inputClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';
  const errorClass = 'text-xs font-medium text-primary-700';

  if (status === 'success') {
    return (
      <FormSuccessPanel
        title="Property details received"
        message={successMsg}
        onReset={reset}
        resetLabel="Submit another property"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" data-readdy-form>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="owner_name" className={labelClass}>
            Owner Name *
          </label>
          <input id="owner_name" name="owner_name" type="text" placeholder="Your full name" className={inputClass} />
          {errors.owner_name && <span className={errorClass}>{errors.owner_name}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className={labelClass}>
            Phone *
          </label>
          <input id="phone" name="phone" type="tel" placeholder="+92 3XX XXXXXXX" className={inputClass} />
          {errors.phone && <span className={errorClass}>{errors.phone}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input id="email" name="email" type="email" placeholder="you@email.com" className={inputClass} />
          {errors.email && <span className={errorClass}>{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="purpose" className={labelClass}>
            I want to *
          </label>
          <select id="purpose" name="purpose" defaultValue="" className={`${inputClass} cursor-pointer`}>
            <option value="">Select…</option>
            <option value="Sell">Sell my property</option>
            <option value="Rent">Rent out my property</option>
          </select>
          {errors.purpose && <span className={errorClass}>{errors.purpose}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="property_type" className={labelClass}>
            Property Type *
          </label>
          <select id="property_type" name="property_type" defaultValue="" className={`${inputClass} cursor-pointer`}>
            <option value="">Select…</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.property_type && <span className={errorClass}>{errors.property_type}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="location" className={labelClass}>
            Location *
          </label>
          <select id="location" name="location" defaultValue="" className={`${inputClass} cursor-pointer`}>
            <option value="">Select…</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
            <option value="Other">Other area</option>
          </select>
          {errors.location && <span className={errorClass}>{errors.location}</span>}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="address" className={labelClass}>
            Property Address / Area *
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="e.g. Karimabad, near Baltit Fort"
            className={inputClass}
          />
          {errors.address && <span className={errorClass}>{errors.address}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="expected_price" className={labelClass}>
            Expected Price (PKR) *
          </label>
          <input
            id="expected_price"
            name="expected_price"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="e.g. 25000000"
            className={inputClass}
          />
          {errors.expected_price && <span className={errorClass}>{errors.expected_price}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="area" className={labelClass}>
            Area (Marla) *
          </label>
          <input
            id="area"
            name="area"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="e.g. 10"
            className={inputClass}
          />
          {errors.area && <span className={errorClass}>{errors.area}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bedrooms" className={labelClass}>
            Bedrooms
          </label>
          <input id="bedrooms" name="bedrooms" type="number" min="0" inputMode="numeric" placeholder="e.g. 4" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bathrooms" className={labelClass}>
            Bathrooms
          </label>
          <input id="bathrooms" name="bathrooms" type="number" min="0" inputMode="numeric" placeholder="e.g. 3" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={500}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Tell us about the property — condition, views, features, anything that makes it special."
          className={`${inputClass} resize-none`}
        ></textarea>
        <span className="text-right text-xs text-foreground-500">{description.length}/500</span>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="property_images" className={labelClass}>
          Property Images
        </label>
        <input
          id="property_images"
          name="property_images"
          type="file"
          accept="image/*"
          multiple
          className="w-full cursor-pointer rounded-md border border-dashed border-background-300 bg-background-100 px-3 py-3 text-sm text-foreground-600 file:mr-3 file:rounded-md file:border-0 file:bg-primary-800 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-background-50"
        />
        <span className="text-xs text-foreground-500">
          Optional. You can also share photos with your agent after submitting.
        </span>
      </div>

      <input
        className="form-supplementary"
        type="text"
        name="website_alt"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        readOnly
      />

      <div className="flex flex-col gap-3 border-t border-background-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-foreground-500">Fields marked * are required.</p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              <i className="ri-loader-4-line animate-spin text-base"></i>
              Submitting…
            </>
          ) : (
            <>
              <i className="ri-send-plane-line text-base"></i>
              Submit Property
            </>
          )}
        </button>
      </div>

      <FormStatus status={status} successMsg={successMsg} errorMsg={errorMsg} />
    </form>
  );
}