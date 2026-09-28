import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import ConsultCTA from '@/components/base/ConsultCTA';
import ToolsSection from '@/components/feature/ToolsSection';
import { SITE } from '@/utils/site';
import StampDutyCalculator from './components/StampDutyCalculator';

const STEPS = [
  {
    icon: 'ri-price-tag-3-line',
    title: 'Enter the purchase price',
    text: 'Start with the agreed or asking price of the property you intend to buy.',
  },
  {
    icon: 'ri-equalizer-line',
    title: 'Set the fees that apply',
    text: 'Stamp duty, registration, mutation and commission rates vary by area — adjust them to match your case.',
  },
  {
    icon: 'ri-file-list-3-line',
    title: 'See your full outlay',
    text: 'The estimator adds everything on top of the price so you know the real cost of the purchase.',
  },
];

const TIPS = [
  'Budget for transfer costs up front — they typically add several percent on top of the price.',
  'Ask your registrar for the current stamp duty and registration rates before you commit.',
  'Agency commission is negotiable within reason — always agree it in writing.',
  'Keep proof of every fee you pay; it matters if you later sell or need to prove ownership.',
];

export default function StampDutyCalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Neat%20stack%20of%20property%20transfer%20and%20legal%20documents%20with%20a%20set%20of%20house%20keys%20and%20a%20pen%20on%20a%20wooden%20desk%2C%20soft%20warm%20daylight%2C%20clean%20minimal%20paperwork%20photography%2C%20muted%20natural%20tones&width=1600&height=600&seq=zamin-transfer-hero&orientation=landscape"
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
                { label: 'Transfer Cost Estimator' },
              ]}
            />
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
              <i className="ri-file-list-3-line text-accent-400"></i>
              Free Buying Tool
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
              Stamp Duty &amp; Transfer Cost Estimator
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-background-300 md:text-base">
              The purchase price is only the beginning. Estimate the stamp duty, registration,
              mutation, commission and legal fees that sit on top — so you know your true total
              before you commit.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <StampDutyCalculator />
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
                Know the real cost of buying
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
                Transfer costs are made up of several separate charges. Together they can add a
                meaningful percentage to what you pay on completion.
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
                  Before you buy
                </span>
                <h2 className="mt-3 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
                  Budget for the whole picture
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
                  Buyers who plan for transfer costs from the start never feel squeezed at
                  completion. A little preparation goes a long way.
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

        <ToolsSection currentKey="stamp-duty-calculator" tone="muted" />

        <ConsultCTA
          eyebrow="Buying a Property?"
          eyebrowIcon="ri-customer-service-2-line"
          title="Let Us Handle the Paperwork"
          description="From document verification to registration and transfer, our team guides you through every fee and form so nothing is missed. Free advice, no obligation."
          primary={{ label: 'Talk to a Consultant', to: '/contact', icon: 'ri-chat-3-line' }}
          secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
        />
      </main>
      <Footer />
    </>
  );
}