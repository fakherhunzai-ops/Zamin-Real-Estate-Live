export function formatPrice(price: number, listingType?: 'sale' | 'rent'): string {
  if (listingType === 'rent') {
    return `PKR ${price.toLocaleString('en-PK')} / month`;
  }
  if (price >= 10000000) {
    const crore = price / 10000000;
    return `PKR ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2)} Crore`;
  }
  if (price >= 100000) {
    const lakh = price / 100000;
    return `PKR ${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`;
  }
  return `PKR ${price.toLocaleString('en-PK')}`;
}

const PKR_FORMATTER = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

/** Full, exact PKR amount, e.g. "PKR 25,000,000". */
export function formatPKR(value: number): string {
  if (!Number.isFinite(value)) return 'PKR 0';
  return `PKR ${PKR_FORMATTER.format(Math.round(value))}`;
}

const SQFT_PER_MARLA = 225;
const SQFT_PER_KANAL = 4500;

/** Convert a property's area to square feet (1 Marla = 225 sq ft, 1 Kanal = 4,500 sq ft). */
export function toSquareFeet(area: number, unit: 'Marla' | 'Kanal'): number {
  if (!Number.isFinite(area) || area <= 0) return 0;
  return Math.round(area * (unit === 'Kanal' ? SQFT_PER_KANAL : SQFT_PER_MARLA));
}

/** Compact sq-ft figure, e.g. "2,700 sq ft". */
export function formatSqFt(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '—';
  return `${PKR_FORMATTER.format(Math.round(value))} sq ft`;
}