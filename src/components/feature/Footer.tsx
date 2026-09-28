import { Link } from 'react-router-dom';
import { SITE } from '@/utils/site';

const propertyLinks = [
  { label: 'Buy Property', to: '/properties-for-sale' },
  { label: 'Rent Property', to: '/properties-for-rent' },
  { label: 'List Property', to: '/sell-your-property' },
  { label: 'Saved Properties', to: '/shortlist' },
  { label: 'Free Valuation', to: '/valuation' },
];

const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Blog & Resources', to: '/blog' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
];

const toolLinks = [
  { label: 'All Free Tools', to: '/tools' },
  { label: 'Mortgage Calculator', to: '/tools/mortgage-calculator' },
  { label: 'Rental Yield Calculator', to: '/tools/rental-yield-calculator' },
  { label: 'Transfer Cost Estimator', to: '/tools/stamp-duty-calculator' },
];

const staysLinks = [
  { label: 'ZAMIN Stays', to: '/stays' },
  { label: 'Hunza', to: '/stays/hunza' },
  { label: 'Gojal', to: '/stays/gojal' },
  { label: 'Skardu', to: '/stays/skardu' },
  { label: 'Naltar', to: '/stays/naltar' },
  { label: 'Ghizer', to: '/stays/ghizer' },
  { label: 'Become a Host', to: '/stays/host' },
  { label: 'Apply to Host', to: '/stays/host/apply' },
  { label: 'Managed Hosting', to: '/stays/managed-hosting' },
  { label: 'Host Login', to: '/host/login' },
  { label: 'View My Booking', to: '/booking' },
];

function Column({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-accent-300">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-background-300 transition-colors hover:text-background-50"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-background-200">
      <div className="mx-auto px-4 py-14 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center" aria-label={`${SITE.brand} home`}>
              <img
                src={SITE.logo}
                alt={`${SITE.brand} logo`}
                title={SITE.brand}
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-background-300">
              Gilgit-Baltistan&apos;s trusted real estate agency. Expert local knowledge across
              Hunza, Gilgit, Skardu, Nagar, Ghizer and Chilas — with transparent pricing and no
              hidden fees.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-900 text-background-200 transition-colors hover:bg-primary-700 hover:text-background-50"
              >
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-900 text-background-200 transition-colors hover:bg-primary-700 hover:text-background-50"
              >
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-900 text-background-200 transition-colors hover:bg-primary-700 hover:text-background-50"
              >
                <i className="ri-whatsapp-fill text-lg"></i>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Column title="Properties" links={propertyLinks} />
          </div>
          <div className="lg:col-span-2">
            <Column title="ZAMIN Stays" links={staysLinks} />
          </div>
          <div className="lg:col-span-2">
            <Column title="Company" links={companyLinks} />
          </div>
          <div className="lg:col-span-2">
            <Column title="Tools" links={toolLinks} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-primary-900 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-900 text-lg text-accent-400">
              <i className="ri-map-pin-2-line"></i>
            </span>
            <span className="text-sm text-background-300">{SITE.address}</span>
          </div>
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-3 text-sm text-background-300 transition-colors hover:text-background-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-900 text-lg text-accent-400">
              <i className="ri-phone-line"></i>
            </span>
            {SITE.phoneDisplay}
          </a>
          <a
            href={SITE.emailHref}
            className="flex items-center gap-3 text-sm text-background-300 transition-colors hover:text-background-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-900 text-lg text-accent-400">
              <i className="ri-mail-line"></i>
            </span>
            {SITE.email}
          </a>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-background-300 transition-colors hover:text-background-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-900 text-lg text-accent-400">
              <i className="ri-whatsapp-line"></i>
            </span>
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="border-t border-primary-900">
        <div className="mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row md:px-6">
          <p className="text-xs text-background-400">
            &copy; {new Date().getFullYear()} {SITE.brand}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/privacy"
              className="text-xs text-background-400 transition-colors hover:text-background-50"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-background-400 transition-colors hover:text-background-50"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}