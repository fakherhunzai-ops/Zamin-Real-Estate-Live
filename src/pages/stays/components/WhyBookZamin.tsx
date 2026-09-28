import SectionHeading from '@/components/base/SectionHeading';

const REASONS = [
  {
    icon: 'ri-shield-check-line',
    title: 'Verified local properties',
    text: 'Every stay is reviewed by our Gilgit-Baltistan team — real photos, real locations, no surprises on arrival.',
  },
  {
    icon: 'ri-map-pin-user-line',
    title: 'Local hosts & local support',
    text: 'We live here. Our team knows each valley and is on hand before, during and after your stay.',
  },
  {
    icon: 'ri-hand-coin-line',
    title: 'Direct bookings, fair pricing',
    text: 'Book straight with ZAMIN — no inflated third-party markups, with pricing shown clearly per night.',
  },
  {
    icon: 'ri-home-heart-line',
    title: 'Managed hosting',
    text: 'Owners who prefer a hands-off approach can let ZAMIN run the entire short-term operation.',
  },
  {
    icon: 'ri-landscape-line',
    title: 'Built for the mountains',
    text: 'Heating, hot water, backup power and check-in times designed for high-altitude travel.',
  },
  {
    icon: 'ri-customer-service-2-line',
    title: 'Guest support that answers',
    text: 'A real person on WhatsApp for check-in help, directions and any issue during your stay.',
  },
];

export default function WhyBookZamin() {
  return (
    <section className="bg-background-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Why book with ZAMIN"
          eyebrowIcon="ri-medal-line"
          title="Travel with People Who Know the Ground"
          description="ZAMIN Stays isn't a faceless global marketplace — it's a Gilgit-Baltistan platform built on local knowledge and verified, inspected stays."
          align="center"
          className="max-w-2xl"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {REASONS.map((reason) => (
            <article
              key={reason.title}
              className="rounded-card border border-background-200 bg-background-50 p-6 transition-colors hover:border-primary-300"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                <i className={`${reason.icon} text-2xl`}></i>
              </span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground-950">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-600">{reason.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}