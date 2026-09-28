import { useState } from 'react';
import SectionHeading from '@/components/base/SectionHeading';
import Button from '@/components/base/Button';
import StayCard from '@/components/feature/StayCard';
import { useStayCategories } from '@/hooks/useStayCategories';
import { useStays } from '@/hooks/useStays';

export default function StayTypeBrowser() {
  const { categories, loading: loadingCategories } = useStayCategories();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { stays, loading, error, refetch } = useStays(activeId ? { categoryId: activeId } : {});

  const activeName = categories.find((category) => category.id === activeId)?.name;

  return (
    <section id="stays-browse" className="bg-background-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Browse by stay type"
          eyebrowIcon="ri-layout-grid-line"
          title={activeName ? `${activeName} stays` : 'Find Your Kind of Stay'}
          description="From entire homes and cosy cabins to homestays and workation-ready apartments — pick a type and we'll filter instantly."
        />

        <div className="mt-8 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveId(null)}
            aria-pressed={activeId === null}
            className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              activeId === null
                ? 'border-primary-800 bg-primary-800 text-background-50 dark:text-foreground-950'
                : 'border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            <span className="flex h-4 w-4 items-center justify-center">
              <i className="ri-apps-2-line text-base"></i>
            </span>
            All stays
          </button>

          {loadingCategories
            ? Array.from({ length: 6 }).map((_, index) => (
                <span
                  key={index}
                  className="h-10 w-28 animate-pulse rounded-full border border-background-200 bg-background-100"
                />
              ))
            : categories.map((category) => {
                const active = activeId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveId(active ? null : category.id)}
                    aria-pressed={active}
                    title={category.description ?? category.name}
                    className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? 'border-primary-800 bg-primary-800 text-background-50 dark:text-foreground-950'
                        : 'border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700'
                    }`}
                  >
                    <span className="flex h-4 w-4 items-center justify-center">
                      <i className={`${category.icon ?? 'ri-home-4-line'} text-base`}></i>
                    </span>
                    {category.name}
                  </button>
                );
              })}
        </div>

        {error && (
          <div className="mt-10 rounded-card border border-background-200 bg-background-100 p-8 text-center">
            <p className="text-foreground-700">We couldn&apos;t load these stays right now.</p>
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
          <div className="mt-10 rounded-card border border-dashed border-background-300 bg-background-100 p-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background-200 text-foreground-600">
              <i className="ri-inbox-line text-2xl"></i>
            </span>
            <p className="mt-4 text-foreground-700">
              {activeName
                ? `No ${activeName} stays are published yet — check back soon.`
                : 'Stays are being onboarded — check back soon.'}
            </p>
            {activeName && (
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
              >
                <i className="ri-refresh-line text-base"></i>
                Show all stay types
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}