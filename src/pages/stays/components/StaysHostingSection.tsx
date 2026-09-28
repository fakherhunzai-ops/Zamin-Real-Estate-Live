import { Link } from 'react-router-dom';
import SectionHeading from '@/components/base/SectionHeading';

const MANAGED_SERVICES = [
  'Property assessment & onboarding',
  'Professional photography',
  'Listing creation & optimisation',
  'Dynamic pricing & calendar management',
  'Guest communication & check-in/out',
  'Cleaning & maintenance coordination',
  'Owner reporting & payouts',
];

export default function StaysHostingSection() {
  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Host with ZAMIN"
          eyebrowIcon="ri-home-gear-line"
          title="Two Ways to Host Your Property"
          description="Keep the keys and run it yourself, or hand the whole short-term operation to ZAMIN. Either way, your property stays verified and locally supported."
          align="center"
          className="max-w-2xl"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="flex flex-col overflow-hidden rounded-card border border-background-200 bg-background-50">
            <div className="relative h-52 w-full overflow-hidden bg-background-100">
              <img
                src="https://readdy.ai/api/search-image?query=Warm%20friendly%20local%20homeowner%20standing%20on%20the%20wooden%20veranda%20of%20a%20traditional%20guesthouse%20in%20Hunza%20Pakistan%2C%20orchards%20and%20mountains%20behind%2C%20natural%20inviting%20daylight%2C%20authentic%20lifestyle%20travel%20photography&width=1200&height=700&seq=stays-listed-owner-v1&orientation=landscape"
                alt="A local host on the veranda of their guesthouse in Gilgit-Baltistan"
                title="ZAMIN Listed — host it yourself"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 to-transparent"></div>
              <span className="absolute bottom-4 left-4 rounded-md bg-background-50/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-800 backdrop-blur-sm">
                ZAMIN Listed
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-heading text-xl font-bold text-foreground-950">
                List it yourself, we bring the guests
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-600">
                You operate the property. ZAMIN gives you the listing, search visibility, booking
                platform, guest leads, payments, reviews and marketing.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  'Listing & search visibility',
                  'Direct booking platform',
                  'Guest leads & enquiries',
                  'Reviews & marketing support',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground-700">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-accent-600">
                      <i className="ri-checkbox-circle-fill"></i>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5">
                <Link
                  to="/stays/host"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-5 py-3 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                >
                  <i className="ri-add-line text-base"></i>
                  Become a Host
                </Link>
              </div>
            </div>
          </article>

          <article className="flex flex-col overflow-hidden rounded-card border border-primary-200 bg-primary-50">
            <div className="relative h-52 w-full overflow-hidden bg-primary-100">
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20hospitality%20team%20in%20smart%20uniforms%20preparing%20a%20beautifully%20styled%20mountain%20villa%20for%20guests%20in%20Gilgit-Baltistan%20Pakistan%2C%20fresh%20linens%20and%20warm%20interior%2C%20organised%20premium%20property%20management%20scene%2C%20editorial%20photography&width=1200&height=700&seq=stays-managed-team-v1&orientation=landscape"
                alt="ZAMIN's managed hosting team preparing a stay"
                title="ZAMIN Managed — we run everything"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 to-transparent"></div>
              <span className="absolute bottom-4 left-4 rounded-md bg-primary-800 px-3 py-1 text-xs font-bold uppercase tracking-wide text-background-50">
                ZAMIN Managed
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-heading text-xl font-bold text-foreground-950">
                Let ZAMIN manage everything
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-600">
                Hand us the keys. We run the entire short-term operation and send you the returns —
                from photography and pricing to guests, cleaning and reporting.
              </p>
              <ul className="mt-5 space-y-2.5">
                {MANAGED_SERVICES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground-700">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-accent-700">
                      <i className="ri-checkbox-circle-fill"></i>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5">
                <Link
                  to="/stays/managed-hosting"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
                >
                  <i className="ri-vip-diamond-line text-base"></i>
                  Get Your Property Evaluated
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}