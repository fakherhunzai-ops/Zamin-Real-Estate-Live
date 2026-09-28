import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import SectionHeading from '@/components/base/SectionHeading';
import { SITE } from '@/utils/site';
import PropertyForm from './components/PropertyForm';

const benefits = [
  {
    icon: 'ri-survey-line',
    title: 'Free Property Valuation',
    description: 'Know exactly what your property is worth with an accurate, no-obligation local valuation.',
  },
  {
    icon: 'ri-camera-3-line',
    title: 'Professional Marketing',
    description: 'Quality photography, a compelling listing and targeted exposure to serious buyers and tenants.',
  },
  {
    icon: 'ri-user-search-line',
    title: 'Qualified Buyer Matching',
    description: 'We match your property with verified buyers, tenants and investors from our active network.',
  },
  {
    icon: 'ri-hand-coin-line',
    title: 'Negotiation Support',
    description: 'Our advisors negotiate firmly on your behalf to achieve the best possible price.',
  },
  {
    icon: 'ri-file-shield-2-line',
    title: 'Documentation & Closing',
    description: 'From agreements to transfer and registration, we handle the paperwork from start to finish.',
  },
];

const steps = [
  { step: '01', title: 'Submit Your Details', text: 'Share your property information through the form below in a couple of minutes.' },
  { step: '02', title: 'Free Valuation', text: 'We visit, assess the property and give you a realistic market valuation.' },
  { step: '03', title: 'We Market It', text: 'Professional photos and a targeted listing reach our buyers and tenants.' },
  { step: '04', title: 'Viewings & Offers', text: 'We arrange viewings, qualify interest and negotiate the best deal.' },
  { step: '05', title: 'Close & Handover', text: 'We manage documentation and transfer so closing is smooth and secure.' },
];

export default function SellPage() {
  const scrollToForm = () => {
    document.getElementById('submission-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Traditional%20stone%20mountain%20house%20with%20a%20warm%20glowing%20window%20at%20dusk%20in%20Gilgit%20Baltistan%20Pakistan%20with%20mountains%20behind%20cinematic%20warm%20lighting%20premium%20real%20estate%20photography&width=1600&height=600&seq=zamin-sell-hero&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'Sell Your Property' }]} />
            <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
                  <i className="ri-award-line text-primary-300"></i>
                  Free Valuation · Transparent 2.5%–3% Commission
                </span>
                <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
                  Sell Your Property With Local Experts
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background-300 md:text-base">
                  List your property with Zamin and reach thousands of qualified buyers and tenants
                  across Gilgit-Baltistan. We handle the valuation, marketing, negotiation and
                  paperwork — you just decide when to say yes.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary-50 px-6 py-3.5 text-sm font-semibold text-primary-800 transition-colors hover:bg-white"
                  >
                    Get a Free Valuation
                    <i className="ri-arrow-right-line"></i>
                  </button>
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-background-50/40 px-6 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-background-50/10"
                  >
                    <i className="ri-phone-line"></i>
                    Call an Agent
                  </a>
                </div>
              </div>

              <div className="rounded-card border border-background-50/15 bg-background-50/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-background-50">Why owners choose Zamin</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {['Verified local buyer network', 'Professional photography included', 'Fixed, transparent commission', 'Full documentation support'].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-background-200">
                        <span className="flex h-5 w-5 items-center justify-center text-primary-300">
                          <i className="ri-checkbox-circle-fill text-base"></i>
                        </span>
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background-50 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeading
              eyebrow="How It Works"
              eyebrowIcon="ri-route-line"
              title="Selling Made Simple"
              description="A clear five-step process that takes the stress out of selling or renting your property."
              align="center"
              className="max-w-2xl"
            />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((item) => (
                <div key={item.step} className="flex flex-col rounded-card border border-background-200 bg-background-50 p-5">
                  <span className="font-heading text-2xl font-bold text-primary-600">{item.step}</span>
                  <h3 className="mt-3 font-heading text-base font-semibold text-foreground-950">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background-100 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeading
              eyebrow="What You Get"
              eyebrowIcon="ri-gift-line"
              title="Everything You Need to Sell Confidently"
              description="One dedicated team looking after your property from first valuation to final handover."
            />
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4 rounded-card border border-background-200 bg-background-50 p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                    <i className={`${benefit.icon} text-2xl`}></i>
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-foreground-950">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-foreground-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex flex-col justify-center rounded-card bg-primary-700 p-6">
                <p className="font-heading text-lg font-semibold text-background-50">
                  Prefer to talk first?
                </p>
                <p className="mt-2 text-sm text-background-300">
                  Our advisors are happy to answer questions with no obligation.
                </p>
                <a
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-800 transition-colors hover:bg-white"
                >
                  <i className="ri-whatsapp-line text-base"></i>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="submission-form" className="scroll-mt-24 bg-background-50 py-14 md:py-20">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <SectionHeading
              eyebrow="List Your Property"
              eyebrowIcon="ri-add-circle-line"
              title="Submit Your Property Details"
              description="Fill in the form below and we'll be in touch to arrange your free valuation. It only takes a couple of minutes."
              align="center"
              className="max-w-2xl"
            />
            <div className="mt-10 rounded-card border border-background-200 bg-background-50 p-5 md:p-8">
              <PropertyForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}