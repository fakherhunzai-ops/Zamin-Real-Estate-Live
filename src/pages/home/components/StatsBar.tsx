const stats = [
  { value: '500+', label: 'Properties Sold', icon: 'ri-home-heart-line' },
  { value: '98%', label: 'Client Satisfaction', icon: 'ri-emotion-happy-line' },
  { value: '20+', label: 'Years of Combined Experience', icon: 'ri-award-line' },
  { value: '6', label: 'Areas Covered', icon: 'ri-map-2-line' },
];

export default function StatsBar() {
  return (
    <section className="bg-background-50 border-b border-background-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center md:items-start md:text-left ${
                index !== 0 ? 'md:border-l md:border-background-200 md:pl-8' : ''
              }`}
            >
              <span className="w-10 h-10 flex items-center justify-center rounded-md bg-primary-50 text-primary-700">
                <i className={`${stat.icon} text-xl`}></i>
              </span>
              <div className="mt-3 font-heading text-3xl md:text-4xl font-bold text-primary-800">
                {stat.value}
              </div>
              <div className="mt-1 text-xs md:text-sm text-foreground-600 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}