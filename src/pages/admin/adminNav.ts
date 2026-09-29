export type AdminNavItem = { label: string; to: string; icon: string };

export type AdminNavGroup = {
  id: string;
  label: string | null;
  icon?: string;
  items: AdminNavItem[];
};

/** Sidebar structure for the ZAMIN central admin ecosystem. */
export const ADMIN_NAV: AdminNavGroup[] = [
  {
    id: 'main',
    label: null,
    items: [{ label: 'Dashboard', to: '/admin/dashboard', icon: 'ri-dashboard-3-line' }],
  },
  {
    id: 'estate',
    label: 'Real Estate',
    icon: 'ri-building-2-line',
    items: [
      { label: 'All Properties', to: '/admin/properties', icon: 'ri-home-office-line' },
      { label: 'Add Property', to: '/admin/properties', icon: 'ri-add-circle-line' },
      { label: 'Pending Listings', to: '/admin/properties/pending', icon: 'ri-time-line' },
      { label: 'Published', to: '/admin/properties/published', icon: 'ri-upload-cloud-2-line' },
      { label: 'Sold', to: '/admin/properties/sold', icon: 'ri-checkbox-circle-line' },
      { label: 'Rented', to: '/admin/properties/rented', icon: 'ri-key-2-line' },
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
    label: 'Website Content',
    icon: 'ri-layout-masonry-line',
    items: [
      { label: 'Homepage', to: '/admin/content/homepage', icon: 'ri-layout-top-line' },
      { label: 'Buy', to: '/admin/content/buy', icon: 'ri-home-gear-line' },
      { label: 'Rent', to: '/admin/content/rent', icon: 'ri-home-smile-line' },
      { label: 'Sell', to: '/admin/content/sell', icon: 'ri-money-dollar-circle-line' },
      { label: 'Stays Homepage', to: '/admin/content/stays-homepage', icon: 'ri-layout-2-line' },
      { label: 'About', to: '/admin/content/about', icon: 'ri-building-3-line' },
      { label: 'Services', to: '/admin/content/services', icon: 'ri-tools-fill' },
      { label: 'Contact', to: '/admin/content/contact', icon: 'ri-phone-line' },
      { label: 'FAQs', to: '/admin/content/faqs', icon: 'ri-question-answer-line' },
      { label: 'Locations', to: '/admin/content/locations', icon: 'ri-map-pin-2-line' },
      { label: 'Testimonials', to: '/admin/content/testimonials', icon: 'ri-chat-quote-line' },
      { label: 'Header', to: '/admin/content/header', icon: 'ri-header-line' },
      { label: 'Footer', to: '/admin/content/footer', icon: 'ri-article-line' },
      { label: 'CTAs', to: '/admin/content/ctas', icon: 'ri-links-line' },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    icon: 'ri-gallery-line',
    items: [{ label: 'Media Library', to: '/admin/media', icon: 'ri-gallery-line' }],
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'ri-user-3-line',
    items: [
      { label: 'Customers', to: '/admin/users/customers', icon: 'ri-user-line' },
      { label: 'Property Owners', to: '/admin/users/owners', icon: 'ri-home-2-line' },
      { label: 'Hosts', to: '/admin/users/hosts', icon: 'ri-user-heart-line' },
      { label: 'Agents', to: '/admin/users/agents', icon: 'ri-user-star-line' },
      { label: 'Admin Users', to: '/admin/users/admin', icon: 'ri-shield-user-line' },
    ],
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: 'ri-search-eye-line',
    items: [
      { label: 'Site SEO', to: '/admin/seo', icon: 'ri-search-eye-line' },
      { label: 'Page Metadata', to: '/admin/seo/page-metadata', icon: 'ri-file-text-line' },
      { label: 'Social Sharing', to: '/admin/seo/social', icon: 'ri-share-line' },
      { label: 'Redirects', to: '/admin/seo/redirects', icon: 'ri-route-line' },
      { label: 'Sitemap', to: '/admin/seo/sitemap', icon: 'ri-map-2-line' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'ri-settings-3-line',
    items: [
      { label: 'General', to: '/admin/settings/general', icon: 'ri-settings-2-line' },
      { label: 'Company', to: '/admin/settings/company', icon: 'ri-building-line' },
      { label: 'Branding', to: '/admin/settings/branding', icon: 'ri-palette-line' },
      { label: 'Contact', to: '/admin/settings/contact', icon: 'ri-phone-line' },
      { label: 'Social', to: '/admin/settings/social', icon: 'ri-share-box-line' },
      { label: 'Email', to: '/admin/settings/email', icon: 'ri-mail-open-line' },
      { label: 'Notifications', to: '/admin/settings/notifications', icon: 'ri-notification-3-line' },
      { label: 'Payments', to: '/admin/settings/payments', icon: 'ri-bank-card-line' },
      { label: 'Maps', to: '/admin/settings/maps', icon: 'ri-map-pin-line' },
      { label: 'Integrations', to: '/admin/settings/integrations', icon: 'ri-plug-line' },
    ],
  },
];

export const ADMIN_QUICK_ADD: AdminNavItem[] = [
  { label: 'Add Property', to: '/admin/properties', icon: 'ri-add-box-line' },
  { label: 'Add Stay', to: '/admin/stays/new', icon: 'ri-home-4-line' },
  { label: 'Add Agent', to: '/admin/agents', icon: 'ri-user-star-line' },
  { label: 'Add Location', to: '/admin/content/locations', icon: 'ri-map-pin-2-line' },
  { label: 'Quick Content', to: '/admin/content/homepage', icon: 'ri-layout-grid-line' },
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
  if (to === '/admin/dashboard') return pathname === '/admin/dashboard';
  if (to === '/admin/stays-dashboard') return pathname === '/admin/stays-dashboard';
  return pathname === to;
}