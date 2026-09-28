import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import SectionHeading from '@/components/base/SectionHeading';
import Button from '@/components/base/Button';
import ConsultCTA from '@/components/base/ConsultCTA';
import { services } from '@/mocks/services';
import { SITE } from '@/utils/site';

const serviceCta: Record<string, { label: string; to: string; icon: string }> = {
  'buying-assistance': { label: 'Start Your Search', to: '/properties-for-sale', icon: 'ri-search-line' },
  'property-sales': { label: 'List Your Property', to: '/sell-your-property', icon: 'ri-add-line' },
  'rental-services': { label: 'Browse Rentals', to: '/properties-for-rent', icon: 'ri-key-2-line' },
  'property-valuation': { label: 'Request Free Valuation', to: '/valuation', icon: 'ri-survey-line' },
  'investment-advisory': { label: 'Talk to an Advisor', to: '/contact', icon: 'ri-line-chart-line' },
  'property-marketing': { label: 'Get Started', to: '/sell-your-property', icon: 'ri-megaphone-line' },
  'documentation-assistance': { label: 'Ask About Documents', to: '/contact', icon: 'ri-file-shield-2-line' },
};

const serviceImages: Record<string, string> = {
  'buying-assistance':
    'https://readdy.ai/api/search-image?query=Happy%20couple%20reviewing%20property%20plans%20with%20a%20real%20estate%20advisor%20in%20a%20bright%20modern%20office%20with%20mountain%20views%20through%20the%20window%2C%20warm%20natural%20light%2C%20professional%20lifestyle%20photography%2C%20clean%20minimalist%20interior&width=900&height=700&seq=zamin-svc-buying&orientation=landscape',
  'property-sales':
    'https://readdy.ai/api/search-image?query=Elegant%20traditional%20stone%20and%20wood%20house%20in%20Gilgit%20Baltistan%20Pakistan%20with%20a%20for%20sale%20sign%2C%20green%20garden%20and%20mountains%20behind%2C%20bright%20daylight%2C%20premium%20real%20estate%20photography&width=900&height=700&seq=zamin-svc-sales&orientation=landscape',
  'rental-services':
    'https://readdy.ai/api/search-image?query=Handing%20over%20a%20house%20key%20to%20a%20happy%20family%20at%20the%20front%20door%20of%20a%20modern%20home%20with%20mountain%20scenery%20in%20Pakistan%2C%20warm%20welcoming%20light%2C%20lifestyle%20real%20estate%20photography&width=900&height=700&seq=zamin-svc-rental&orientation=landscape',
  'property-valuation':
    'https://readdy.ai/api/search-image?query=Real%20estate%20professional%20with%20a%20clipboard%20and%20measuring%20tape%20assessing%20a%20property%20exterior%20in%20a%20green%20mountain%20valley%20in%20Pakistan%2C%20focused%20documentary%20style%20photography%2C%20bright%20natural%20light&width=900&height=700&seq=zamin-svc-valuation&orientation=landscape',
  'investment-advisory':
    'https://readdy.ai/api/search-image?query=Modern%20wooden%20desk%20with%20property%20investment%20charts%2C%20a%20small%20architectural%20model%20and%20a%20laptop%20showing%20graphs%2C%20warm%20natural%20light%2C%20premium%20business%20editorial%20photography%2C%20clean%20minimal%20composition&width=900&height=700&seq=zamin-svc-investment&orientation=landscape',
  'property-marketing':
    'https://readdy.ai/api/search-image?query=Photographer%20capturing%20a%20beautiful%20mountain%20property%20with%20a%20professional%20camera%20on%20a%20tripod%20at%20golden%20hour%20in%20Gilgit%20Baltistan%20Pakistan%2C%20behind%20the%20scenes%20editorial%20photography%2C%20warm%20cinematic%20light&width=900&height=700&seq=zamin-svc-marketing&orientation=landscape',
  'documentation-assistance':
    'https://readdy.ai/api/search-image?query=Close%20up%20of%20signing%20a%20property%20sale%20agreement%20with%20a%20pen%20on%20a%20wooden%20desk%2C%20official%20documents%20and%20keys%20nearby%2C%20soft%20warm%20natural%20light%2C%20professional%20business%20photography&width=900&height=700&seq=zamin-svc-docs&orientation=landscape',
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Sweeping%20aerial%20panorama%20of%20Gilgit%20Baltistan%20mountain%20valleys%20with%20green%20fields%20and%20villages%2C%20soft%20warm%20afternoon%20light%2C%20cinematic%20wide%20landscape%20photography&width=1600&height=600&seq=zamin-services-hero&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} />
            <div className="mt-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
                <i className="ri-grid-line text-accent-400"></i>
                Full-Service Real Estate
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
                Everything You Need to Buy, Sell, Rent &amp; Invest
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-background-300 md:text-base">
                From finding your first home to marketing a property, arranging a valuation or
                structuring an investment — Zamin looks after every part of the journey across
                Hunza, Gilgit, Skardu, Nagar, Ghizer and Chilas.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button to="/contact" variant="light" size="lg" icon="ri-customer-service-2-line">
                  Talk to a Consultant
                </Button>
                <Button to="/properties-for-sale" variant="outlineLight" size="lg">
                  Explore Properties
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col gap-14 md:gap-20">
              {services.map((service, index) => {
                const cta = serviceCta[service.id];
                const flip = index % 2 === 1;
                return (
                  <article
                    key={service.id}
                    id={service.id}
                    className="scroll-mt-24 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14"
                  >
                    <div className={flip ? 'lg:order-2' : ''}>
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                        <i className={`${service.icon} text-2xl`}></i>
                      </span>
                      <h2 className="mt-5 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
                        {service.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
                        {service.description}
                      </p>
                      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {service.benefits.map((benefit) => (
                          <li
                            key={benefit}
                            className="flex items-start gap-2.5 text-sm text-foreground-700"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-primary-600">
                              <i className="ri-checkbox-circle-fill text-base"></i>
                            </span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <Button to={cta.to} variant="primary" icon={cta.icon}>
                          {cta.label}
                        </Button>
                        <Button
                          href={SITE.whatsappHref}
                          variant="outline"
                          icon="ri-whatsapp-line"
                          ariaLabel="Chat on WhatsApp about this service"
                        >
                          WhatsApp Us
                        </Button>
                      </div>
                    </div>

                    <div className={`overflow-hidden rounded-card border border-background-200 bg-background-50 ${flip ? 'lg:order-1' : ''}`}>
                      <div className="h-64 w-full md:h-80">
                        <img
                          src={serviceImages[service.id]}
                          alt={`${service.title} — Zamin Real Estate in Gilgit-Baltistan`}
                          title={`${service.title} | Zamin Real Estate`}
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-background-50 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeading
              eyebrow="Why Zamin"
              eyebrowIcon="ri-shield-star-line"
              title="One Team, Every Step of the Way"
              description="Local knowledge, transparent pricing and genuine care — the reasons clients across Gilgit-Baltistan and the diaspora keep coming back."
              align="center"
              className="max-w-2xl"
            />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: 'ri-verified-badge-line', title: 'Verified Listings', text: 'Every property is checked for ownership and legitimacy before we recommend it.' },
                { icon: 'ri-map-pin-2-line', title: 'Local Expertise', text: 'Deep roots in Hunza, Gilgit, Skardu, Nagar, Ghizer and Chilas.' },
                { icon: 'ri-hand-coin-line', title: 'Transparent Fees', text: 'Clear 2.5%–3% sales commission and one month rent. No hidden charges.' },
                { icon: 'ri-customer-service-2-line', title: 'Personal Support', text: 'A dedicated advisor who stays with you from first call to handover.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col rounded-card border border-background-200 bg-background-50 p-6"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-secondary-100 text-secondary-900">
                    <i className={`${item.icon} text-2xl`}></i>
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ConsultCTA
          eyebrow="Ready When You Are"
          eyebrowIcon="ri-customer-service-2-line"
          title="Speak With a Property Consultant"
          description="Tell us what you need — buying, selling, renting, valuation or investment — and a Zamin advisor will guide you with no obligation."
          primary={{ label: 'Talk to a Consultant', to: '/contact', icon: 'ri-chat-3-line' }}
          secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
        />
      </main>
      <Footer />
    </>
  );
}