import type { PropertyListing } from '@/mocks/properties';
import { AREAS } from '@/utils/site';

export type PropertyFiltersValue = {
  location: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  minArea: string;
};

export const EMPTY_FILTERS: PropertyFiltersValue = {
  location: 'All Areas',
  type: 'All Types',
  minPrice: '',
  maxPrice: '',
  beds: 'Any',
  baths: 'Any',
  minArea: '',
};

/** True when the visitor has narrowed the catalogue at all. */
export function isFiltersActive(filters: PropertyFiltersValue): boolean {
  return (
    filters.location !== EMPTY_FILTERS.location ||
    filters.type !== EMPTY_FILTERS.type ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.beds !== EMPTY_FILTERS.beds ||
    filters.baths !== EMPTY_FILTERS.baths ||
    filters.minArea !== ''
  );
}

/** Human-readable summary of the active filters, e.g. "House · in Gilgit · 3+ beds". */
export function describeFilters(filters: PropertyFiltersValue): string {
  const parts: string[] = [];
  if (filters.type !== 'All Types') parts.push(filters.type);
  if (filters.location !== 'All Areas') parts.push(`in ${filters.location}`);
  if (filters.beds !== 'Any') parts.push(`${filters.beds}+ beds`);
  if (filters.baths !== 'Any') parts.push(`${filters.baths}+ baths`);
  if (filters.minArea) parts.push(`${filters.minArea}+ Marla`);
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? `PKR ${Number(filters.minPrice).toLocaleString('en-PK')}` : 'any';
    const max = filters.maxPrice ? `PKR ${Number(filters.maxPrice).toLocaleString('en-PK')}` : 'any';
    parts.push(`${min} – ${max}`);
  }
  return parts.length > 0 ? parts.join(' · ') : 'All properties';
}

const TYPES = ['All Types', 'House', 'Apartment', 'Land', 'Commercial'];
const BEDS = ['Any', '1', '2', '3', '4', '5'];
const BATHS = ['Any', '1', '2', '3', '4'];

export function filtersFromParams(params: URLSearchParams): PropertyFiltersValue {
  return {
    location: params.get('location') || EMPTY_FILTERS.location,
    type: params.get('type') || EMPTY_FILTERS.type,
    minPrice: params.get('min') || '',
    maxPrice: params.get('max') || '',
    beds: params.get('beds') || EMPTY_FILTERS.beds,
    baths: params.get('baths') || EMPTY_FILTERS.baths,
    minArea: params.get('area') || '',
  };
}

export function filterProperties(
  list: PropertyListing[],
  filters: PropertyFiltersValue,
): PropertyListing[] {
  const min = Number(filters.minPrice);
  const max = Number(filters.maxPrice);
  const beds = parseInt(filters.beds, 10);
  const baths = parseInt(filters.baths, 10);
  const area = Number(filters.minArea);

  return list.filter((property) => {
    if (filters.location !== 'All Areas' && property.location !== filters.location) return false;
    if (filters.type !== 'All Types' && property.type !== filters.type) return false;
    if (filters.minPrice && Number.isFinite(min) && property.price < min) return false;
    if (filters.maxPrice && Number.isFinite(max) && property.price > max) return false;
    if (filters.beds !== 'Any' && Number.isFinite(beds) && property.bedrooms < beds) return false;
    if (filters.baths !== 'Any' && Number.isFinite(baths) && property.bathrooms < baths) return false;
    if (filters.minArea && Number.isFinite(area) && property.area < area) return false;
    return true;
  });
}

type Props = {
  value: PropertyFiltersValue;
  onChange: (next: PropertyFiltersValue) => void;
  onReset: () => void;
  resultCount: number;
  listingType: 'sale' | 'rent';
  onApply?: () => void;
};

export default function PropertyFilters({
  value,
  onChange,
  onReset,
  resultCount,
  listingType,
  onApply,
}: Props) {
  const set = (key: keyof PropertyFiltersValue, next: string) =>
    onChange({ ...value, [key]: next });

  const labelClass = 'text-xs font-semibold uppercase tracking-wide text-foreground-600';
  const controlClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';

  const priceUnit = listingType === 'rent' ? 'PKR / month' : 'PKR';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-foreground-950">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer text-sm font-medium text-primary-700 transition-colors hover:text-primary-800"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="filter-location">
          Location
        </label>
        <select
          id="filter-location"
          value={value.location}
          onChange={(event) => set('location', event.target.value)}
          className={`${controlClass} cursor-pointer`}
        >
          <option>All Areas</option>
          {AREAS.map((area) => (
            <option key={area}>{area}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="filter-type">
          Property Type
        </label>
        <select
          id="filter-type"
          value={value.type}
          onChange={(event) => set('type', event.target.value)}
          className={`${controlClass} cursor-pointer`}
        >
          {TYPES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Price Range ({priceUnit})</span>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            aria-label="Minimum price"
            placeholder="Min"
            value={value.minPrice}
            onChange={(event) => set('minPrice', event.target.value)}
            className={controlClass}
          />
          <input
            type="number"
            min="0"
            inputMode="numeric"
            aria-label="Maximum price"
            placeholder="Max"
            value={value.maxPrice}
            onChange={(event) => set('maxPrice', event.target.value)}
            className={controlClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="filter-beds">
            Bedrooms
          </label>
          <select
            id="filter-beds"
            value={value.beds}
            onChange={(event) => set('beds', event.target.value)}
            className={`${controlClass} cursor-pointer`}
          >
            {BEDS.map((item) => (
              <option key={item} value={item}>
                {item === 'Any' ? 'Any' : `${item}+`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="filter-baths">
            Bathrooms
          </label>
          <select
            id="filter-baths"
            value={value.baths}
            onChange={(event) => set('baths', event.target.value)}
            className={`${controlClass} cursor-pointer`}
          >
            {BATHS.map((item) => (
              <option key={item} value={item}>
                {item === 'Any' ? 'Any' : `${item}+`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="filter-area">
          Minimum Area (Marla)
        </label>
        <input
          id="filter-area"
          type="number"
          min="0"
          inputMode="numeric"
          placeholder="e.g. 5"
          value={value.minArea}
          onChange={(event) => set('minArea', event.target.value)}
          className={controlClass}
        />
      </div>

      {onApply && (
        <button
          type="button"
          onClick={onApply}
          className="mt-1 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-800 px-4 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
        >
          <i className="ri-search-line text-base"></i>
          Show {resultCount} {resultCount === 1 ? 'Property' : 'Properties'}
        </button>
      )}
    </div>
  );
}