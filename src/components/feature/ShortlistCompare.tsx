import type { PropertyListing } from '@/mocks/properties';
import { formatPKR, formatPrice, formatSqFt, toSquareFeet } from '@/utils/format';

type Props = {
  properties: PropertyListing[];
};

type Row = {
  label: string;
  values: string[];
};

/**
 * Side-by-side comparison of the visitor's shortlisted properties: beds, baths,
 * area, price per sq ft and more, so two or more homes can be weighed up at a
 * glance before enquiring.
 */
export default function ShortlistCompare({ properties }: Props) {
  if (properties.length < 2) return null;

  const sqft = properties.map((property) => toSquareFeet(property.area, property.areaUnit));
  const pricePerSqft = properties.map((property, index) =>
    sqft[index] > 0 ? property.price / sqft[index] : 0,
  );

  const bestIndex = pricePerSqft.reduce(
    (best, value, index) => (value > 0 && (best === -1 || value < pricePerSqft[best]) ? index : best),
    -1,
  );

  const rows: Row[] = [
    { label: 'Price', values: properties.map((p) => formatPrice(p.price, p.listingType)) },
    { label: 'Type', values: properties.map((p) => p.type) },
    {
      label: 'Location',
      values: properties.map((p) => `${p.subArea}, ${p.location}`),
    },
    {
      label: 'Bedrooms',
      values: properties.map((p) => (p.bedrooms > 0 ? `${p.bedrooms}` : '—')),
    },
    {
      label: 'Bathrooms',
      values: properties.map((p) => (p.bathrooms > 0 ? `${p.bathrooms}` : '—')),
    },
    {
      label: 'Area',
      values: properties.map((p, index) =>
        `${p.area} ${p.areaUnit} (${formatSqFt(sqft[index])})`,
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-card border border-background-200 bg-background-50">
      <div className="flex flex-wrap items-center gap-3 border-b border-background-200 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-100 text-accent-700">
          <i className="ri-bar-chart-grouped-line text-lg"></i>
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground-950">
            Compare your shortlist
          </h2>
          <p className="text-sm text-foreground-600">
            Beds, baths, area and price per sq ft, side by side.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/60 text-left">
              <th className="sticky left-0 z-10 bg-background-100/60 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-foreground-500">
                Property
              </th>
              {properties.map((property, index) => (
                <th key={property.id} className="min-w-[180px] px-4 py-4 align-top">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-foreground-950">
                      {index + 1}. {property.title}
                    </span>
                    {index === bestIndex && (
                      <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-800">
                        <i className="ri-medal-line text-xs"></i>
                        Best value
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-background-100 last:border-0">
                <th className="sticky left-0 z-10 bg-background-50 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-foreground-500">
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={properties[index].id}
                    className="px-4 py-3.5 font-semibold text-foreground-900"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}

            <tr className="bg-background-100/40">
              <th className="sticky left-0 z-10 bg-background-100/40 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-foreground-500">
                Price / sq ft
              </th>
              {pricePerSqft.map((value, index) => (
                <td
                  key={properties[index].id}
                  className={`px-4 py-3.5 font-bold tabular-nums ${
                    index === bestIndex ? 'text-accent-700' : 'text-foreground-900'
                  }`}
                >
                  {value > 0 ? formatPKR(value) : '—'}
                  {properties[index].listingType === 'rent' && value > 0 && (
                    <span className="ml-1 text-xs font-medium text-foreground-500">/ mo</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="flex items-start gap-2 border-t border-background-200 px-5 py-4 text-xs leading-relaxed text-foreground-500">
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
          <i className="ri-information-line text-sm"></i>
        </span>
        Areas converted at 1 Marla = 225 sq ft and 1 Kanal = 4,500 sq ft. Price per sq ft is
        indicative and shown per month for rentals.
      </p>
    </div>
  );
}