import type { StayAmenity } from '@/types/stays';

export default function StayAmenityList({ amenities }: { amenities: StayAmenity[] }) {
  if (amenities.length === 0) {
    return (
      <p className="text-sm text-foreground-600">
        Amenity details for this stay are being confirmed. Ask us before booking.
      </p>
    );
  }

  const groups = amenities.reduce<Record<string, StayAmenity[]>>((acc, amenity) => {
    const key = amenity.category || 'General';
    acc[key] = acc[key] ? [...acc[key], amenity] : [amenity];
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group}>
          <h3 className="font-label text-xs font-bold uppercase tracking-[0.16em] text-foreground-500">
            {group}
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((amenity) => (
              <div key={amenity.id} className="flex items-center gap-3 text-sm text-foreground-800">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary-100 text-secondary-900">
                  <i className={`${amenity.icon ?? 'ri-checkbox-circle-line'} text-lg`}></i>
                </span>
                {amenity.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}