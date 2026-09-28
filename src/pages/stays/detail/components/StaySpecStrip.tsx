import type { Stay } from '@/types/stays';

export default function StaySpecStrip({ stay }: { stay: Stay }) {
  const specs = [
    { icon: 'ri-group-line', label: `${stay.guest_capacity} guests` },
    { icon: 'ri-hotel-bed-line', label: `${stay.bedrooms} bedrooms` },
    { icon: 'ri-hotel-line', label: `${stay.beds} beds` },
    { icon: 'ri-water-flash-line', label: `${stay.bathrooms} baths` },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {specs.map((spec) => (
        <span
          key={spec.label}
          className="inline-flex items-center gap-2 rounded-md border border-background-200 bg-background-50 px-3.5 py-2 text-sm font-medium text-foreground-800"
        >
          <span className="flex h-4 w-4 items-center justify-center text-accent-600">
            <i className={`${spec.icon} text-base`}></i>
          </span>
          {spec.label}
        </span>
      ))}
    </div>
  );
}