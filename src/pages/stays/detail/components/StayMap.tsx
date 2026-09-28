import type { Stay } from '@/types/stays';

export default function StayMap({ stay }: { stay: Stay }) {
  const location = [stay.area?.name, stay.destination?.name].filter(Boolean).join(', ');
  const query =
    stay.latitude != null && stay.longitude != null
      ? `${stay.latitude},${stay.longitude}`
      : `${stay.address || location || stay.title}, Gilgit-Baltistan, Pakistan`;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground-950 md:text-2xl">
        Where you&apos;ll be
      </h2>
      <p className="mt-1 text-sm text-foreground-600">
        {stay.address || location || 'Gilgit-Baltistan, Pakistan'}
      </p>
      <div className="mt-4 h-72 w-full overflow-hidden rounded-card border border-background-200 bg-background-100 md:h-96">
        <iframe
          title={`Map of ${stay.title}`}
          src={src}
          className="h-full w-full border-0"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}