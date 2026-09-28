import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStayDestinations } from '@/hooks/useStayDestinations';
import { defaultStayDates, nightsBetween } from '@/utils/stays';

export default function StaysHero() {
  const navigate = useNavigate();
  const { destinations } = useStayDestinations();
  const defaults = defaultStayDates();

  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [guests, setGuests] = useState('2');

  const nights = nightsBetween(checkIn, checkOut);
  const today = new Date().toISOString().slice(0, 10);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (destination) {
      navigate(`/stays/${destination}`);
      return;
    }
    document.getElementById('stays-destinations')?.scrollIntoView({ behavior: 'smooth' });
  };

  const fieldLabel = 'text-[11px] font-bold uppercase tracking-[0.14em] text-foreground-500';

  return (
    <section className="relative flex min-h-[620px] items-center justify-center overflow-hidden md:min-h-[720px]">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=A%20cosy%20modern%20mountain%20lodge%20villa%20with%20warm%20glowing%20windows%20nestled%20among%20pine%20trees%20in%20Gilgit-Baltistan%20Pakistan%20at%20golden%20hour%2C%20dramatic%20snow%20capped%20Karakoram%20peaks%20behind%2C%20soft%20misty%20valley%2C%20rich%20warm%20cinematic%20travel%20photography%20with%20deep%20shadows%20for%20text%20contrast&width=1920&height=1080&seq=stays-hero-gb-v1&orientation=landscape"
          alt="A warm mountain stay in Gilgit-Baltistan at golden hour"
          title="ZAMIN Stays — handpicked stays across Gilgit-Baltistan"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65"></div>
      </div>

      <div className="relative z-10 w-full px-4 pb-16 pt-32 md:px-6 md:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50 backdrop-blur-sm md:text-sm">
            <i className="ri-shield-star-line text-accent-400"></i>
            Local hosts. Verified stays. Local support.
          </span>

          <h1 className="animate-fade-up animate-fade-up-delay-1 mt-6 font-heading text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Stay Somewhere Worth Remembering
          </h1>

          <p className="animate-fade-up animate-fade-up-delay-2 mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-background-200 md:text-lg">
            Handpicked stays across Gilgit-Baltistan — from Hunza orchards and Skardu lakes to the
            high passes of Gojal. Book directly with hosts ZAMIN knows and trusts.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="animate-fade-up animate-fade-up-delay-3 mx-auto mt-9 max-w-5xl rounded-card border border-background-200 bg-background-50 p-4 md:p-5"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
            <div className="md:col-span-4">
              <label htmlFor="stay-dest" className={fieldLabel}>
                Destination
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3">
                <span className="flex h-4 w-4 items-center justify-center text-accent-600">
                  <i className="ri-map-pin-2-line"></i>
                </span>
                <select
                  id="stay-dest"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="w-full cursor-pointer bg-transparent py-2.5 text-sm text-foreground-900 focus:outline-none"
                >
                  <option value="">Anywhere in Gilgit-Baltistan</option>
                  {destinations.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="stay-checkin" className={fieldLabel}>
                Check-in
              </label>
              <input
                id="stay-checkin"
                type="date"
                min={today}
                value={checkIn}
                onChange={(event) => setCheckIn(event.target.value)}
                className="mt-1.5 w-full cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="stay-checkout" className={fieldLabel}>
                Check-out
              </label>
              <input
                id="stay-checkout"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(event) => setCheckOut(event.target.value)}
                className="mt-1.5 w-full cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="stay-guests" className={fieldLabel}>
                Guests
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3">
                <span className="flex h-4 w-4 items-center justify-center text-accent-600">
                  <i className="ri-group-line"></i>
                </span>
                <select
                  id="stay-guests"
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                  className="w-full cursor-pointer bg-transparent py-2.5 text-sm text-foreground-900 focus:outline-none"
                >
                  {Array.from({ length: 12 }).map((_, index) => (
                    <option key={index + 1} value={String(index + 1)}>
                      {index + 1} {index === 0 ? 'guest' : 'guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end md:col-span-2">
              <button
                type="submit"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
              >
                <i className="ri-search-line text-base"></i>
                Search Stays
              </button>
            </div>
          </div>

          {nights > 0 && (
            <p className="mt-3 text-xs text-foreground-600">
              <i className="ri-moon-line mr-1 text-accent-600"></i>
              {nights} {nights === 1 ? 'night' : 'nights'} · {guests}{' '}
              {guests === '1' ? 'guest' : 'guests'}
              {destination ? '' : ' · pick a destination to see exact stays'}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}