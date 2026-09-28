import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import ConsultCTA from '@/components/base/ConsultCTA';
import ToolsSection from '@/components/feature/ToolsSection';
import { SITE } from '@/utils/site';
import RentalYieldCalculator from './components/RentalYieldCalculator';

const STEPS = [
  {
    icon: 'ri-money-dollar-circle-line',
    title: 'Enter the expected rent',
    text: 'Use a realistic monthly rent for the area, based on what similar properties actually achieve.',
  },
  {
    icon: 'ri-home-4-line',
    title: 'Add the purchase price',
    text: 'The total you would pay to buy the property, including the price you are negotiating.',
  },
  {
    icon: 'ri-line-chart-line',
    title: 'See your real return',
    text: 'We subtract management fees, vacancy and running costs to show gross and net yield.',
  },
];

const TIPS = [
  'Gross yield ignores costs — always compare net yield when judging a rental investment.',
  'Tourism areas can earn more in season but sit quieter in winter, so plan for vacancy.',
  'A well-kept property that attracts reliable long-term tenants often beats a higher-rent gamble.',
  'Factor in the transfer and stamp duty costs you pay at purchase, not just the price.',
];

export default function RentalYieldCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Warm%20modern%20guesthouse%20terrace%20overlooking%20a%20green%20mountain%20valley%20in%20Gilgit%20Baltistan%20Pakistan%20with%20wooden%20railings%20and%20potted%20plants%2C%20soft%20afternoon%20light%2C%20clean%20minimal%20hospitality%20photography&width=1600&height=600&seq=zamin-yield-hero&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs
              light
              items={[
                { label: 'Home', to: '/' },
                { label: 'Tools', to: '/tools' },
                { label: 'Rental Yield Calculator' },
              ]}
            />
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
              <i className="ri-line-chart-line text-accent-400"></i>
              Free Investment Tool
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
              Rental Yield Calculator
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background-300 md:text-base">
              Judge a rental property on real numbers. Enter the rent, purchase price and running
              costs to see the gross yield, the net yield and how many years it takes to earn back
              your investment.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <RentalYieldCalculator />
          </div>
        </section>

        <section className="bg-background-50 py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
                <span className="flex h-4 w-4 items-center justify-center">
                  <i className="ri-guide-line text-sm"></i>
                </span>
                How it works
              </span>
              <h2 className="mt-3 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
                From rent to real return
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
                Gross yield is the simple ratio of rent to price. Net yield is the honest number —
                what is left after the costs of actually running the property.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-card border border-background-200 bg-background-100 p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-800 text-background-50">
                      <i className={`${step.icon} text-2xl`}></i>
                    </span>
                    <span className="font-heading text-2xl font-bold text-background-300">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold text-foreground-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-600">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
                  <span className="flex h-4 w-4 items-center justify-center">
                    <i className="ri-lightbulb-line text-sm"></i>
                  </span>
                  Investing smarter
                </span>
                <h2 className="mt-3 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
                  What to check before you invest
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
                  A strong headline yield can hide weak real returns. Look at the whole picture
                  before committing your money.
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {TIPS.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-3 rounded-card border border-background-200 bg-background-50 p-4"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-accent-600">
                      <i className="ri-checkbox-circle-fill text-lg"></i>
                    </span>
                    <span className="text-sm leading-relaxed text-foreground-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <ToolsSection currentKey="rental-yield-calculator" tone="muted" />

        <ConsultCTA
          eyebrow="Thinking of Investing?"
          eyebrowIcon="ri-customer-service-2-line"
          title="Find a Property That Actually Pays"
          description="Our advisers know which areas of Gilgit-Baltistan rent well and which are seasonal. Tell us your budget and goals and we will find a property that fits."
          primary={{ label: 'Talk to a Consultant', to: '/contact', icon: 'ri-chat-3-line' }}
          secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
        />
      </main>
      <Footer />
    </>
  );
}