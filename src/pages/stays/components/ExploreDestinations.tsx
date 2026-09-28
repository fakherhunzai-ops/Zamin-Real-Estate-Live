import SectionHeading from '@/components/base/SectionHeading';
import Button from '@/components/base/Button';
import DestinationCard from '@/components/feature/DestinationCard';
import { useStayDestinations } from '@/hooks/useStayDestinations';

export default function ExploreDestinations() {
  const { destinations, loading, error, refetch } = useStayDestinations();

  return (
    <section id="stays-destinations" className="bg-background-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Explore the region"
          eyebrowIcon="ri-road-map-line"
          title="Explore by Destination"
          description="Every stay sits in a real Gilgit-Baltistan destination — with the areas, valleys and viewpoints travellers actually search for."
          align="center"
          className="max-w-2xl"
        />

        {error && (
          <div className="mt-10 rounded-card border border-background-200 bg-background-50 p-8 text-center">
            <p className="text-foreground-700">We couldn&apos;t load destinations right now.</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={refetch} icon="ri-refresh-line">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {!error && (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-72 animate-pulse rounded-card border border-background-200 bg-background-200/70"
                  />
                ))
              : destinations.map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
          </div>
        )}
      </div>
    </section>
  );
}