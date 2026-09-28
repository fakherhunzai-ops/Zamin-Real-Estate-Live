import SectionHeading from '@/components/base/SectionHeading';
import StayCard from '@/components/feature/StayCard';
import { useStays } from '@/hooks/useStays';
import type { Stay } from '@/types/stays';

export default function SimilarStays({ stay }: { stay: Stay }) {
  const { stays, loading } = useStays({ destinationId: stay.destination_id ?? undefined, limit: 4 });

  const similar = stays.filter((item) => item.id !== stay.id).slice(0, 3);

  if (loading || similar.length === 0) return null;

  return (
    <section className="border-t border-background-200 bg-background-100 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="More in this area"
          eyebrowIcon="ri-home-smile-line"
          title="Similar stays you may like"
        />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((item) => (
            <StayCard key={item.id} stay={item} />
          ))}
        </div>
      </div>
    </section>
  );
}