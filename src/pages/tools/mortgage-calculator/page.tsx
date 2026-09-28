import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import ConsultCTA from '@/components/base/ConsultCTA';
import ToolsSection from '@/components/feature/ToolsSection';
import { SITE } from '@/utils/site';
import MortgageCalculator from './components/MortgageCalculator';

const STEPS = [
  {
    icon: 'ri-home-4-line',
    title: 'Enter the property price',
    text: 'Start with the asking price of the home, plot or apartment you are considering.',
  },
  {
    icon: 'ri-wallet-3-line',
    title: 'Set your down payment',
    text: 'Add what you can pay upfront. A larger deposit lowers both your monthly payment and total interest.',
  },
  {
    icon: 'ri-percent-line',
    title: 'Choose rate and term',
    text: 'Enter your bank’s annual interest rate and how many years you want to repay over.',
  },
];

const TIPS = [
  'A shorter term means a higher monthly payment but far less interest overall.',
  'Compare offers from more than one bank — small rate differences add up over decades.',
  'Keep an emergency buffer outside your down payment for fees and repairs.',
  'Confirm whether your lender charges processing, valuation or early-settlement fees.',
];

export default function MortgageCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Modern%20stone%20and%20wood%20home%20exterior%20in%20a%20green%20mountain%20valley%20in%20Gilgit%20Baltistan%20Pakistan%20with%20warm%20afternoon%20daylight%2C%20clean%20minimal%20composition%2C%20premium%20lifestyle%20real%20estate%20photography&width=1600&height=600&seq=zamin-tools-hero&orientation=landscape"
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
                { label: 'Mortgage Calculator' },
              ]}
            />
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
              <i className="ri-calculator-line text-accent-400"></i>
              Free Planning Tool
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
              Mortgage &amp; EMI Calculator
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background-300 md:text-base">
              Work out your monthly instalment, total interest and full repayment schedule before
              you commit. Adjust the price, down payment, rate and term to see instantly how each
              choice changes what you pay.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <MortgageCalculator />
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
                Three numbers, one clear picture
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
                The EMI is the fixed amount you repay each month. It covers both the interest on
                your loan and a portion of the amount you borrowed.
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
                  Smart borrowing
                </span>
                <h2 className="mt-3 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
                  Tips before you sign
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
                  A mortgage is a long commitment. A few minutes of planning now can save you a
                  significant amount over the life of the loan.
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

        <ToolsSection currentKey="mortgage-calculator" tone="muted" />

        <ConsultCTA
          eyebrow="Need Help With Finance?"
          eyebrowIcon="ri-customer-service-2-line"
          title="Talk Through Your Budget With Us"
          description="Not sure how much you can comfortably borrow, or which property fits your plan? Our advisers know the local market and can help you work it out — free and with no obligation."
          primary={{ label: 'Talk to a Consultant', to: '/contact', icon: 'ri-chat-3-line' }}
          secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
        />
      </main>
      <Footer />
    </>
  );
}