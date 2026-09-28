import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import BookingLookupForm from '@/pages/booking/components/BookingLookupForm';
import BookingConfirmationCard from '@/pages/booking/components/BookingConfirmationCard';
import { fetchBookingByReference } from '@/utils/stayBooking';
import type { BookingConfirmation } from '@/types/stays';

export default function BookingPage() {
  const { reference } = useParams<{ reference?: string }>();
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async (ref: string) => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await fetchBookingByReference(ref);
      if (!data) {
        setNotFound(true);
        setBooking(null);
      } else {
        setBooking(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the booking.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reference) {
      void load(reference);
    } else {
      setBooking(null);
      setNotFound(false);
      setError(null);
    }
  }, [reference, load]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 md:px-6 md:pb-24 md:pt-36">
          {!reference ? (
            <BookingLookupForm />
          ) : loading ? (
            <div className="flex flex-col items-center gap-3 rounded-card border border-background-200 bg-background-50 py-20 text-foreground-500">
              <i className="ri-loader-4-line animate-spin text-3xl text-primary-700"></i>
              <p className="text-sm font-medium">Looking up your booking…</p>
            </div>
          ) : error ? (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-card border border-background-200 bg-background-50 py-16 text-center">
              <p className="text-foreground-700">We couldn&apos;t load that booking.</p>
              <button
                type="button"
                onClick={() => reference && load(reference)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50"
              >
                <i className="ri-refresh-line text-base"></i> Try again
              </button>
            </div>
          ) : notFound ? (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-card border border-dashed border-background-300 bg-background-50 px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-100 text-background-400">
                <i className="ri-file-unknow-line text-4xl"></i>
              </span>
              <h1 className="font-heading text-xl font-semibold text-foreground-950">Booking not found</h1>
              <p className="max-w-md text-sm text-foreground-600">
                We couldn&apos;t find a booking with the reference{' '}
                <span className="font-mono text-foreground-800">{reference}</span>. Please check the
                reference and try again, or contact our team and we&apos;ll help you.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50"
                >
                  <i className="ri-search-line text-base"></i>
                  Try another reference
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50"
                >
                  <i className="ri-customer-service-2-line text-base"></i>
                  Contact support
                </Link>
              </div>
            </div>
          ) : booking ? (
            <BookingConfirmationCard booking={booking} />
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}