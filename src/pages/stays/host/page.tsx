import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import SectionHeading from '@/components/base/SectionHeading';
import StaysFinalCTA from '@/pages/stays/components/StaysFinalCTA';
import { SITE } from '@/utils/site';

const STEPS = [
  {
    icon: 'ri-send-plane-line',
    title: '1. Tell us about your property',
    text: 'Share the location, size, rooms and photos. A quick call is usually all we need to get started.',
  },
  {
    icon: 'ri-search-eye-line',
    title: '2. ZAMIN reviews & inspects',
    text: 'We assess the property, verify ownership details and advise on pricing and presentation.',
  },
  {
    icon: 'ri-image-2-line',
    title: '3. Photography & listing',
    text: 'We create your listing with proper photos, an accurate description and the right category.',
  },
  {
    icon: 'ri-calendar-check-line',
    title: '4. Go live & get booked',
    text: 'Your verified stay goes live on ZAMIN Stays and you start receiving direct booking requests.',
  },
];

export default function HostPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-50">
        <section className="relative flex min-h-[440px] items-end overflow-hidden md:min-h-[520px]">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20welcoming%20Gilgit-Baltistan%20homeowner%20couple%20standing%20outside%20their%20beautiful%20wooden%20guesthouse%20with%20apricot%20trees%20and%20mountains%20behind%2C%20genuine%20friendly%20smiles%2C%20soft%20golden%20natural%20light%2C%20authentic%20lifestyle%20travel%20photography%20with%20dark%20tones%20for%20text%20contrast&width=1920&height=1080&seq=stays-host-hero-v1&orientation=landscape"
              alt="A local host outside their property in Gilgit-Baltistan"
              title="Become a ZAMIN Stays host"
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/95 via-primary-950/60 to-primary-950/40"></div>
          </div>
          <div className="relative z-10 w-full px-4 pb-12 pt-28 md:px-6 md:pb-16 md:pt-36">
            <div className="mx-auto max-w-7xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-3.5 py-1.5 text-xs font-semibold text-background-50 backdrop-blur-sm">
                <i className="ri-home-gear-line text-accent-400"></i>
                ZAMIN Stays · Host with us
              </span>
              <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold leading-tight text-white md:text-5xl">
                Turn Your Property Into a Professionally Managed Stay
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background-200 md:text-lg">
                Hunza, Gojal, Skardu, Naltar and Ghizer are among the most sought-after destinations
                in Pakistan. List with ZAMIN — or let us manage everything — and put your property in
                front of real, verified travellers.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/stays/host/apply"
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-background-50 px-6 py-3.5 text-sm font-semibold text-primary-800 transition-colors hover:bg-background-100 sm:w-auto"
                >
                  <i className="ri-add-line text-base"></i>
                  Start your application
                </Link>
                <a
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-50/50 px-6 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-background-50 hover:text-primary-800 sm:w-auto"
                >
                  <i className="ri-whatsapp-line text-base"></i>
                  Chat with our team
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background-100 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeading
              eyebrow="Two ways to host"
              eyebrowIcon="ri-layout-grid-line"
              title="Choose What Works for You"
              description="Every host is different. Pick the model that fits how hands-on you want to be — you can always change later."
              align="center"
              className="max-w-2xl"
            />
            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <article className="rounded-card border border-background-200 bg-background-50 p-6 md:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-900">
                  <i className="ri-key-2-line text-2xl"></i>
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-foreground-950">
                  List with ZAMIN
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-600">
                  You run the property day to day. ZAMIN gives you the listing, visibility,
                  booking platform, guest leads, payments and reviews.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {[
                    'Verified listing on ZAMIN Stays',
                    'Search visibility by destination & type',
                    'Direct booking enquiries',
                    'Payments and review support',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground-700">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-accent-700">
                        <i className="ri-checkbox-circle-fill"></i>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-card border border-primary-200 bg-primary-50 p-6 md:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-800 text-background-50">
                  <i className="ri-vip-diamond-line text-2xl"></i>
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-foreground-950">
                  Let ZAMIN manage everything
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-600">
                  Hand over the keys. We run the entire short-term operation — pricing, guests,
                  cleaning, maintenance and reporting.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {[
                    'Onboarding & professional photography',
                    'Pricing & calendar management',
                    'Guest communication & check-in/out',
                    'Cleaning, maintenance & owner reporting',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground-700">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-accent-700">
                        <i className="ri-checkbox-circle-fill"></i>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/stays/managed-hosting"
                  className="mt-6 inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
                >
                  Learn about managed hosting
                  <i className="ri-arrow-right-line text-base"></i>
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-background-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeading
              eyebrow="How it works"
              eyebrowIcon="ri-route-line"
              title="From Enquiry to Your First Guest"
              align="center"
              className="max-w-2xl"
            />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <article key={step.title} className="rounded-card border border-background-200 bg-background-50 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-100 text-accent-900">
                    <i className={`${step.icon} text-xl`}></i>
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-600">{step.text}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-start gap-4 rounded-card border border-background-200 bg-background-100 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <i className="ri-shield-check-line text-xl"></i>
                </span>
                <p className="max-w-2xl text-sm leading-relaxed text-foreground-700">
                  Every property is reviewed by our team before it goes live, and stays are only
                  marked <strong>Verified by ZAMIN</strong> once we&apos;ve actually checked them.
                  Your private ownership documents are kept secure and never shown publicly.
                </p>
              </div>
              <Link
                to="/stays/host/apply"
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
              >
                <i className="ri-send-plane-line text-base"></i>
                Start Your Application
              </Link>
            </div>
          </div>
        </section>

        <StaysFinalCTA />
      </main>
      <Footer />
    </>
  );
}