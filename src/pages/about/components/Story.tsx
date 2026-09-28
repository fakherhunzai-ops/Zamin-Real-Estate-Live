import SectionHeading from '@/components/base/SectionHeading';
import { SITE } from '@/utils/site';

const stats = [
  { value: '500+', label: 'Properties Sold', icon: 'ri-home-heart-line' },
  { value: '98%', label: 'Client Satisfaction', icon: 'ri-emotion-happy-line' },
  { value: '10+', label: 'Years Local Expertise', icon: 'ri-award-line' },
  { value: '6', label: 'Areas Covered', icon: 'ri-map-2-line' },
];

export default function Story() {
  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative h-80 overflow-hidden rounded-card md:h-[520px]">
            <img
              src="https://readdy.ai/api/search-image?query=Zamin%20real%20estate%20advisor%20warmly%20greeting%20a%20family%20outside%20a%20traditional%20stone%20and%20wood%20home%20in%20a%20green%20Gilgit%20Baltistan%20valley%20with%20snow%20capped%20mountains%20behind%2C%20natural%20daylight%2C%20welcoming%20premium%20editorial%20photography&width=1000&height=1200&seq=zamin-about-story&orientation=portrait"
              alt="Zamin Real Estate team with clients at a home in Gilgit-Baltistan"
              title="Zamin Real Estate — our story in Gilgit-Baltistan"
              className="h-full w-full object-cover object-top"
            />
          </div>

          <div>
            <SectionHeading
              eyebrow="Our Story"
              eyebrowIcon="ri-book-open-line"
              title="A Local Agency Built on Trust"
              description="Zamin began with a simple belief: property in Gilgit-Baltistan deserves advisers who actually live here, know the valleys and put people before profit."
            />
            <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-foreground-600 md:text-base">
              <p>
                Founded in {SITE.founded} in the heart of Gilgit, we started by helping a handful of
                local families find homes. Word spread, and today Zamin serves buyers, sellers,
                landlords, tenants and overseas investors across the region.
              </p>
              <p>
                We stay deliberately transparent — a clear 2.5%–3% commission on sales and one month
                rent for rentals, with no hidden charges. Every listing is verified, every step is
                explained, and every client gets a dedicated adviser who stays with them from first
                call to final handover.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                    <i className={`${stat.icon} text-xl`}></i>
                  </span>
                  <span className="mt-3 font-heading text-2xl font-bold text-primary-800 md:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs uppercase tracking-wide text-foreground-600">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}