import { Link } from 'react-router-dom';
import type { Stay } from '@/types/stays';
import { coverImage, formatNightly } from '@/utils/stays';

export default function StayCard({ stay }: { stay: Stay }) {
  const image = coverImage(stay);
  const location = [stay.area?.name, stay.destination?.name].filter(Boolean).join(', ');

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-background-200 bg-background-50 transition-all duration-300 hover:-translate-y-1 hover:border-primary-300">
      <div className="relative h-56 w-full overflow-hidden bg-background-100">
        {image ? (
          <img
            src={image}
            alt={stay.title}
            title={`${stay.title} — ${location || 'Gilgit-Baltistan'}`}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-background-400">
            <span className="flex h-12 w-12 items-center justify-center">
              <i className="ri-home-4-line text-4xl"></i>
            </span>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {stay.verified && (
            <span className="inline-flex items-center gap-1 rounded-md bg-background-50/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-800 backdrop-blur-sm">
              <i className="ri-shield-check-fill text-accent-600"></i>
              Verified
            </span>
          )}
          {stay.management_type === 'MANAGED' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary-800/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-background-50 backdrop-blur-sm">
              <i className="ri-vip-diamond-line"></i>
              Managed
            </span>
          )}
        </div>

        {stay.category?.name && (
          <span className="absolute bottom-3 left-3 rounded-md bg-foreground-950/70 px-2.5 py-1 text-[11px] font-semibold text-background-50 backdrop-blur-sm">
            {stay.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <h3 className="font-heading text-base font-semibold leading-snug text-foreground-950 md:text-lg">
          <Link to={`/stays/${stay.slug}`} className="transition-colors hover:text-primary-700">
            {stay.title}
          </Link>
        </h3>

        {location && (
          <p className="flex items-center gap-1.5 text-sm text-foreground-600">
            <span className="flex h-4 w-4 items-center justify-center text-accent-600">
              <i className="ri-map-pin-2-line text-sm"></i>
            </span>
            {location}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-600">
          <span className="flex items-center gap-1.5">
            <i className="ri-group-line text-base text-accent-600"></i>
            {stay.guest_capacity} guests
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-hotel-bed-line text-base text-accent-600"></i>
            {stay.bedrooms} beds
          </span>
          <span className="flex items-center gap-1.5">
            <i className="ri-water-flash-line text-base text-accent-600"></i>
            {stay.bathrooms} baths
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-background-200 pt-3">
          <span className="font-heading text-base font-bold text-primary-700 md:text-lg">
            {formatNightly(stay.base_nightly_rate, stay.currency)}
          </span>
          <Link
            to={`/stays/${stay.slug}`}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-primary-800 px-3.5 py-2 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
          >
            View Stay
            <i className="ri-arrow-right-line text-sm"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}