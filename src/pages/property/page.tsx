import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import Button from '@/components/base/Button';
import { useProperty } from '@/hooks/useProperty';
import { formatPrice } from '@/utils/format';
import Gallery from './components/Gallery';
import EnquiryCard from './components/EnquiryCard';
import SimilarProperties from './components/SimilarProperties';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { property, loading } = useProperty(id);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background-100 pt-24 md:pt-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="h-64 animate-pulse rounded-card bg-background-50 md:h-[480px]"></div>
            <div className="mt-6 h-40 animate-pulse rounded-card bg-background-50"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-background-100 px-4 py-32 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <i className="ri-home-4-line text-3xl"></i>
          </span>
          <h1 className="mt-6 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
            Property not found
          </h1>
          <p className="mt-3 max-w-md text-foreground-600">
            This listing may have been sold, rented or removed. Explore our current properties instead.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/properties-for-sale" icon="ri-home-4-line">
              Browse for Sale
            </Button>
            <Button to="/properties-for-rent" variant="outline" icon="ri-key-2-line">
              Browse for Rent
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isRent = property.listingType === 'rent';
  const listPath = isRent ? '/properties-for-rent' : '/properties-for-sale';
  const listLabel = isRent ? 'Properties for Rent' : 'Properties for Sale';

  const specs = [
    { icon: 'ri-hotel-bed-line', label: 'Bedrooms', value: property.bedrooms > 0 ? String(property.bedrooms) : '—' },
    { icon: 'ri-water-flash-line', label: 'Bathrooms', value: property.bathrooms > 0 ? String(property.bathrooms) : '—' },
    { icon: 'ri-layout-2-line', label: 'Area', value: `${property.area} ${property.areaUnit}` },
    { icon: 'ri-home-4-line', label: 'Type', value: property.type },
    { icon: 'ri-car-line', label: 'Parking', value: property.parking > 0 ? String(property.parking) : '—' },
    { icon: 'ri-calendar-line', label: 'Built', value: property.yearBuilt > 0 ? String(property.yearBuilt) : '—' },
  ];

  const detailRows = [
    { label: 'Property Type', value: property.type },
    { label: 'Listing Type', value: isRent ? 'For Rent' : 'For Sale' },
    { label: 'Bedrooms', value: property.bedrooms > 0 ? String(property.bedrooms) : 'N/A' },
    { label: 'Bathrooms', value: property.bathrooms > 0 ? String(property.bathrooms) : 'N/A' },
    { label: 'Area', value: `${property.area} ${property.areaUnit}` },
    { label: 'Parking Spaces', value: property.parking > 0 ? String(property.parking) : 'N/A' },
    { label: 'Furnishing', value: property.furnished ? 'Furnished' : 'Unfurnished' },
    { label: 'Year Built', value: property.yearBuilt > 0 ? String(property.yearBuilt) : 'N/A' },
    { label: 'Reference', value: property.id.toUpperCase() },
  ];

  const mapSrc = `https://www.google.com/maps?q=${property.lat},${property.lng}&z=13&output=embed`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <div className="border-b border-background-200 bg-background-50 pt-20 md:pt-24">
          <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
            <Breadcrumbs
              items={[
                { label: 'Home', to: '/' },
                { label: listLabel, to: listPath },
                { label: property.title },
              ]}
            />
          </div>
        </div>

        <section className="py-6 md:py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
              <div className="flex flex-col gap-8">
                <Gallery
                  images={property.gallery.length > 0 ? property.gallery : [property.image]}
                  title={property.title}
                  location={property.location}
                />

                <div className="rounded-card border border-background-200 bg-background-50 p-5 md:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
                        {property.title}
                      </h1>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground-600">
                        <span className="flex h-4 w-4 items-center justify-center text-primary-600">
                          <i className="ri-map-pin-2-line text-sm"></i>
                        </span>
                        {property.subArea}, {property.location}, Gilgit-Baltistan
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-heading text-2xl font-bold text-primary-700 md:text-3xl">
                        {formatPrice(property.price, property.listingType)}
                      </div>
                      <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-wide text-foreground-500">
                        {isRent ? 'Monthly Rent' : 'Asking Price'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-background-200 pt-6 sm:grid-cols-3 lg:grid-cols-6">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex flex-col gap-1">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                          <i className={`${spec.icon} text-base`}></i>
                        </span>
                        <span className="mt-1 text-xs uppercase tracking-wide text-foreground-500">
                          {spec.label}
                        </span>
                        <span className="text-sm font-semibold text-foreground-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {property.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-background-200 pt-6">
                      {property.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-900"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-card border border-background-200 bg-background-50 p-5 md:p-7">
                  <h2 className="font-heading text-xl font-semibold text-foreground-950">
                    Description
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
                    {property.description}
                  </p>
                </div>

                <div className="rounded-card border border-background-200 bg-background-50 p-5 md:p-7">
                  <h2 className="font-heading text-xl font-semibold text-foreground-950">
                    Features &amp; Amenities
                  </h2>
                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {property.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground-700">
                        <span className="flex h-5 w-5 items-center justify-center text-primary-600">
                          <i className="ri-checkbox-circle-fill text-base"></i>
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-card border border-background-200 bg-background-50 p-5 md:p-7">
                  <h2 className="font-heading text-xl font-semibold text-foreground-950">
                    Property Details
                  </h2>
                  <dl className="mt-4 divide-y divide-background-200">
                    {detailRows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-4 py-3">
                        <dt className="text-sm text-foreground-600">{row.label}</dt>
                        <dd className="text-sm font-semibold text-foreground-900">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-card border border-background-200 bg-background-50 p-5 md:p-7">
                  <h2 className="font-heading text-xl font-semibold text-foreground-950">
                    Location
                  </h2>
                  <p className="mt-2 text-sm text-foreground-600">
                    {property.subArea}, {property.location}, Gilgit-Baltistan
                  </p>
                  <div className="mt-4 h-72 overflow-hidden rounded-md border border-background-200">
                    <iframe
                      title={`Map of ${property.title}`}
                      src={mapSrc}
                      className="h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <EnquiryCard property={property} />

                <div className="mt-4 rounded-card border border-background-200 bg-background-50 p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground-950">
                    Prefer to browse?
                  </h3>
                  <p className="mt-1.5 text-sm text-foreground-600">
                    Head back to the full list of {isRent ? 'rentals' : 'properties for sale'}.
                  </p>
                  <Link
                    to={listPath}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
                  >
                    View all {isRent ? 'rentals' : 'properties'}
                    <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <SimilarProperties current={property} />
      </main>
      <Footer />
    </>
  );
}