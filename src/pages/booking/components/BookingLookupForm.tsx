import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingLookupForm() {
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = reference.trim();
    if (!value) {
      setError('Please enter your booking reference.');
      return;
    }
    setError('');
    navigate(`/booking/${encodeURIComponent(value)}`);
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
        <i className="ri-file-search-line text-2xl"></i>
      </span>
      <h1 className="mt-4 font-heading text-2xl font-bold text-foreground-950">Find your booking</h1>
      <p className="mt-2 text-sm leading-relaxed text-foreground-600">
        Enter the booking reference from your confirmation (it looks like{' '}
        <span className="font-mono text-foreground-800">ZS-260928-A1B2C</span>) to view, print or
        share your confirmation.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <label htmlFor="booking-ref" className="text-sm font-semibold text-foreground-800">
          Booking reference
        </label>
        <input
          id="booking-ref"
          type="text"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          placeholder="ZS-260928-A1B2C"
          className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 font-mono text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none"
        />
        {error && <span className="text-xs text-primary-700">{error}</span>}
        <button
          type="submit"
          className="mt-1 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
        >
          <i className="ri-search-line text-base"></i>
          View my confirmation
        </button>
      </form>
    </div>
  );
}