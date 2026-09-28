import SectionHeading from '@/components/base/SectionHeading';

const reasons = [
  {
    icon: 'ri-shield-check-line',
    title: 'Verified Listings',
    description: 'Every property is checked for ownership, documentation and true condition before we recommend it.',
  },
  {
    icon: 'ri-map-pin-user-line',
    title: 'Local Expertise',
    description: 'On-the-ground knowledge of Hunza, Gilgit, Skardu, Nagar, Ghizer and Chilas markets.',
  },
  {
    icon: 'ri-price-tag-3-line',
    title: 'Transparent Commission',
    description: '2.5%–3% on sales and one month rent for rentals. Clear pricing, no hidden fees — ever.',
  },
  {
    icon: 'ri-user-star-line',
    title: 'Professional Guidance',
    description: 'Experienced advisors walk you through viewings, negotiation and every legal step.',
  },
  {
    icon: 'ri-speed-up-line',
    title: 'Hassle-Free Process',
    description: 'From valuation to paperwork, we handle the complex parts so you can focus on the outcome.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-background-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-80 md:h-[520px] rounded-card overflow-hidden order-2 lg:order-1">
            <img
              src="https://readdy.ai/api/search-image?query=Trusting%20family%20couple%20meeting%20a%20professional%20real%20estate%20agent%20outside%20a%20modern%20stone%20mountain%20home%20in%20Gilgit-Baltistan%20Pakistan%2C%20snow%20capped%20peaks%20behind%2C%20warm%20natural%20daylight%2C%20friendly%20welcoming%20atmosphere%2C%20premium%20editorial%20photography&width=1000&height=1200&seq=zamin-why-premium&orientation=portrait&nocache=true"
              alt="Zamin Real Estate advisor with a family in front of a home in Gilgit-Baltistan"
              title="Zamin Real Estate — your trusted property partner"
              className="h-full w-full object-cover object-top"
            />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Why Choose Zamin"
              eyebrowIcon="ri-heart-3-line"
              title="Your Property, Our Priority"
              description="We're not just agents — we're your neighbours who understand Gilgit-Baltistan's unique property landscape. Clients trust us because we put their interests first."
            />

            <div className="mt-8 flex flex-col gap-5">
              {reasons.map((reason) => (
                <div key={reason.title} className="flex gap-4">
                  <span className="w-11 h-11 flex items-center justify-center rounded-md bg-primary-100 text-primary-700 shrink-0">
                    <i className={`${reason.icon} text-xl`}></i>
                  </span>
                  <div>
                    <h3 className="font-heading text-base md:text-lg font-semibold text-foreground-950">
                      {reason.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-foreground-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}