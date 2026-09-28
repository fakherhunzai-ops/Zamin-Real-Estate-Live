import { useEffect, useState } from 'react';

type Props = { images: string[]; title: string; location: string };

export default function Gallery({ images, title, location }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = images.length;

  const go = (index: number) => setActive((index + total) % total);
  const prev = () => go(active - 1);
  const next = () => go(active + 1);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(false);
      if (event.key === 'ArrowLeft') go(active - 1);
      if (event.key === 'ArrowRight') go(active + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, active]);

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative h-64 overflow-hidden rounded-card border border-background-200 md:h-[480px]">
        <img
          src={images[active]}
          alt={`${title} — photo ${active + 1}`}
          title={`${title} in ${location}`}
          className="h-full w-full object-cover object-top"
        />
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-md bg-background-50/90 px-3.5 py-2 text-sm font-semibold text-foreground-900 backdrop-blur-sm transition-colors hover:bg-background-50"
        >
          <i className="ri-fullscreen-line text-base"></i>
          View All Photos ({total})
        </button>
      </div>

      {total > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View photo ${index + 1}`}
              className={`h-16 overflow-hidden rounded-md border-2 transition-colors md:h-24 ${
                active === index ? 'border-primary-600' : 'border-transparent hover:border-primary-300'
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="h-full w-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground-950/90 p-4">
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close gallery"
            className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-background-50/10 text-background-50 transition-colors hover:bg-background-50/20"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-background-50/10 text-background-50 transition-colors hover:bg-background-50/20 md:left-6"
          >
            <i className="ri-arrow-left-line text-2xl"></i>
          </button>

          <img
            src={images[active]}
            alt={`${title} — photo ${active + 1}`}
            className="max-h-[80vh] w-auto max-w-5xl rounded-card object-contain"
          />

          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-background-50/10 text-background-50 transition-colors hover:bg-background-50/20 md:right-6"
          >
            <i className="ri-arrow-right-line text-2xl"></i>
          </button>

          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-background-200">
            {active + 1} / {total}
          </p>
        </div>
      )}
    </div>
  );
}