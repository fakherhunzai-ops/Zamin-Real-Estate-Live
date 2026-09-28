import { Link } from 'react-router-dom';
import SectionHeading from '@/components/base/SectionHeading';
import Button from '@/components/base/Button';
import StayCard from '@/components/feature/StayCard';
import { useStays } from '@/hooks/useStays';

export default function FeaturedStays() {
  const { stays, loading, error, refetch } = useStays({ featured: true, limit: 6 });

  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Handpicked"
          eyebrowIcon="ri-star-line"
          title="Featured Stays"
          description="A selection of the stays our team loves most — verified, well-located and ready to book directly."
        />

        {error && (
          <div className="mt-10 rounded-card border border-background-200 bg-background-100 p-8 text-center">
            <p className="text-foreground-700">We couldn&apos;t load stays right now.</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={refetch} icon="ri-refresh-line">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {!error && loading && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-card border border-background-200 bg-background-100"
              />
            ))}
          </div>
        )}

        {!error && !loading && stays.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        )}

        {!error && !loading && stays.length === 0 && (
          <div className="mt-10 overflow-hidden rounded-card border border-background-200 bg-background-100">
            <div className="flex flex-col items-start gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="max-w-2xl">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <i className="ri-home-heart-line text-2xl"></i>
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                  Be one of the first ZAMIN hosts
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-600 md:text-base">
                  We&apos;re onboarding verified stays across Hunza, Gojal, Skardu, Naltar and Ghizer
                  right now. List your property — or let ZAMIN manage it end to end — and be featured
                  here from day one.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col">
                <Button to="/stays/host" icon="ri-add-line">
                  Become a Host
                </Button>
                <Button to="/stays/managed-hosting" variant="outline" icon="ri-vip-diamond-line">
                  Managed Hosting
                </Button>
              </div>
            </div>
          </div>
        )}

        {!error && !loading && stays.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              to="/stays/host"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
            >
              <i className="ri-add-line text-base"></i>
              List your property with ZAMIN Stays
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}