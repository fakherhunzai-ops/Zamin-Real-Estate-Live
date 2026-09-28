import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import ConsultCTA from '@/components/base/ConsultCTA';
import { SITE } from '@/utils/site';
import ValuationForm from './components/ValuationForm';

const benefits = [
  {
    icon: 'ri-price-tag-3-line',
    title: 'Realistic Market Value',
    text: 'Priced against genuine recent comparable sales in your area — not inflated guesswork.',
  },
  {
    icon: 'ri-map-pin-2-line',
    title: 'Local Area Knowledge',
    text: 'Deep expertise across Hunza, Gilgit, Skardu, Nagar, Ghizer and Chilas.',
  },
  {
    icon: 'ri-file-text-line',
    title: 'Clear Written Report',
    text: 'A straightforward summary you can use to list, negotiate or plan with confidence.',
  },
  {
    icon: 'ri-money-cny-circle-line',
    title: 'Completely Free',
    text: 'No charge and no obligation, whether or not you decide to list with Zamin.',
  },
];

const stats = [
  { value: '1,200+', label: 'Properties Valued' },
  { value: '10+', label: 'Years Local' },
  { value: '48h', label: 'Typical Turnaround' },
  { value: '100%', label: 'Free & No Obligation' },
];

export default function ValuationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Traditional%20stone%20and%20wood%20house%20with%20terraced%20green%20fields%20and%20snow%20capped%20mountains%20behind%20in%20Gilgit%20Baltistan%20Pakistan%2C%20warm%20golden%20light%2C%20cinematic%20real%20estate%20landscape%20photography&width=1600&height=600&seq=zamin-valuation-hero&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'Property Valuation' }]} />
            <div className="mt-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
                <i className="ri-survey-line text-accent-400"></i>
                Free Professional Valuation
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
                Know What Your Property Is Worth
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-background-300 md:text-base">
                Get an accurate, no-obligation valuation based on real local market data. Share a
                few details and a Zamin advisor will arrange your free assessment.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.15fr]">
              <div className="flex flex-col gap-6">
                <div className="rounded-card border border-background-200 bg-background-50 p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground-950 md:text-2xl">
                    Why get a Zamin valuation?
                  </h2>
                  <div className="mt-5 flex flex-col gap-4">
                    {benefits.map((benefit) => (
                      <div key={benefit.title} className="flex gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                          <i className={`${benefit.icon} text-xl`}></i>
                        </span>
                        <div>
                          <h3 className="font-heading text-base font-semibold text-foreground-950">
                            {benefit.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-foreground-600">{benefit.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-card border border-background-200 bg-background-50 p-5 text-center"
                    >
                      <div className="font-heading text-2xl font-bold text-primary-700 md:text-3xl">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-foreground-500">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-card bg-primary-900 p-6">
                  <h3 className="font-heading text-lg font-semibold text-background-50">
                    Prefer to talk it through?
                  </h3>
                  <p className="mt-2 text-sm text-background-300">
                    Call or WhatsApp us and we&apos;ll answer your questions right away.
                  </p>
                  <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                    <a
                      href={SITE.phoneHref}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-background-50 px-4 py-2.5 text-sm font-semibold text-primary-800 transition-colors hover:bg-white"
                    >
                      <i className="ri-phone-line text-base"></i>
                      Call Now
                    </a>
                    <a
                      href={SITE.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-background-50/30 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-background-50/10"
                    >
                      <i className="ri-whatsapp-line text-base"></i>
                      WhatsApp Us
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-card border border-background-200 bg-background-50 p-5 md:p-8">
                <h2 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                  Request Your Free Valuation
                </h2>
                <p className="mt-2 text-sm text-foreground-600">
                  Fill in the details below and we&apos;ll get straight back to you.
                </p>
                <div className="mt-6">
                  <ValuationForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ConsultCTA
          eyebrow="Thinking of Selling?"
          eyebrowIcon="ri-home-smile-line"
          title="Ready to List Once You Know Your Value?"
          description="Our sales team can market your property to qualified buyers and tenants across Gilgit-Baltistan and the diaspora."
          primary={{ label: 'List Your Property', to: '/sell-your-property', icon: 'ri-add-line' }}
          secondary={{ label: 'Explore Services', to: '/services', icon: 'ri-grid-line' }}
        />
      </main>
      <Footer />
    </>
  );
}