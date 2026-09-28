import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import SectionHeading from '@/components/base/SectionHeading';
import StaysFinalCTA from '@/pages/stays/components/StaysFinalCTA';
import { SITE } from '@/utils/site';

const SERVICES = [
  { icon: 'ri-search-eye-line', title: 'Property assessment', text: 'We visit, measure and assess your property and its earning potential honestly.' },
  { icon: 'ri-camera-3-line', title: 'Professional photography', text: 'Clean, bright photos that show your stay at its best on every device.' },
  { icon: 'ri-file-list-3-line', title: 'Listing optimisation', text: 'Accurate descriptions, categories and amenities that match what travellers search for.' },
  { icon: 'ri-price-tag-3-line', title: 'Pricing strategy', text: 'Seasonal and demand-aware nightly pricing set together with you.' },
  { icon: 'ri-customer-service-2-line', title: 'Guest support', text: 'We answer guests, handle check-in, directions and any issue during the stay.' },
  { icon: 'ri-brush-line', title: 'Cleaning & maintenance', text: 'Coordinated housekeeping and upkeep between every set of guests.' },
  { icon: 'ri-calendar-check-line', title: 'Booking management', text: 'Calendar, availability and reservations handled end to end.' },
  { icon: 'ri-line-chart-line', title: 'Owner reporting', text: 'Clear monthly reporting on bookings, revenue and occupancy.' },
];

export default function ManagedHostingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-50">
        <section className="relative flex min-h-[440px] items-end overflow-hidden md:min-h-[520px]">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Elegantly%20styled%20modern%20mountain%20villa%20interior%20prepared%20for%20guests%20in%20Gilgit-Baltistan%20Pakistan%2C%20fresh%20white%20linens%2C%20warm%20wooden%20furniture%2C%20large%20windows%20with%20dramatic%20snow%20capped%20peaks%2C%20soft%20inviting%20daylight%2C%20premium%20editorial%20hospitality%20photography%20with%20dark%20tones%20for%20text%20contrast&width=1920&height=1080&seq=stays-managed-hero-v1&orientation=landscape"
              alt="A professionally managed stay in Gilgit-Baltistan"
              title="ZAMIN managed hosting"
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/60 to-primary-950/40"></div>
          </div>
          <div className="relative z-10 w-full px-4 pb-12 pt-28 md:px-6 md:pb-16 md:pt-36">
            <div className="mx-auto max-w-7xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-3.5 py-1.5 text-xs font-semibold text-background-50 backdrop-blur-sm">
                <i className="ri-vip-diamond-line text-accent-400"></i>
                ZAMIN Managed
              </span>
              <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold leading-tight text-white md:text-5xl">
                Managed Short-Term Hosting, Done Properly
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background-200 md:text-lg">
                Own a property in Gilgit-Baltistan but don&apos;t want to run it yourself? ZAMIN
                manages the entire short-term rental — from the first photo to the monthly payout
                report.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-background-50 px-6 py-3.5 text-sm font-semibold text-primary-800 transition-colors hover:bg-background-100 sm:w-auto"
                >
                  <i className="ri-calendar-check-line text-base"></i>
                  Get Your Property Evaluated
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-50/50 px-6 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-background-50 hover:text-primary-800 sm:w-auto"
                >
                  <i className="ri-phone-line text-base"></i>
                  {SITE.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background-100 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeading
              eyebrow="What we handle"
              eyebrowIcon="ri-home-gear-line"
              title="Everything, End to End"
              description="You keep ownership and oversight. We take care of the day-to-day running, so your property earns without becoming a second job."
              align="center"
              className="max-w-2xl"
            />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
              {SERVICES.map((service) => (
                <article
                  key={service.title}
                  className="rounded-card border border-background-200 bg-background-50 p-6 transition-colors hover:border-primary-300"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <i className={`${service.icon} text-2xl`}></i>
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-600">{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <SectionHeading
                  eyebrow="For owners"
                  eyebrowIcon="ri-user-star-line"
                  title="Clear Terms, Clear Returns"
                  description="Commissions and management fees are agreed with you up front and set by ZAMIN, never hidden. We report on real bookings — no inflated numbers."
                />
                <ul className="mt-6 space-y-3">
                  {[
                    'Transparent management fee agreed before we start',
                    'Monthly reporting on bookings, revenue and occupancy',
                    'You keep full ownership and final say on pricing',
                    'Local team on the ground in Hunza, Gilgit and Skardu',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground-700 md:text-base">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-accent-700">
                        <i className="ri-checkbox-circle-fill text-lg"></i>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-6 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
                  >
                    <i className="ri-send-plane-line text-base"></i>
                    Request an Evaluation
                  </Link>
                  <a
                    href={SITE.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                  >
                    <i className="ri-whatsapp-line text-base"></i>
                    WhatsApp Us
                  </a>
                </div>
              </div>

              <div className="overflow-hidden rounded-card border border-background-200">
                <img
                  src="https://readdy.ai/api/search-image?query=Property%20owner%20reviewing%20a%20clean%20monthly%20earnings%20and%20occupancy%20report%20on%20a%20tablet%20at%20a%20wooden%20desk%2C%20cup%20of%20tea%20beside%2C%20warm%20soft%20light%20through%20a%20window%20framing%20green%20mountain%20valley%2C%20calm%20professional%20lifestyle%20photography&width=1000&height=1200&seq=stays-managed-report-v1&orientation=portrait"
                  alt="An owner reviewing a monthly performance report"
                  title="Owner reporting with ZAMIN"
                  className="h-full max-h-[520px] w-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </section>

        <StaysFinalCTA />
      </main>
      <Footer />
    </>
  );
}