import { Link } from 'react-router-dom';
import type { StayDestination } from '@/types/stays';

export default function DestinationCard({
  destination,
  stayCount,
}: {
  destination: StayDestination;
  stayCount?: number;
}) {
  return (
    <Link
      to={`/stays/${destination.slug}`}
      className="group relative block h-72 cursor-pointer overflow-hidden rounded-card border border-background-200"
    >
      {destination.hero_image ? (
        <img
          src={destination.hero_image}
          alt={`Stays in ${destination.name}, Gilgit-Baltistan`}
          title={`ZAMIN Stays in ${destination.name}`}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-primary-900"></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/30 to-transparent"></div>

      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="font-heading text-xl font-bold text-white">{destination.name}</h3>
            {destination.tagline && (
              <p className="mt-0.5 text-sm text-background-300">{destination.tagline}</p>
            )}
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background-50/15 text-background-50 backdrop-blur-sm transition-colors group-hover:bg-primary-700">
            <i className="ri-arrow-right-up-line text-lg"></i>
          </span>
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-300">
          <i className="ri-home-smile-line"></i>
          {stayCount && stayCount > 0
            ? `${stayCount} ${stayCount === 1 ? 'stay' : 'stays'} available`
            : 'Explore stays'}
        </p>
      </div>
    </Link>
  );
}