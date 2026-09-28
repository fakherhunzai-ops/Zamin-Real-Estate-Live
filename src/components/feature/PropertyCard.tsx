import { Link } from 'react-router-dom';
import type { PropertyListing } from '@/mocks/properties';
import { formatPrice } from '@/utils/format';
import { useShortlist } from '@/hooks/useShortlist';

type Props = {
  property: PropertyListing;
  variant?: 'grid' | 'list';
};

export default function PropertyCard({ property, variant = 'grid' }: Props) {
  const { has, toggle } = useShortlist();
  const fav = has(property.id);
  const isRent = property.listingType === 'rent';
  const detailPath = `/property/${property.id}`;

  const badge = (
    <span
      className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
        isRent ? 'bg-primary-600 text-background-50' : 'bg-primary-800 text-background-50'
      }`}
    >
      {isRent ? 'For Rent' : 'For Sale'}
    </span>
  );

  const favButton = (
    <button
      type="button"
      onClick={() => toggle(property.id)}
      aria-label={fav ? 'Remove from favourites' : 'Save to favourites'}
      aria-pressed={fav}
      className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-background-50/90 backdrop-blur-sm text-foreground-700 hover:text-accent-600 transition-colors cursor-pointer"
    >
      <i className={`${fav ? 'ri-heart-fill text-accent-500' : 'ri-heart-line'} text-lg`}></i>
    </button>
  );

  const specRow = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-600">
      {property.bedrooms > 0 && (
        <span className="flex items-center gap-1.5">
          <i className="ri-hotel-bed-line text-base text-accent-600"></i>
          {property.bedrooms} Beds
        </span>
      )}
      {property.bathrooms > 0 && (
        <span className="flex items-center gap-1.5">
          <i className="ri-water-flash-line text-base text-accent-600"></i>
          {property.bathrooms} Baths
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <i className="ri-layout-2-line text-base text-accent-600"></i>
        {property.area} {property.areaUnit}
      </span>
    </div>
  );

  if (variant === 'list') {
    return (
      <article
        data-product-shop
        className="group flex flex-col sm:flex-row overflow-hidden rounded-card border border-background-200 bg-background-50 hover:border-primary-300 transition-colors duration-300"
      >
        <div className="relative sm:w-72 md:w-80 h-52 sm:h-auto shrink-0 overflow-hidden">
          <img
            src={property.image}
            alt={`${property.title} in ${property.subArea}, ${property.location}`}
            title={`${property.title} — property in ${property.location}`}
            className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {badge}
            <span className="rounded-md bg-background-50/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-foreground-800">
              {property.type}
            </span>
          </div>
          {favButton}
        </div>

        <div className="flex flex-1 flex-col p-4 md:p-6 gap-3">
          <div>
            <h3 className="font-heading text-lg md:text-xl font-semibold text-foreground-950 leading-snug">
              <Link to={detailPath} className="hover:text-primary-700 transition-colors">
                {property.title}
              </Link>
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground-600">
              <span className="w-4 h-4 flex items-center justify-center text-accent-600">
                <i className="ri-map-pin-2-line text-sm"></i>
              </span>
              {property.subArea}, {property.location}, Gilgit-Baltistan
            </p>
          </div>
          <p className="text-sm text-foreground-600 leading-relaxed line-clamp-2">
            {property.description}
          </p>
          {specRow}
          <div className="mt-auto pt-3 border-t border-background-200 flex items-center justify-between gap-3">
            <span className="font-heading text-lg font-bold text-primary-700">
              {formatPrice(property.price, property.listingType)}
            </span>
            <Link
              to={detailPath}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-800 text-background-50 px-4 py-2 text-sm font-semibold whitespace-nowrap hover:bg-primary-900 transition-colors dark:text-foreground-950"
            >
              View Property
              <i className="ri-arrow-right-line text-sm"></i>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      data-product-shop
      className="group flex flex-col overflow-hidden rounded-card border border-background-200 bg-background-50 hover:-translate-y-1 hover:border-primary-300 transition-all duration-300"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={property.image}
          alt={`${property.title} in ${property.subArea}, ${property.location}`}
          title={`${property.title} — property in ${property.location}`}
          className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {badge}
          <span className="rounded-md bg-background-50/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-foreground-800">
            {property.type}
          </span>
        </div>
        {favButton}
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5 gap-3">
        <h3 className="font-heading font-semibold text-base md:text-lg text-foreground-950 leading-snug">
          <Link to={detailPath} className="hover:text-primary-700 transition-colors">
            {property.title}
          </Link>
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-foreground-600">
          <span className="w-4 h-4 flex items-center justify-center text-accent-600">
            <i className="ri-map-pin-2-line text-sm"></i>
          </span>
          {property.subArea}, {property.location}
        </p>

        {specRow}

        <div className="mt-auto pt-3 border-t border-background-200 flex items-center justify-between gap-3">
          <span className="font-heading text-lg font-bold text-primary-700">
            {formatPrice(property.price, property.listingType)}
          </span>
          <Link
            to={detailPath}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary-800 text-background-50 px-3.5 py-2 text-sm font-semibold whitespace-nowrap hover:bg-primary-900 transition-colors dark:text-foreground-950"
          >
            View Details
            <i className="ri-arrow-right-line text-sm"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}