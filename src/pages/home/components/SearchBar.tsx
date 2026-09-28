import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AREAS } from '@/utils/site';

type Band = { label: string; min?: number; max?: number };

const SALE_BANDS: Band[] = [
  { label: 'Any Price' },
  { label: 'Under 1 Crore', max: 10000000 },
  { label: '1 – 3 Crore', min: 10000000, max: 30000000 },
  { label: '3 – 5 Crore', min: 30000000, max: 50000000 },
  { label: 'Above 5 Crore', min: 50000000 },
];

const RENT_BANDS: Band[] = [
  { label: 'Any Price' },
  { label: 'Under PKR 70,000', max: 70000 },
  { label: 'PKR 70,000 – 120,000', min: 70000, max: 120000 },
  { label: 'Above PKR 120,000', min: 120000 },
];

const TYPES = ['All Types', 'House', 'Apartment', 'Land', 'Commercial'];
const BEDS = ['Any', '1+', '2+', '3+', '4+'];

export default function SearchBar() {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [location, setLocation] = useState('All Areas');
  const [type, setType] = useState('All Types');
  const [bandIndex, setBandIndex] = useState(0);
  const [beds, setBeds] = useState('Any');

  const bands = listingType === 'sale' ? SALE_BANDS : RENT_BANDS;

  const handleTypeChange = (value: 'sale' | 'rent') => {
    setListingType(value);
    setBandIndex(0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location !== 'All Areas') params.set('location', location);
    if (type !== 'All Types') params.set('type', type);
    const band = bands[bandIndex];
    if (band.min !== undefined) params.set('min', String(band.min));
    if (band.max !== undefined) params.set('max', String(band.max));
    if (beds !== 'Any') params.set('beds', beds.replace('+', ''));
    const query = params.toString();
    navigate(`/properties-for-${listingType}${query ? `?${query}` : ''}`);
  };

  const selectClass =
    'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 focus:outline-none focus:border-primary-500 cursor-pointer';
  const labelClass = 'text-xs font-semibold text-foreground-600 uppercase tracking-wide';

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 w-full max-w-5xl rounded-card bg-background-50 p-4 md:p-5 text-left"
    >
      <div className="inline-flex items-center gap-1 rounded-full bg-background-100 p-1 mb-4">
        {(['sale', 'rent'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleTypeChange(value)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              listingType === value
                ? 'bg-primary-800 text-background-50 dark:text-foreground-950'
                : 'text-foreground-600 hover:text-primary-700'
            }`}
          >
            {value === 'sale' ? 'Buy' : 'Rent'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="search-location">
            Location
          </label>
          <select
            id="search-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={selectClass}
          >
            <option>All Areas</option>
            {AREAS.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="search-type">
            Property Type
          </label>
          <select
            id="search-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClass}
          >
            {TYPES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="search-price">
            Price Range
          </label>
          <select
            id="search-price"
            value={bandIndex}
            onChange={(e) => setBandIndex(Number(e.target.value))}
            className={selectClass}
          >
            {bands.map((band, index) => (
              <option key={band.label} value={index}>
                {band.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="search-beds">
            Bedrooms
          </label>
          <select
            id="search-beds"
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className={selectClass}
          >
            {BEDS.map((bed) => (
              <option key={bed}>{bed}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary-800 text-background-50 px-4 py-2.5 text-sm font-semibold whitespace-nowrap hover:bg-primary-900 transition-colors cursor-pointer"
          >
            <i className="ri-search-line text-base"></i>
            Search
          </button>
        </div>
      </div>
    </form>
  );
}