const pillars = [
  {
    id: 'mission',
    icon: 'ri-focus-3-line',
    title: 'Our Mission',
    text: 'To make buying, selling and renting property in Gilgit-Baltistan simple, transparent and genuinely trustworthy — guiding every client with honest advice and local insight.',
  },
  {
    id: 'vision',
    icon: 'ri-eye-line',
    title: 'Our Vision',
    text: 'To be the region’s most trusted property partner, connecting local families and the diaspora with the right homes and investments as Gilgit-Baltistan grows.',
  },
];

const values = [
  { icon: 'ri-shield-check-line', title: 'Integrity First', text: 'Honest valuations, verified listings and no hidden fees.' },
  { icon: 'ri-map-pin-user-line', title: 'Local Knowledge', text: 'Real expertise across the valleys we call home.' },
  { icon: 'ri-user-heart-line', title: 'Client Care', text: 'A dedicated adviser who treats your goals as their own.' },
  { icon: 'ri-scales-3-line', title: 'Transparency', text: 'Clear pricing and plain answers at every step.' },
];

export default function MissionVision() {
  return (
    <section className="bg-background-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="flex flex-col rounded-card border border-background-200 bg-background-50 p-6 md:p-8"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-primary-800 text-background-50">
                <i className={`${pillar.icon} text-2xl`}></i>
              </span>
              <h2 className="mt-5 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col rounded-card border border-background-200 bg-background-50 p-6"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-secondary-100 text-secondary-900">
                <i className={`${value.icon} text-2xl`}></i>
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">
                {value.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground-600">{value.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}