import type { Stay, StayStatus, ManagementType, BookingStatus } from '@/types/stays';

const PKR_FORMATTER = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

/** "PKR 15,000" — full exact amount. */
export function formatPKR(value: number, currency = 'PKR'): string {
  if (!Number.isFinite(value) || value < 0) return `${currency} 0`;
  return `${currency} ${PKR_FORMATTER.format(Math.round(value))}`;
}

/** "PKR 15,000 / night" */
export function formatNightly(value: number, currency = 'PKR'): string {
  return `${formatPKR(value, currency)} / night`;
}

/** URL-safe slug from a title. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** The cover image URL for a stay (falls back to the first image, else null). */
export function coverImage(stay: Stay): string | null {
  const images = stay.images ?? [];
  if (images.length === 0) return null;
  const cover = images.find((image) => image.is_cover);
  if (cover) return cover.url;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  return sorted[0]?.url ?? null;
}

/** Amenities resolved from the join rows, de-duplicated and ordered. */
export function stayAmenities(stay: Stay) {
  const rows = stay.amenity_links ?? [];
  return rows
    .map((row) => row.amenity)
    .filter((amenity): amenity is NonNullable<typeof amenity> => Boolean(amenity))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export type StayEstimate = {
  nights: number;
  nightly: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
};

/**
 * Client-side *estimate* for display in the booking card.
 * The authoritative amount is always recalculated on the backend when a real
 * booking is created — this is only a preview.
 */
export function estimateStay(
  stay: Pick<Stay, 'base_nightly_rate' | 'cleaning_fee' | 'service_fee_percent'>,
  nights: number,
): StayEstimate {
  const safeNights = Math.max(0, Math.floor(nights));
  const nightly = stay.base_nightly_rate || 0;
  const subtotal = nightly * safeNights;
  const cleaningFee = stay.cleaning_fee || 0;
  const serviceFee = Math.round((subtotal * (stay.service_fee_percent || 0)) / 100);
  return {
    nights: safeNights,
    nightly,
    subtotal,
    cleaningFee,
    serviceFee,
    total: subtotal + cleaningFee + serviceFee,
  };
}

export const STATUS_META: Record<StayStatus, { label: string; className: string; icon: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-background-200 text-foreground-800', icon: 'ri-draft-line' },
  PENDING: { label: 'Pending Review', className: 'bg-secondary-100 text-secondary-900', icon: 'ri-time-line' },
  VERIFIED: { label: 'Verified', className: 'bg-accent-100 text-accent-900', icon: 'ri-shield-check-line' },
  PUBLISHED: { label: 'Published', className: 'bg-primary-100 text-primary-800', icon: 'ri-checkbox-circle-line' },
  PAUSED: { label: 'Paused', className: 'bg-background-200 text-foreground-700', icon: 'ri-pause-circle-line' },
  ARCHIVED: { label: 'Archived', className: 'bg-background-200 text-foreground-600', icon: 'ri-archive-line' },
};

export const MANAGEMENT_META: Record<ManagementType, { label: string; description: string }> = {
  LISTED: { label: 'ZAMIN Listed', description: 'Owner-operated, listed on ZAMIN' },
  MANAGED: { label: 'ZAMIN Managed', description: 'Fully managed short-term operation by ZAMIN' },
};

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; className: string; icon: string }
> = {
  PENDING: { label: 'Pending', className: 'bg-secondary-100 text-secondary-900', icon: 'ri-time-line' },
  AWAITING_PAYMENT: { label: 'Awaiting payment', className: 'bg-accent-100 text-accent-900', icon: 'ri-bank-card-line' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-primary-100 text-primary-800', icon: 'ri-checkbox-circle-line' },
  CANCELLED: { label: 'Cancelled', className: 'bg-background-200 text-foreground-600', icon: 'ri-close-circle-line' },
  CHECKED_IN: { label: 'Checked in', className: 'bg-primary-100 text-primary-800', icon: 'ri-login-circle-line' },
  CHECKED_OUT: { label: 'Checked out', className: 'bg-background-200 text-foreground-700', icon: 'ri-logout-circle-line' },
  REFUNDED: { label: 'Refunded', className: 'bg-background-200 text-foreground-600', icon: 'ri-refund-2-line' },
};

/** Tonight + a default 2-night stay window, in yyyy-mm-dd for date inputs. */
export function defaultStayDates() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  return { checkIn: iso(start), checkOut: iso(end) };
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = end.getTime() - start.getTime();
  if (!Number.isFinite(diff) || diff <= 0) return 0;
  return Math.round(diff / (1000 * 60 * 60 * 24));
}