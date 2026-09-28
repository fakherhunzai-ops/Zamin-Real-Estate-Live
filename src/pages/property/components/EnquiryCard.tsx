import { useState } from 'react';
import type { PropertyListing } from '@/mocks/properties';
import { FORM_URLS, SITE } from '@/utils/site';
import { notifyEnquiry } from '@/utils/enquiryNotify';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import FormStatus from '@/components/base/FormStatus';

type Errors = Record<string, string>;

export default function EnquiryCard({ property }: { property: PropertyListing }) {
  const { status, errorMsg, successMsg, submit } = useFormSubmit(FORM_URLS.enquiry);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState('');

  const isRent = property.listingType === 'rent';
  const whatsappHref = `${SITE.whatsappHref}?text=${encodeURIComponent(
    `Hi Zamin, I'm interested in "${property.title}" (${property.subArea}, ${property.location}). Could you share more details?`,
  )}`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => ((data.get(key) as string) || '').trim();

    const next: Errors = {};
    if (!get('name')) next.name = 'Please enter your name.';
    if (!get('phone')) next.phone = 'Please enter your phone number.';
    const email = get('email');
    if (!email) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const values = {
      Name: get('name'),
      Phone: get('phone'),
      Email: get('email'),
      Message: get('message'),
      Property: property.title,
      'Property ID': property.id,
      'Listing type': isRent ? 'Rent' : 'Sale',
    };

    submit(event, {
      successMessage: 'Thank you! Your enquiry has been sent — one of our agents will contact you shortly.',
      onSuccess: () => {
        void notifyEnquiry(values);
      },
    });
  };

  const scheduleViewing = () => {
    setMessage(`I would like to schedule a viewing for "${property.title}".`);
    const node = document.getElementById('enquiry-form');
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      (document.getElementById('enquiry-name') as HTMLInputElement | null)?.focus();
    }, 400);
  };

  const inputClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';

  return (
    <div className="rounded-card border border-background-200 bg-background-50 p-5">
      <span
        className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
          isRent ? 'bg-primary-100 text-primary-800' : 'bg-primary-800 text-background-50'
        }`}
      >
        {isRent ? 'For Rent' : 'For Sale'}
      </span>

      <h2 className="mt-3 font-heading text-xl font-semibold text-foreground-950">
        Interested in this property?
      </h2>
      <p className="mt-1 text-sm text-foreground-600">
        Send an enquiry and a Zamin agent will get back to you within one working day.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <a
          href={SITE.phoneHref}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-800 px-3 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
        >
          <i className="ri-phone-line text-base"></i>
          Call
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-primary-300 px-3 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
        >
          <i className="ri-whatsapp-line text-base"></i>
          WhatsApp
        </a>
        <button
          type="button"
          onClick={scheduleViewing}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-background-300 px-3 py-2.5 text-sm font-semibold text-foreground-800 transition-colors hover:bg-background-100"
        >
          <i className="ri-calendar-line text-base"></i>
          Viewing
        </button>
      </div>

      <form id="enquiry-form" onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3" data-readdy-form>
        <input type="hidden" name="property_title" value={property.title} />
        <input type="hidden" name="property_id" value={property.id} />
        <input type="hidden" name="listing_type" value={property.listingType} />

        <div className="flex flex-col gap-1">
          <label htmlFor="enquiry-name" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
            Name
          </label>
          <input id="enquiry-name" name="name" type="text" placeholder="Your full name" className={inputClass} />
          {errors.name && <span className="text-xs text-primary-700">{errors.name}</span>}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="enquiry-phone" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
              Phone
            </label>
            <input id="enquiry-phone" name="phone" type="tel" placeholder="+92 3XX XXXXXXX" className={inputClass} />
            {errors.phone && <span className="text-xs text-primary-700">{errors.phone}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="enquiry-email" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
              Email
            </label>
            <input id="enquiry-email" name="email" type="email" placeholder="you@email.com" className={inputClass} />
            {errors.email && <span className="text-xs text-primary-700">{errors.email}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="enquiry-message" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
            Message
          </label>
          <textarea
            id="enquiry-message"
            name="message"
            rows={3}
            maxLength={500}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="I'd like to know more about this property..."
            className={`${inputClass} resize-none`}
          ></textarea>
          <span className="text-right text-xs text-foreground-500">{message.length}/500</span>
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

        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-800 px-4 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              <i className="ri-loader-4-line animate-spin text-base"></i>
              Sending…
            </>
          ) : (
            <>
              <i className="ri-send-plane-line text-base"></i>
              Send Enquiry
            </>
          )}
        </button>

        <FormStatus status={status} successMsg={successMsg} errorMsg={errorMsg} />
      </form>
    </div>
  );
}