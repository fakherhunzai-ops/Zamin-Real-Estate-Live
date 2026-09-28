import { useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Button from '@/components/base/Button';
import StayCard from '@/components/feature/StayCard';
import StaysFinalCTA from '@/pages/stays/components/StaysFinalCTA';
import StaysLoadingScreen from '@/pages/stays/components/StaysLoadingScreen';
import StaysNotFound from '@/pages/stays/components/StaysNotFound';
import DestinationHero from './components/DestinationHero';
import { useDestination } from '@/hooks/useStay';
import { useStays } from '@/hooks/useStays';

export default function DestinationPage({ slug }: { slug: string }) {
  const { destination, areas, loading, error } = useDestination(slug);
  const [activeAreaId, setActiveAreaId] = useState<string | null>(null);

  const { stays, loading: loadingStays, error: staysError, refetch } = useStays(
    destination
      ? { destinationId: destination.id, ...(activeAreaId ? { areaId: activeAreaId } : {}) }
      : {},
  );

  if (loading) return <StaysLoadingScreen label="Loading destination…" />;

  if (error) {
    return (
      <>
        <Navbar />
        <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
          <p className="text-foreground-700">We couldn&apos;t load this destination right now.</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!destination) return <StaysNotFound />;

  const activeAreaName = areas.find((area) => area.id === activeAreaId)?.name;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-50">
        <DestinationHero
          destination={destination}
          areaCount={areas.length}
          stayCount={stays.length}
        />

        {areas.length > 0 && (
          <section className="border-b border-background-200 bg-background-100 py-8 md:py-10">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground-950 md:text-xl">
                    Areas in {destination.name}
                  </h2>
                  <p className="mt-1 text-sm text-foreground-600">
                    Pick an area to narrow down your stay.
                  </p>
                </div>
                {activeAreaId && (
                  <button
                    type="button"
                    onClick={() => setActiveAreaId(null)}
                    className="inline-flex cursor-pointer items-center gap-2 self-start whitespace-nowrap rounded-md border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                  >
                    <i className="ri-close-line text-base"></i>
                    Clear area
                  </button>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveAreaId(null)}
                  aria-pressed={activeAreaId === null}
                  className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    activeAreaId === null
                      ? 'border-primary-800 bg-primary-800 text-background-50 dark:text-foreground-950'
                      : 'border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700'
                  }`}
                >
                  <i className="ri-apps-2-line text-base"></i>
                  All areas
                </button>
                {areas.map((area) => {
                  const active = activeAreaId === area.id;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setActiveAreaId(active ? null : area.id)}
                      aria-pressed={active}
                      className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                        active
                          ? 'border-primary-800 bg-primary-800 text-background-50 dark:text-foreground-950'
                          : 'border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700'
                      }`}
                    >
                      <i className="ri-map-pin-line text-base"></i>
                      {area.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
              {activeAreaName ? `Stays in ${activeAreaName}` : `Stays in ${destination.name}`}
            </h2>

            {staysError && (
              <div className="mt-8 rounded-card border border-background-200 bg-background-100 p-8 text-center">
                <p className="text-foreground-700">We couldn&apos;t load stays right now.</p>
                <div className="mt-4 flex justify-center">
                  <Button onClick={refetch} icon="ri-refresh-line">
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {!staysError && loadingStays && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-80 animate-pulse rounded-card border border-background-200 bg-background-100"
                  />
                ))}
              </div>
            )}

            {!staysError && !loadingStays && stays.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stays.map((stay) => (
                  <StayCard key={stay.id} stay={stay} />
                ))}
              </div>
            )}

            {!staysError && !loadingStays && stays.length === 0 && (
              <div className="mt-8 rounded-card border border-dashed border-background-300 bg-background-100 p-10 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background-200 text-foreground-600">
                  <i className="ri-home-heart-line text-2xl"></i>
                </span>
                <p className="mt-4 text-foreground-700">
                  {activeAreaName
                    ? `No stays in ${activeAreaName} are published yet.`
                    : `Stays in ${destination.name} are being onboarded — check back soon.`}
                </p>
                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  {activeAreaName && (
                    <Button variant="outline" onClick={() => setActiveAreaId(null)} icon="ri-refresh-line">
                      Show all areas
                    </Button>
                  )}
                  <Button to="/stays/host" icon="ri-add-line">
                    List a property here
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        <StaysFinalCTA />
      </main>
      <Footer />
    </>
  );
}