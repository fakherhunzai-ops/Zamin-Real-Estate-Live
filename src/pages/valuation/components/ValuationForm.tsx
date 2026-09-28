import { useState } from 'react';
import { FORM_URLS, AREAS } from '@/utils/site';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import FormStatus from '@/components/base/FormStatus';
import FormSuccessPanel from '@/components/base/FormSuccessPanel';

type Errors = Record<string, string>;

const PROPERTY_TYPES = ['House', 'Apartment', 'Land / Plot', 'Commercial'];
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Needs renovation'];

export default function ValuationForm() {
  const { status, errorMsg, successMsg, submit, reset } = useFormSubmit(FORM_URLS.valuation);
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => ((data.get(key) as string) || '').trim();

    const next: Errors = {};
    if (!get('property_type')) next.property_type = 'Please select a property type.';
    if (!get('location')) next.location = 'Please select a location.';
    if (!get('area')) next.area = 'Please enter the property area.';
    if (!get('condition')) next.condition = 'Please select the condition.';
    if (!get('owner_name')) next.owner_name = 'Please enter the owner name.';
    if (!get('phone')) next.phone = 'Please enter a phone number.';
    const email = get('email');
    if (!email) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    submit(event, {
      successMessage:
        'Thank you! Your valuation request has been received. A Zamin advisor will contact you to arrange your free assessment.',
      autoReply: { to: get('email'), name: get('owner_name'), type: 'valuation' },
    });
  };

  const labelClass = 'text-xs font-semibold uppercase tracking-wide text-foreground-600';
  const inputClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';
  const errorClass = 'text-xs font-medium text-primary-700';

  if (status === 'success') {
    return (
      <FormSuccessPanel
        title="Valuation request received"
        message={successMsg}
        onReset={reset}
        resetLabel="Request another valuation"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" data-readdy-form>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="val-type" className={labelClass}>
            Property Type *
          </label>
          <select id="val-type" name="property_type" defaultValue="" className={`${inputClass} cursor-pointer`}>
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
          <label htmlFor="val-location" className={labelClass}>
            Location *
          </label>
          <select id="val-location" name="location" defaultValue="" className={`${inputClass} cursor-pointer`}>
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

        <div className="flex flex-col gap-1">
          <label htmlFor="val-area" className={labelClass}>
            Area (Marla) *
          </label>
          <input
            id="val-area"
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
          <label htmlFor="val-bedrooms" className={labelClass}>
            Bedrooms
          </label>
          <input
            id="val-bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="e.g. 4"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="val-condition" className={labelClass}>
            Property Condition *
          </label>
          <select id="val-condition" name="condition" defaultValue="" className={`${inputClass} cursor-pointer`}>
            <option value="">Select…</option>
            {CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
          {errors.condition && <span className={errorClass}>{errors.condition}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="val-owner" className={labelClass}>
            Owner Name *
          </label>
          <input id="val-owner" name="owner_name" type="text" placeholder="Your full name" className={inputClass} />
          {errors.owner_name && <span className={errorClass}>{errors.owner_name}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="val-phone" className={labelClass}>
            Phone *
          </label>
          <input id="val-phone" name="phone" type="tel" placeholder="+92 3XX XXXXXXX" className={inputClass} />
          {errors.phone && <span className={errorClass}>{errors.phone}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="val-email" className={labelClass}>
            Email *
          </label>
          <input id="val-email" name="email" type="email" placeholder="you@email.com" className={inputClass} />
          {errors.email && <span className={errorClass}>{errors.email}</span>}
        </div>
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
        <p className="text-xs text-foreground-500">Fields marked * are required. The valuation is free of charge.</p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              <i className="ri-loader-4-line animate-spin text-base"></i>
              Requesting…
            </>
          ) : (
            <>
              <i className="ri-survey-line text-base"></i>
              Request Free Valuation
            </>
          )}
        </button>
      </div>

      <FormStatus status={status} successMsg={successMsg} errorMsg={errorMsg} />
    </form>
  );
}