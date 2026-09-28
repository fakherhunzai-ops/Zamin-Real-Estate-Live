import { SITE } from '@/utils/site';

/**
 * Branded header used at the top of a printable calculator summary so the
 * printed / saved PDF reads as an official Zamin document.
 */
export default function ReportHeader({ title }: { title: string }) {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-background-200 pb-4">
      <div>
        <p className="font-heading text-lg font-bold text-foreground-950">{SITE.brand}</p>
        <p className="mt-0.5 text-xs text-foreground-600">{SITE.address}</p>
        <p className="mt-0.5 text-xs text-foreground-600">
          {SITE.phoneDisplay} · {SITE.email}
        </p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-sm font-semibold text-foreground-900">{title}</p>
        <p className="mt-0.5 text-xs text-foreground-500">Generated {today}</p>
      </div>
    </div>
  );
}