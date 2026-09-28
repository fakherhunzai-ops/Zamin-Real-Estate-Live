import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import Button from '@/components/base/Button';
import PropertyCard from '@/components/feature/PropertyCard';
import PropertyAlertsBand from '@/components/feature/PropertyAlertsBand';
import { useProperties } from '@/hooks/useProperties';
import { useSavedSearch } from '@/hooks/useSavedSearch';
import ListingToolbar from './components/ListingToolbar';
import PropertyFilters, {
  EMPTY_FILTERS,
  describeFilters,
  filterProperties,
  filtersFromParams,
  isFiltersActive,
  type PropertyFiltersValue,
} from './components/PropertyFilters';

type Props = { listingType: 'sale' | 'rent' };
type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';

const PAGE_SIZE = 6;

export default function PropertiesPage({ listingType }: Props) {
  const [searchParams] = useSearchParams();
  const paramsKey = searchParams.toString();
  const { properties, loading, error, refetch } = useProperties({ listingType });

  const [filters, setFilters] = useState<PropertyFiltersValue>(() =>
    filtersFromParams(searchParams),
  );
  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { saved, save: saveSearch, clear: clearSavedSearch } = useSavedSearch();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleFiltersChange = (next: PropertyFiltersValue) => {
    setFilters(next);
    if (isFiltersActive(next)) {
      saveSearch({ filters: next, listingType, savedAt: new Date().toISOString() });
    } else {
      clearSavedSearch();
    }
  };

  useEffect(() => {
    setFilters(filtersFromParams(new URLSearchParams(paramsKey)));
  }, [paramsKey]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filters, sort]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const filtered = useMemo(() => filterProperties(properties, filters), [properties, filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case 'newest':
        return list.reverse();
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      default:
        return list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
  }, [filtered, sort]);

  const shown = sorted.slice(0, visible);
  const hasMore = visible < sorted.length;

  const isSale = listingType === 'sale';
  const pageTitle = isSale ? 'Properties for Sale' : 'Properties for Rent';
  const subtitle = isSale
    ? 'Browse verified houses, apartments, land and commercial properties for sale across Hunza, Gilgit, Skardu, Nagar, Ghizer and Chilas.'
    : 'Discover houses and apartments available for rent across Gilgit-Baltistan, with transparent one-month-rent commission and reliable landlord service.';

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS);
    clearSavedSearch();
  };

  const savedForPage =
    saved && saved.listingType === listingType && isFiltersActive(saved.filters) ? saved : null;

  const savedMatches = useMemo(
    () => (savedForPage ? filterProperties(properties, savedForPage.filters) : []),
    [savedForPage, properties],
  );

  const savedNewCount = useMemo(
    () => savedMatches.filter((property) => property.isNew).length,
    [savedMatches],
  );

  const showSavedBanner = Boolean(savedForPage) && !bannerDismissed && !loading && !error;

  const applySavedSearch = () => {
    if (!savedForPage) return;
    setFilters(savedForPage.filters);
    setBannerDismissed(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-10 pt-24 md:pb-14 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Panoramic%20view%20of%20Hunza%20Valley%20Gilgit%20Baltistan%20with%20mountains%20and%20green%20terrace%20fields%20soft%20warm%20light%20cinematic%20wide%20landscape%20photography&width=1600&height=500&seq=zamin-listing-hero&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs
              light
              items={[{ label: 'Home', to: '/' }, { label: pageTitle }]}
            />
            <h1 className="mt-4 font-heading text-3xl font-bold text-background-50 md:text-5xl">
              {pageTitle} in Gilgit-Baltistan
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-background-300 md:text-base">
              {subtitle}
            </p>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
              <aside className="hidden rounded-card border border-background-200 bg-background-50 p-5 lg:sticky lg:top-24 lg:block">
                <PropertyFilters
                  value={filters}
                  onChange={handleFiltersChange}
                  onReset={resetFilters}
                  resultCount={sorted.length}
                  listingType={listingType}
                />
              </aside>

              <div>
                {showSavedBanner && savedForPage && (
                  <div className="mb-5 flex flex-col gap-4 rounded-card border border-accent-200 bg-accent-50 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                        <i className="ri-history-line text-lg"></i>
                      </span>
                      <div>
                        <p className="font-heading text-sm font-bold text-accent-900 md:text-base">
                          Welcome back — re-check your saved search
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground-700">
                          Last time you searched for{' '}
                          <strong className="font-semibold text-foreground-900">
                            {describeFilters(savedForPage.filters)}
                          </strong>
                          .{' '}
                          {savedMatches.length > 0 ? (
                            <>
                              {savedMatches.length}{' '}
                              {savedMatches.length === 1 ? 'listing matches' : 'listings match'}{' '}
                              right now
                              {savedNewCount > 0
                                ? `, including ${savedNewCount} new ${savedNewCount === 1 ? 'listing' : 'listings'}`
                                : ''}
                              .
                            </>
                          ) : (
                            'No listings match at the moment — new ones are added regularly.'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      {savedMatches.length > 0 && (
                        <button
                          type="button"
                          onClick={applySavedSearch}
                          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-accent-600 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-accent-700"
                        >
                          <span className="flex h-4 w-4 items-center justify-center">
                            <i className="ri-refresh-line text-base"></i>
                          </span>
                          Show these listings
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setBannerDismissed(true)}
                        className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-semibold text-foreground-600 transition-colors hover:text-foreground-900"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                <ListingToolbar
                  count={sorted.length}
                  sort={sort}
                  onSortChange={setSort}
                  view={view}
                  onViewChange={setView}
                  onOpenFilters={() => setDrawerOpen(true)}
                />

                {error && (
                  <div className="mt-6 rounded-card border border-background-200 bg-background-50 p-8 text-center">
                    <p className="text-foreground-700">
                      We couldn&apos;t load the listings right now. Please try again.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Button onClick={refetch} icon="ri-refresh-line">
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                {!error && loading && (
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-80 animate-pulse rounded-card border border-background-200 bg-background-50"
                      />
                    ))}
                  </div>
                )}

                {!error && !loading && shown.length === 0 && (
                  <div className="mt-6 rounded-card border border-background-200 bg-background-50 p-10 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                      <i className="ri-search-eye-line text-2xl"></i>
                    </span>
                    <h2 className="mt-4 font-heading text-xl font-semibold text-foreground-950">
                      No properties match your filters
                    </h2>
                    <p className="mt-2 text-sm text-foreground-600">
                      Try widening your location, price or bedroom selection.
                    </p>
                    <div className="mt-5 flex justify-center">
                      <Button onClick={resetFilters} icon="ri-refresh-line">
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}

                {!error && !loading && shown.length > 0 && (
                  <>
                    <div
                      className={
                        view === 'grid'
                          ? 'mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'
                          : 'mt-6 flex flex-col gap-6'
                      }
                    >
                      {shown.map((property) => (
                        <PropertyCard key={property.id} property={property} variant={view} />
                      ))}
                    </div>

                    {hasMore ? (
                      <div className="mt-10 flex flex-col items-center gap-3">
                        <p className="text-sm text-foreground-600">
                          Showing {shown.length} of {sorted.length} properties
                        </p>
                        <Button
                          variant="outline"
                          icon="ri-add-line"
                          onClick={() => setVisible((value) => value + PAGE_SIZE)}
                        >
                          Load More Properties
                        </Button>
                      </div>
                    ) : (
                      sorted.length > PAGE_SIZE && (
                        <p className="mt-10 text-center text-sm text-foreground-600">
                          You&apos;ve reached the end — {sorted.length} properties shown.
                        </p>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <PropertyAlertsBand />
      </main>

      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-foreground-950/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          ></div>
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-card bg-background-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-foreground-950">
                Filter Properties
              </h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-foreground-600 hover:bg-background-100"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <PropertyFilters
              value={filters}
              onChange={handleFiltersChange}
              onReset={resetFilters}
              resultCount={sorted.length}
              listingType={listingType}
              onApply={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}