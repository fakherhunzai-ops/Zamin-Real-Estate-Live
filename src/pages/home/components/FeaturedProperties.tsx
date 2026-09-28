import { useState } from 'react';
import PropertyCard from '@/components/feature/PropertyCard';
import Button from '@/components/base/Button';
import SectionHeading from '@/components/base/SectionHeading';
import { useProperties } from '@/hooks/useProperties';

type ViewMode = 'featured' | 'all';

const FEATURED_LIMIT = 5;

const TABS: { key: ViewMode; label: string; icon: string }[] = [
  { key: 'featured', label: 'Featured', icon: 'ri-star-line' },
  { key: 'all', label: 'All Listings', icon: 'ri-layout-grid-line' },
];

export default function FeaturedProperties() {
  const { properties, loading, error, refetch } = useProperties();
  const [mode, setMode] = useState<ViewMode>('featured');

  const featured = properties.filter((property) => property.featured);
  const featuredList = (featured.length > 0 ? featured : properties).slice(0, FEATURED_LIMIT);
  const display = mode === 'featured' ? featuredList : properties;

  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Featured Listings"
            eyebrowIcon="ri-flashlight-line"
            title="Featured Properties"
            description="Hand-picked homes, apartments, land and commercial properties across Gilgit-Baltistan."
          />

          <div className="flex items-center gap-1 rounded-full border border-background-200 bg-background-100 px-1 py-1">
            {TABS.map((tab) => {
              const active = mode === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMode(tab.key)}
                  aria-pressed={active}
                  className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-primary-800 text-background-50 dark:text-foreground-950'
                      : 'text-foreground-600 hover:text-foreground-900'
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center">
                    <i className={`${tab.icon} text-base`}></i>
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mt-10 rounded-card border border-background-200 bg-background-100 p-8 text-center">
            <p className="text-foreground-700">We couldn&apos;t load the latest listings right now.</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={refetch} icon="ri-refresh-line">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {!error && (
          <>
            {!loading && (
              <p className="mt-8 text-sm text-foreground-600">
                Showing{' '}
                <span className="font-semibold text-foreground-950">
                  {display.length}
                </span>{' '}
                {mode === 'featured' ? 'hand-picked' : ''}{' '}
                {display.length === 1 ? 'property' : 'properties'}
                {mode === 'featured' && properties.length > FEATURED_LIMIT ? (
                  <>
                    {' '}
                    — switch to{' '}
                    <button
                      type="button"
                      onClick={() => setMode('all')}
                      className="cursor-pointer font-semibold text-primary-700 underline-offset-2 hover:underline"
                    >
                      All Listings
                    </button>{' '}
                    to see all {properties.length}
                  </>
                ) : null}
              </p>
            )}

            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading
                ? Array.from({ length: mode === 'featured' ? FEATURED_LIMIT : 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-80 animate-pulse rounded-card border border-background-200 bg-background-100"
                    />
                  ))
                : display.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
            </div>

            {!loading && mode === 'all' && (
              <div className="mt-10 flex justify-center">
                <Button to="/properties-for-sale" variant="outline" iconRight="ri-arrow-right-line">
                  Browse Properties for Sale
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}