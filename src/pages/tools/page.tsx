import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import SectionHeading from '@/components/base/SectionHeading';
import ToolsSection from '@/components/feature/ToolsSection';
import ConsultCTA from '@/components/base/ConsultCTA';
import PropertyAlertsBand from '@/components/feature/PropertyAlertsBand';
import { SITE } from '@/utils/site';

const REASONS = [
  {
    icon: 'ri-money-dollar-circle-line',
    title: 'No cost, no sign-up',
    text: 'Every tool is completely free and works instantly in your browser. No account, no email, no catch.',
  },
  {
    icon: 'ri-file-download-line',
    title: 'Print, save or email',
    text: 'Each calculator builds a clean summary you can print, save as a PDF, or email straight to your inbox to take to your bank or adviser.',
  },
  {
    icon: 'ri-arrow-left-right-line',
    title: 'Compare two scenarios',
    text: 'Test two loans, two properties or two prices side by side and instantly see how the numbers differ.',
  },
  {
    icon: 'ri-map-pin-2-line',
    title: 'Built for this market',
    text: 'Figures and defaults reflect the realities of buying, selling and renting in Gilgit-Baltistan.',
  },
];

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Calm%20modern%20desk%20scene%20with%20a%20calculator%2C%20notebook%20and%20a%20cup%20of%20tea%20beside%20a%20window%20overlooking%20green%20mountains%20in%20Gilgit%20Baltistan%20Pakistan%2C%20soft%20natural%20daylight%2C%20clean%20minimal%20planning%20photography&width=1600&height=600&seq=zamin-tools-hub-hero&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs
              light
              items={[{ label: 'Home', to: '/' }, { label: 'Tools' }]}
            />
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
              <i className="ri-tools-line text-accent-400"></i>
              Free Calculators
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
              Property Tools &amp; Calculators
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background-300 md:text-base">
              Plan a purchase or an investment with clear, honest numbers. Work out your mortgage,
              test a rental yield, or estimate the costs of transferring a property — then take the
              summary to your bank.
            </p>
          </div>
        </section>

        <ToolsSection />

        <section className="bg-background-100 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionHeading
              eyebrow="Why Use Them"
              eyebrowIcon="ri-shield-check-line"
              title="Free, fast and made for here"
              description="Simple tools designed to answer the money questions buyers and investors actually ask."
              align="center"
              className="max-w-2xl"
            />

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {REASONS.map((reason) => (
                <div
                  key={reason.title}
                  className="rounded-card border border-background-200 bg-background-50 p-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-800 text-background-50">
                    <i className={`${reason.icon} text-2xl`}></i>
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-foreground-950">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-600">{reason.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PropertyAlertsBand />

        <ConsultCTA
          eyebrow="Numbers Sorted, Now What?"
          eyebrowIcon="ri-customer-service-2-line"
          title="Turn Your Numbers Into a Plan"
          description="Once you know your budget, our advisers can match it to real properties in Gilgit-Baltistan — buying, renting or investing. Free, with no obligation."
          primary={{ label: 'Talk to a Consultant', to: '/contact', icon: 'ri-chat-3-line' }}
          secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
        />
      </main>
      <Footer />
    </>
  );
}