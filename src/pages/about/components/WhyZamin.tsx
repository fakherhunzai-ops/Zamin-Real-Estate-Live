import SectionHeading from '@/components/base/SectionHeading';

const reasons = [
  {
    icon: 'ri-shield-check-line',
    title: 'Verified Listings',
    text: 'Every property is checked for ownership, documentation and true condition before we recommend it.',
  },
  {
    icon: 'ri-map-pin-2-line',
    title: 'Local Expertise',
    text: 'On-the-ground knowledge of Hunza, Gilgit, Skardu, Nagar, Ghizer and Chilas property markets.',
  },
  {
    icon: 'ri-price-tag-3-line',
    title: 'Transparent Commission',
    text: '2.5%–3% on sales and one month rent for rentals. Clear pricing, no hidden fees — ever.',
  },
  {
    icon: 'ri-user-star-line',
    title: 'Professional Guidance',
    text: 'Experienced advisers walk you through viewings, negotiation and every legal step.',
  },
  {
    icon: 'ri-speed-up-line',
    title: 'Hassle-Free Process',
    text: 'From valuation to paperwork, we handle the complex parts so you can focus on the outcome.',
  },
];

export default function WhyZamin() {
  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Why Zamin"
          eyebrowIcon="ri-heart-3-line"
          title="Your Property, Our Priority"
          description="We are neighbours first and advisers second — which is exactly why clients across Gilgit-Baltistan and the diaspora keep trusting us with their property."
          align="center"
          className="max-w-2xl"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col rounded-card border border-background-200 bg-background-50 p-6 hover:-translate-y-1 hover:border-primary-300 transition-all duration-300"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                <i className={`${reason.icon} text-2xl`}></i>
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950 md:text-lg">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-600">{reason.text}</p>
            </div>
          ))}

          <div className="flex flex-col justify-center rounded-card bg-primary-800 p-6 md:p-7">
            <h3 className="font-heading text-lg font-semibold text-background-50">
              Ready to get started?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-background-300">
              Tell us what you need and a local adviser will guide you — free of charge, no obligation.
            </p>
            <a
              href="#talk-to-team"
              className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-background-50 transition-colors hover:text-accent-300"
            >
              Talk to our team
              <i className="ri-arrow-right-line"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}