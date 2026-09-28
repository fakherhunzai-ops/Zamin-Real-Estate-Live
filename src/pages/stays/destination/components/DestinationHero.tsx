import { Link } from 'react-router-dom';
import type { StayDestination } from '@/types/stays';

type Props = {
  destination: StayDestination;
  areaCount: number;
  stayCount: number;
};

export default function DestinationHero({ destination, areaCount, stayCount }: Props) {
  return (
    <section className="relative flex min-h-[480px] items-end overflow-hidden md:min-h-[560px]">
      <div className="absolute inset-0">
        {destination.hero_image ? (
          <img
            src={destination.hero_image}
            alt={`Stays in ${destination.name}, Gilgit-Baltistan`}
            title={`ZAMIN Stays in ${destination.name}`}
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <div className="h-full w-full bg-primary-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/55 to-primary-950/35"></div>
      </div>

      <div className="relative z-10 w-full px-4 pb-10 pt-28 md:px-6 md:pb-14 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-background-300 md:text-sm">
              <li>
                <Link to="/" className="transition-colors hover:text-background-50">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <i className="ri-arrow-right-s-line"></i>
                <Link to="/stays" className="transition-colors hover:text-background-50">
                  ZAMIN Stays
                </Link>
              </li>
              <li className="flex items-center gap-2 text-background-50">
                <i className="ri-arrow-right-s-line"></i>
                {destination.name}
              </li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-3.5 py-1.5 text-xs font-semibold text-background-50 backdrop-blur-sm">
            <i className="ri-map-pin-2-line text-accent-400"></i>
            {destination.region ?? 'Gilgit-Baltistan'}
          </span>

          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Stays in {destination.name}
          </h1>

          {destination.tagline && (
            <p className="mt-3 text-base font-medium text-accent-300 md:text-lg">
              {destination.tagline}
            </p>
          )}

          {destination.description && (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-background-200 md:text-base">
              {destination.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-md bg-background-50/12 px-3.5 py-2 text-sm font-semibold text-background-50 backdrop-blur-sm">
              <i className="ri-home-smile-line text-accent-300"></i>
              {stayCount} {stayCount === 1 ? 'stay' : 'stays'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-md bg-background-50/12 px-3.5 py-2 text-sm font-semibold text-background-50 backdrop-blur-sm">
              <i className="ri-map-2-line text-accent-300"></i>
              {areaCount} {areaCount === 1 ? 'area' : 'areas'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}