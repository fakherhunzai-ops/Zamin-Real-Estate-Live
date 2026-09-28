import PropertyCard from '@/components/feature/PropertyCard';
import SectionHeading from '@/components/base/SectionHeading';
import { useProperties } from '@/hooks/useProperties';
import type { PropertyListing } from '@/mocks/properties';

export default function SimilarProperties({ current }: { current: PropertyListing }) {
  const { properties, loading } = useProperties();

  const sameArea = properties.filter(
    (item) => item.id !== current.id && item.location === current.location,
  );
  const sameType = properties.filter(
    (item) =>
      item.id !== current.id &&
      item.listingType === current.listingType &&
      !sameArea.some((area) => area.id === item.id),
  );

  const similar = [...sameArea, ...sameType].slice(0, 3);

  if (loading || similar.length === 0) return null;

  return (
    <section className="bg-background-100 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="You May Also Like"
          eyebrowIcon="ri-layout-masonry-line"
          title="Similar Properties"
          description={`More options near ${current.location} and across Gilgit-Baltistan.`}
        />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}