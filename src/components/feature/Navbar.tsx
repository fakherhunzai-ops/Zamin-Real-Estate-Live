import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE } from '@/utils/site';
import ShortlistLink from '@/components/feature/ShortlistLink';

type Child = { label: string; to: string };
type NavItem = { label: string; to: string; children?: Child[] };

const NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Buy',
    to: '/properties-for-sale',
    children: [
      { label: 'Houses', to: '/properties-for-sale?type=House' },
      { label: 'Apartments', to: '/properties-for-sale?type=Apartment' },
      { label: 'Land / Plots', to: '/properties-for-sale?type=Land' },
      { label: 'Commercial', to: '/properties-for-sale?type=Commercial' },
    ],
  },
  {
    label: 'Rent',
    to: '/properties-for-rent',
    children: [
      { label: 'Houses', to: '/properties-for-rent?type=House' },
      { label: 'Apartments', to: '/properties-for-rent?type=Apartment' },
      { label: 'Commercial', to: '/properties-for-rent?type=Commercial' },
    ],
  },
  {
    label: 'Stay',
    to: '/stays',
    children: [
      { label: 'All Stays', to: '/stays' },
      { label: 'Hunza', to: '/stays/hunza' },
      { label: 'Gojal', to: '/stays/gojal' },
      { label: 'Skardu', to: '/stays/skardu' },
      { label: 'Naltar', to: '/stays/naltar' },
      { label: 'Ghizer', to: '/stays/ghizer' },
      { label: 'Become a Host', to: '/stays/host' },
      { label: 'Managed Hosting', to: '/stays/managed-hosting' },
    ],
  },
  { label: 'Sell', to: '/sell-your-property' },
  {
    label: 'Services',
    to: '/services',
    children: [
      { label: 'Buy Property', to: '/services#buying-assistance' },
      { label: 'Sell Property', to: '/services#property-sales' },
      { label: 'Rent Property', to: '/services#rental-services' },
      { label: 'Property Valuation', to: '/valuation' },
      { label: 'Investment Advisory', to: '/services#investment-advisory' },
    ],
  },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDrop, setMobileDrop] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setMobileDrop(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isActive = (item: NavItem) => {
    if (item.to === '/') return location.pathname === '/';
    const base = item.to.split('?')[0].split('#')[0];
    return location.pathname === base || location.pathname.startsWith(`${base}/`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-background-200 bg-background-50">
      <div className="mx-auto flex h-16 md:h-20 items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="flex shrink-0 items-center" aria-label={`${SITE.brand} home`}>
          <img
            src={SITE.logo}
            alt={`${SITE.brand} logo`}
            title={SITE.brand}
            className="h-11 w-auto object-contain md:h-14"
          />
        </Link>

        <nav className="hidden items-stretch self-stretch gap-0.5 xl:flex">
          {NAV.map((item) => {
            const active = isActive(item);
            const hasChildren = !!item.children?.length;
            return (
              <div
                key={item.label}
                className="group relative flex items-stretch"
              >
                <Link
                  to={item.to}
                  className={`flex items-center gap-1 self-center whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium tracking-wide transition-colors ${
                    active
                      ? 'text-primary-700'
                      : 'text-foreground-700 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                  aria-haspopup={hasChildren || undefined}
                >
                  {item.label}
                  {hasChildren && (
                    <span className="flex h-4 w-4 items-center justify-center">
                      <i className="ri-arrow-down-s-line text-base"></i>
                    </span>
                  )}
                </Link>

                {hasChildren && (
                  <div
                    className="invisible absolute left-0 top-full z-50 w-56 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100"
                  >
                    <div className="rounded-md border border-background-200 bg-background-50 py-2">
                      {item.children!.map((child) => (
                        <Link
                          key={child.label}
                          to={child.to}
                          className="block px-4 py-2 text-sm text-foreground-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={SITE.phoneHref}
            aria-label={`Call ${SITE.phoneDisplay}`}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-primary-200 bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary-800 transition-colors hover:bg-primary-100 lg:inline-flex"
          >
            <span className="flex h-4 w-4 items-center justify-center">
              <i className="ri-phone-line text-base"></i>
            </span>
            {SITE.phoneDisplay}
          </a>
          <ShortlistLink />
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-primary-700 text-background-50 transition-colors hover:bg-primary-800 sm:flex"
          >
            <i className="ri-whatsapp-fill text-lg"></i>
          </a>

          <Link
            to="/sell-your-property"
            className="hidden items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 md:inline-flex"
          >
            <i className="ri-add-line text-base"></i>
            List Your Property
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-foreground-900 xl:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <i className={`${menuOpen ? 'ri-close-line' : 'ri-menu-3-line'} text-2xl`}></i>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-background-200 bg-background-50 transition-[max-height] duration-300 xl:hidden ${
          menuOpen ? 'max-h-[80vh] overflow-y-auto' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {NAV.map((item) => {
            const hasChildren = !!item.children?.length;
            const expanded = mobileDrop === item.label;
            return (
              <div key={item.label} className="border-b border-background-100 last:border-0">
                <div className="flex items-center">
                  <Link
                    to={item.to}
                    className={`flex-1 px-2 py-3 text-sm font-medium ${
                      isActive(item) ? 'text-primary-700' : 'text-foreground-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => setMobileDrop(expanded ? null : item.label)}
                      aria-label={`Toggle ${item.label} submenu`}
                      aria-expanded={expanded}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100"
                    >
                      <i className={`${expanded ? 'ri-subtract-line' : 'ri-add-line'} text-lg`}></i>
                    </button>
                  )}
                </div>
                {hasChildren && expanded && (
                  <div className="pb-2 pl-3">
                    {item.children!.map((child) => (
                      <Link
                        key={child.label}
                        to={child.to}
                        className="block px-3 py-2 text-sm text-foreground-600 hover:text-primary-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Link
              to="/shortlist"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-background-200 px-4 py-3 text-sm font-semibold text-foreground-800 sm:col-span-2"
            >
              <i className="ri-heart-3-line text-base"></i>
              Saved Properties
            </Link>
            <Link
              to="/sell-your-property"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-800 px-4 py-3 text-sm font-semibold text-background-50"
            >
              <i className="ri-add-line text-base"></i>
              List Your Property
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-300 px-4 py-3 text-sm font-semibold text-primary-700"
            >
              <i className="ri-phone-line text-base"></i>
              Call Now
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}