import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import Button from '@/components/base/Button';
import ReportHeader from '@/components/feature/ReportHeader';
import PrintButton from '@/components/base/PrintButton';
import EmailSummaryButton from '@/components/base/EmailSummaryButton';
import WhatsAppShareButton from '@/components/base/WhatsAppShareButton';
import PropertyCard from '@/components/feature/PropertyCard';
import ShortlistCompare from '@/components/feature/ShortlistCompare';
import { useProperties } from '@/hooks/useProperties';
import { useShortlist } from '@/hooks/useShortlist';
import { formatPKR, formatPrice } from '@/utils/format';
import { SITE } from '@/utils/site';
import type { PropertyListing } from '@/mocks/properties';

export default function ShortlistPage() {
  const { properties, loading, error, refetch } = useProperties();
  const { ids, clear } = useShortlist();

  const shortlisted = ids
    .map((id) => properties.find((property) => property.id === id))
    .filter((property): property is PropertyListing => Boolean(property));

  const totalValue = shortlisted.reduce((sum, property) => sum + property.price, 0);

  const shareText = [
    `${SITE.brand} — My Saved Properties`,
    '',
    ...shortlisted.map(
      (property, index) =>
        `${index + 1}. ${property.title}\n   ${property.subArea}, ${property.location}\n   ${
          property.bedrooms > 0 ? `${property.bedrooms} beds · ` : ''
        }${property.bathrooms > 0 ? `${property.bathrooms} baths · ` : ''}${property.area} ${
          property.areaUnit
        }\n   ${formatPrice(property.price, property.listingType)}`,
    ),
    '',
    `Total indicative value: ${formatPKR(totalValue)}`,
    `${SITE.phoneDisplay} · ${SITE.email}`,
  ].join('\n');

  const emailSections = shortlisted.map((property, index) => ({
    heading: `${index + 1}. ${property.title}`,
    items: [
      { label: 'Location', value: `${property.subArea}, ${property.location}` },
      { label: 'Price', value: formatPrice(property.price, property.listingType) },
      { label: 'Type', value: property.type },
      {
        label: 'Details',
        value: `${property.bedrooms} beds · ${property.bathrooms} baths · ${property.area} ${property.areaUnit}`,
      },
    ],
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-10 pt-24 md:pb-14 md:pt-28">
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'Saved Properties' }]} />
            <div className="mt-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
                <i className="ri-heart-3-line text-accent-400"></i>
                Your Shortlist
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
                Saved Properties
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-background-300 md:text-base">
                Keep the homes you like in one place, then email or print a clean summary to share
                with family, a partner or your bank.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            {loading && (
              <div className="flex items-center justify-center gap-3 py-20 text-foreground-600">
                <i className="ri-loader-4-line animate-spin text-xl"></i>
                Loading your shortlist…
              </div>
            )}

            {error && !loading && (
              <div className="rounded-card border border-background-200 bg-background-50 p-8 text-center">
                <p className="text-foreground-700">We couldn&apos;t load your properties right now.</p>
                <div className="mt-4 flex justify-center">
                  <Button onClick={refetch} icon="ri-refresh-line">
                    Try again
                  </Button>
                </div>
              </div>
            )}

            {!loading && !error && shortlisted.length === 0 && (
              <div className="rounded-card border border-background-200 bg-background-50 px-6 py-16 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                  <i className="ri-heart-3-line text-3xl"></i>
                </span>
                <h2 className="mt-5 font-heading text-xl font-bold text-foreground-950">
                  No saved properties yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-foreground-600">
                  Tap the heart on any listing to add it here, then email or print the shortlist as a
                  PDF-ready summary.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button to="/properties-for-sale" icon="ri-home-4-line">
                    Browse Properties for Sale
                  </Button>
                  <Button to="/properties-for-rent" variant="outline" icon="ri-key-2-line">
                    Browse Rentals
                  </Button>
                </div>
              </div>
            )}

            {!loading && shortlisted.length > 0 && (
              <>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-foreground-600">
                      {shortlisted.length} saved {shortlisted.length === 1 ? 'property' : 'properties'}
                    </p>
                    <button
                      type="button"
                      onClick={clear}
                      className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border border-background-300 px-3.5 py-2 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-200/70 print:hidden"
                    >
                      <i className="ri-delete-bin-6-line text-base"></i>
                      Clear all
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {shortlisted.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="print-area rounded-card border border-background-200 bg-background-50 p-6 lg:sticky lg:top-24">
                    <h2 className="font-heading text-lg font-bold text-foreground-950">
                      Shortlist Summary
                    </h2>
                    <p className="mt-1 text-sm text-foreground-600">
                      A clean, shareable overview of the properties you saved.
                    </p>

                    <div className="mt-5">
                      <ReportHeader title="Saved Properties Summary" />
                    </div>

                    <ul className="mt-5 flex flex-col divide-y divide-background-100">
                      {shortlisted.map((property, index) => (
                        <li key={property.id} className="py-3">
                          <p className="text-sm font-semibold text-foreground-900">
                            {index + 1}. {property.title}
                          </p>
                          <p className="mt-0.5 text-xs text-foreground-600">
                            {property.subArea}, {property.location}
                          </p>
                          <p className="mt-1 text-sm font-bold text-primary-700">
                            {formatPrice(property.price, property.listingType)}
                          </p>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-background-200 pt-4">
                      <span className="text-sm text-foreground-600">Total indicative value</span>
                      <span className="font-heading text-base font-bold text-primary-900">
                        {formatPKR(totalValue)}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 print:hidden">
                      <PrintButton />
                      <EmailSummaryButton title="My Saved Properties" sections={emailSections} />
                      <WhatsAppShareButton text={shareText} label="Share on WhatsApp" />
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-foreground-500">
                      Prices are indicative and may change. Contact Zamin to confirm availability and
                      arrange a viewing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 print:hidden">
                <ShortlistCompare properties={shortlisted} />
              </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}