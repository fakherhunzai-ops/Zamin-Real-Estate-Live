import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import StaysLoadingScreen from '@/pages/stays/components/StaysLoadingScreen';
import StaysNotFound from '@/pages/stays/components/StaysNotFound';
import StayGallery from './components/StayGallery';
import StaySpecStrip from './components/StaySpecStrip';
import StayAmenityList from './components/StayAmenityList';
import StayReviews from './components/StayReviews';
import StayBookingCard from './components/StayBookingCard';
import StayAvailabilityCalendar from './components/StayAvailabilityCalendar';
import StayReservationForm from './components/StayReservationForm';
import StayMap from './components/StayMap';
import SimilarStays from './components/SimilarStays';
import { useStay } from '@/hooks/useStay';
import { useStayQuote } from '@/hooks/useStayQuote';
import { useStayCalendar } from '@/hooks/useStayCalendar';
import { defaultStayDates, nightsBetween, stayAmenities, MANAGEMENT_META } from '@/utils/stays';

export default function StayDetailPage({ slug }: { slug: string }) {
  const { stay, loading, error, refetch } = useStay(slug);
  const defaults = defaultStayDates();
  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [guests, setGuests] = useState('2');

  const { quote, loading: quoteLoading } = useStayQuote(stay?.id, checkIn, checkOut, Number(guests) || 1);
  const { calendar, refetch: refetchCalendar } = useStayCalendar(stay?.id);
  const nights = nightsBetween(checkIn, checkOut);
  const unavailable = Boolean(quote && quote.nights > 0 && !quote.available);

  const handleReserve = useCallback(() => {
    document.getElementById('stay-reservation')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  if (loading) return <StaysLoadingScreen label="Loading stay…" />;

  if (error) {
    return (
      <>
        <Navbar />
        <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-foreground-700">We couldn&apos;t load this stay right now.</p>
          <button
            type="button"
            onClick={refetch}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-900 dark:text-foreground-950"
          >
            <i className="ri-refresh-line text-base"></i>
            Try Again
          </button>
        </main>
        <Footer />
      </>
    );
  }

  if (!stay) return <StaysNotFound />;

  const location = [stay.area?.name, stay.destination?.name].filter(Boolean).join(', ');
  const amenities = stayAmenities(stay);
  const management = MANAGEMENT_META[stay.management_type];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-50">
        <div className="mx-auto max-w-7xl px-4 pt-24 md:px-6 md:pt-32">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-foreground-600 md:text-sm">
              <li>
                <Link to="/" className="transition-colors hover:text-primary-700">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <i className="ri-arrow-right-s-line"></i>
                <Link to="/stays" className="transition-colors hover:text-primary-700">
                  ZAMIN Stays
                </Link>
              </li>
              {stay.destination && (
                <li className="flex items-center gap-2">
                  <i className="ri-arrow-right-s-line"></i>
                  <Link
                    to={`/stays/${stay.destination.slug}`}
                    className="transition-colors hover:text-primary-700"
                  >
                    {stay.destination.name}
                  </Link>
                </li>
              )}
              <li className="flex items-center gap-2 text-foreground-900">
                <i className="ri-arrow-right-s-line"></i>
                <span className="max-w-[160px] truncate md:max-w-none">{stay.title}</span>
              </li>
            </ol>
          </nav>

          <header className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {stay.verified && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-900">
                  <i className="ri-shield-check-fill"></i>
                  Verified by ZAMIN
                </span>
              )}
              <span
                className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                  stay.management_type === 'MANAGED'
                    ? 'bg-primary-800 text-background-50'
                    : 'bg-secondary-100 text-secondary-900'
                }`}
              >
                {management.label}
              </span>
              {stay.category?.name && (
                <span className="rounded-md bg-background-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground-700">
                  {stay.category.name}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-heading text-2xl font-bold leading-tight text-foreground-950 md:text-4xl">
              {stay.title}
            </h1>

            {location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground-600 md:text-base">
                <span className="flex h-4 w-4 items-center justify-center text-accent-600">
                  <i className="ri-map-pin-2-line"></i>
                </span>
                {location}, Gilgit-Baltistan
              </p>
            )}
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 md:gap-10">
            <div className="flex flex-col gap-10 lg:col-span-2">
              <StayGallery images={stay.images ?? []} title={stay.title} />

              <div className="flex flex-col gap-6">
                <StaySpecStrip stay={stay} />

                {stay.summary && (
                  <p className="text-base leading-relaxed text-foreground-800 md:text-lg">
                    {stay.summary}
                  </p>
                )}
              </div>

              <section>
                <h2 className="font-heading text-xl font-semibold text-foreground-950 md:text-2xl">
                  About this stay
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground-700 md:text-base">
                  {stay.description || 'Full description coming soon.'}
                </p>
              </section>

              <section>
                <h2 className="font-heading text-xl font-semibold text-foreground-950 md:text-2xl">
                  What this place offers
                </h2>
                <div className="mt-5">
                  <StayAmenityList amenities={amenities} />
                </div>
              </section>

              <StayReviews stayId={stay.id} />

              <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-card border border-background-200 bg-background-50 p-5">
                  <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground-950">
                    <span className="flex h-5 w-5 items-center justify-center text-accent-600">
                      <i className="ri-time-line"></i>
                    </span>
                    Check-in & check-out
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-foreground-600">Check-in from</dt>
                      <dd className="font-semibold text-foreground-900">{stay.check_in_time || '14:00'}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-foreground-600">Check-out by</dt>
                      <dd className="font-semibold text-foreground-900">{stay.check_out_time || '11:00'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-card border border-background-200 bg-background-50 p-5">
                  <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground-950">
                    <span className="flex h-5 w-5 items-center justify-center text-accent-600">
                      <i className="ri-file-list-3-line"></i>
                    </span>
                    House rules
                  </h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground-700">
                    {stay.house_rules || 'Standard house rules apply. Ask us for details.'}
                  </p>
                </div>
              </section>

              <section className="rounded-card border border-background-200 bg-background-50 p-5">
                <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground-950">
                  <span className="flex h-5 w-5 items-center justify-center text-accent-600">
                    <i className="ri-calendar-close-line"></i>
                  </span>
                  Cancellation policy
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground-700">
                  {stay.cancellation_policy ||
                    'Cancellation terms are confirmed by ZAMIN when your reservation is finalised.'}
                </p>
              </section>

              <section className="rounded-card border border-background-200 bg-background-50 p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground-950">
                  Hosted by {stay.host_name || 'a ZAMIN host'}
                </h3>
                <p className="mt-1 text-sm text-foreground-600">
                  {stay.management_type === 'MANAGED'
                    ? 'This stay is fully managed by ZAMIN — we handle guests, cleaning and support.'
                    : 'Operated directly by the property owner, with ZAMIN support behind the scenes.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {stay.host_phone && (
                    <a
                      href={`tel:${stay.host_phone}`}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary-300 px-3.5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                    >
                      <i className="ri-phone-line text-base"></i>
                      {stay.host_phone}
                    </a>
                  )}
                  {stay.host_email && (
                    <a
                      href={`mailto:${stay.host_email}`}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary-300 px-3.5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                    >
                      <i className="ri-mail-line text-base"></i>
                      Email host
                    </a>
                  )}
                </div>
              </section>

              <StayMap stay={stay} />

              <StayAvailabilityCalendar
                calendar={calendar}
                checkIn={checkIn}
                checkOut={checkOut}
                onRangeChange={(nextCheckIn, nextCheckOut) => {
                  setCheckIn(nextCheckIn);
                  setCheckOut(nextCheckOut);
                }}
              />

              <StayReservationForm
                stay={stay}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                quote={quote}
                nights={nights}
                unavailable={unavailable}
                onBooked={refetchCalendar}
              />
            </div>

            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-28">
                <StayBookingCard
                  stay={stay}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  quote={quote}
                  quoteLoading={quoteLoading}
                  onCheckIn={setCheckIn}
                  onCheckOut={setCheckOut}
                  onGuests={setGuests}
                  onReserve={handleReserve}
                />
              </div>
            </aside>
          </div>

          <div className="h-14 md:h-20" />
        </div>

        <SimilarStays stay={stay} />
      </main>
      <Footer />
    </>
  );
}