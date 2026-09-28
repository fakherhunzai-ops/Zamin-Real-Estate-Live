import { useState } from 'react';
import { FORM_URLS } from '@/utils/site';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import FormStatus from '@/components/base/FormStatus';
import FormSuccessPanel from '@/components/base/FormSuccessPanel';

type Errors = Record<string, string>;

const ENQUIRY_TYPES = [
  'Buying a Property',
  'Selling a Property',
  'Renting a Property',
  'Property Valuation',
  'Investment Advisory',
  'General Enquiry',
];

export default function ContactForm() {
  const { status, errorMsg, successMsg, submit, reset } = useFormSubmit(FORM_URLS.contact);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState('');

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
    if (!get('enquiry_type')) next.enquiry_type = 'Please choose an enquiry type.';
    if (!get('message')) next.message = 'Please tell us how we can help.';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    submit(event, {
      successMessage: 'Thank you! Your message has been sent — a Zamin agent will contact you shortly.',
      autoReply: { to: get('email'), name: get('name'), type: 'contact' },
    });
  };

  const labelClass = 'text-xs font-semibold uppercase tracking-wide text-foreground-600';
  const inputClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';
  const errorClass = 'text-xs font-medium text-primary-700';

  if (status === 'success') {
    return (
      <FormSuccessPanel
        title="Message sent"
        message={successMsg}
        onReset={reset}
        resetLabel="Send another message"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" data-readdy-form>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="contact-name" className={labelClass}>
            Name *
          </label>
          <input id="contact-name" name="name" type="text" placeholder="Your full name" className={inputClass} />
          {errors.name && <span className={errorClass}>{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="contact-phone" className={labelClass}>
            Phone *
          </label>
          <input id="contact-phone" name="phone" type="tel" placeholder="+92 3XX XXXXXXX" className={inputClass} />
          {errors.phone && <span className={errorClass}>{errors.phone}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="contact-email" className={labelClass}>
            Email *
          </label>
          <input id="contact-email" name="email" type="email" placeholder="you@email.com" className={inputClass} />
          {errors.email && <span className={errorClass}>{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="contact-enquiry" className={labelClass}>
            Enquiry Type *
          </label>
          <select
            id="contact-enquiry"
            name="enquiry_type"
            defaultValue=""
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select…</option>
            {ENQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.enquiry_type && <span className={errorClass}>{errors.enquiry_type}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={500}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us what you're looking for and we'll get right back to you."
          className={`${inputClass} resize-none`}
        ></textarea>
        <span className="text-right text-xs text-foreground-500">{message.length}/500</span>
        {errors.message && <span className={errorClass}>{errors.message}</span>}
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
        <p className="text-xs text-foreground-500">We usually reply within one working day.</p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              <i className="ri-loader-4-line animate-spin text-base"></i>
              Sending…
            </>
          ) : (
            <>
              <i className="ri-send-plane-line text-base"></i>
              Send Message
            </>
          )}
        </button>
      </div>

      <FormStatus status={status} successMsg={successMsg} errorMsg={errorMsg} />
    </form>
  );
}