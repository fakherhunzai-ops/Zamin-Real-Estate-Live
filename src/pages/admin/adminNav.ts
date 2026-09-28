export type AdminNavItem = { label: string; to: string; icon: string };

export type AdminNavGroup = {
  id: string;
  label: string | null;
  icon?: string;
  items: AdminNavItem[];
};

/** Sidebar structure for the ZAMIN admin ecosystem (Real Estate + ZAMIN Stays). */
export const ADMIN_NAV: AdminNavGroup[] = [
  {
    id: 'main',
    label: null,
    items: [{ label: 'Dashboard', to: '/admin/stays-dashboard', icon: 'ri-dashboard-3-line' }],
  },
  {
    id: 'estate',
    label: 'Real Estate',
    icon: 'ri-building-2-line',
    items: [
      { label: 'Properties', to: '/admin/properties', icon: 'ri-home-office-line' },
      { label: 'Enquiries', to: '/admin/enquiries', icon: 'ri-mail-line' },
      { label: 'Valuations', to: '/admin/valuations', icon: 'ri-scales-3-line' },
      { label: 'Agents', to: '/admin/agents', icon: 'ri-user-star-line' },
    ],
  },
  {
    id: 'stays',
    label: 'ZAMIN Stays',
    icon: 'ri-hotel-line',
    items: [
      { label: 'Overview', to: '/admin/stays-dashboard', icon: 'ri-pie-chart-2-line' },
      { label: 'All Stays', to: '/admin/stays', icon: 'ri-home-4-line' },
      { label: 'Add Stay', to: '/admin/stays/new', icon: 'ri-add-circle-line' },
      { label: 'Pending Verification', to: '/admin/stays/pending', icon: 'ri-shield-star-line' },
      { label: 'Bookings', to: '/admin/bookings', icon: 'ri-calendar-check-line' },
      { label: 'Calendar', to: '/admin/calendar', icon: 'ri-calendar-2-line' },
      { label: 'Hosts', to: '/admin/hosts', icon: 'ri-user-heart-line' },
      { label: 'Guests', to: '/admin/guests', icon: 'ri-group-2-line' },
      { label: 'Pricing', to: '/admin/pricing', icon: 'ri-price-tag-3-line' },
      { label: 'Reviews', to: '/admin/reviews', icon: 'ri-star-line' },
      { label: 'Payments', to: '/admin/payments', icon: 'ri-bank-card-line' },
      { label: 'Payouts', to: '/admin/payouts', icon: 'ri-hand-coin-line' },
      { label: 'Analytics', to: '/admin/stays-analytics', icon: 'ri-line-chart-line' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: 'ri-tools-line',
    items: [
      { label: 'Cleaning', to: '/admin/operations/cleaning', icon: 'ri-brush-line' },
      { label: 'Maintenance', to: '/admin/operations/maintenance', icon: 'ri-hammer-line' },
    ],
  },
  {
    id: 'cms',
    label: 'CMS',
    icon: 'ri-layout-masonry-line',
    items: [
      { label: 'Stay Homepage', to: '/admin/content/stays-homepage', icon: 'ri-layout-top-line' },
      { label: 'Destinations', to: '/admin/content/destinations', icon: 'ri-map-pin-2-line' },
      { label: 'Stay Categories', to: '/admin/content/stay-categories', icon: 'ri-apps-2-line' },
      { label: 'FAQs', to: '/admin/content/faqs', icon: 'ri-question-answer-line' },
      { label: 'Policies', to: '/admin/content/policies', icon: 'ri-file-shield-2-line' },
    ],
  },
  {
    id: 'system',
    label: null,
    items: [
      { label: 'Users', to: '/admin/users', icon: 'ri-shield-user-line' },
      { label: 'Media Library', to: '/admin/media', icon: 'ri-gallery-line' },
      { label: 'Settings', to: '/admin/settings', icon: 'ri-settings-3-line' },
    ],
  },
];

export const ADMIN_QUICK_ADD: AdminNavItem[] = [
  { label: 'New stay', to: '/admin/stays/new', icon: 'ri-add-box-line' },
  { label: 'Bookings', to: '/admin/bookings', icon: 'ri-calendar-check-line' },
  { label: 'Destination', to: '/admin/content/destinations', icon: 'ri-map-pin-2-line' },
  { label: 'Pricing rules', to: '/admin/pricing', icon: 'ri-price-tag-3-line' },
];

/** True when `pathname` matches the nav item (handles nested admin routes). */
export function isNavActive(pathname: string, to: string): boolean {
  if (to === '/admin/stays') {
    return pathname === '/admin/stays' || pathname.startsWith('/admin/stays/')
      ? pathname !== '/admin/stays/new' && pathname !== '/admin/stays/pending'
      : false;
  }
  if (to === '/admin/stays/new') return pathname === '/admin/stays/new';
  if (to === '/admin/stays/pending') return pathname === '/admin/stays/pending';
  if (to === '/admin/bookings') return pathname === '/admin/bookings' || pathname.startsWith('/admin/bookings/');
  if (to === '/admin/stays-dashboard') return pathname === '/admin/stays-dashboard';
  return pathname === to;
}