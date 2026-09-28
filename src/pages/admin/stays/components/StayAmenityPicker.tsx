import type { StayAmenity } from '@/types/stays';

type Props = {
  amenities: StayAmenity[];
  selected: string[];
  onToggle: (id: string) => void;
};

export default function StayAmenityPicker({ amenities, selected, onToggle }: Props) {
  const groups = amenities.reduce<Record<string, StayAmenity[]>>((acc, amenity) => {
    const key = amenity.category || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(amenity);
    return acc;
  }, {});

  if (amenities.length === 0) {
    return <p className="text-sm text-foreground-500">No amenities available.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group}>
          <p className="mb-2 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">
            {group}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((amenity) => {
              const active = selected.includes(amenity.id);
              return (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => onToggle(amenity.id)}
                  aria-pressed={active}
                  className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? 'border-primary-700 bg-primary-800 text-background-50'
                      : 'border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700'
                  }`}
                >
                  {amenity.icon && (
                    <span className="flex h-4 w-4 items-center justify-center">
                      <i className={`${amenity.icon} text-sm`}></i>
                    </span>
                  )}
                  {amenity.name}
                  {active && <i className="ri-check-line text-sm"></i>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}