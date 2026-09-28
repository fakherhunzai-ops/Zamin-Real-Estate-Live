import { useState } from 'react';
import type { StayImage } from '@/types/stays';

export default function StayGallery({ images, title }: { images: StayImage[]; title: string }) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);

  if (sorted.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-card border border-background-200 bg-background-100 text-background-400 md:h-96">
        <span className="flex h-14 w-14 items-center justify-center">
          <i className="ri-image-2-line text-5xl"></i>
        </span>
      </div>
    );
  }

  const current = sorted[Math.min(active, sorted.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-64 w-full overflow-hidden rounded-card border border-background-200 bg-background-100 md:h-[460px]">
        <img
          src={current.url}
          alt={current.alt || title}
          title={title}
          className="h-full w-full object-cover object-top"
        />
        {sorted.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-md bg-foreground-950/70 px-2.5 py-1 text-xs font-semibold text-background-50 backdrop-blur-sm">
            {Math.min(active, sorted.length - 1) + 1} / {sorted.length}
          </span>
        )}
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === active}
              className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-colors md:h-20 md:w-28 ${
                index === active ? 'border-primary-600' : 'border-transparent hover:border-background-300'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt || `${title} photo ${index + 1}`}
                className="h-full w-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}