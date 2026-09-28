import { Link } from 'react-router-dom';
import SectionHeading from '@/components/base/SectionHeading';
import { services } from '@/mocks/services';

const homeServices = services.slice(0, 5);

const linkFor = (id: string) => (id === 'property-valuation' ? '/valuation' : `/services#${id}`);

export default function Services() {
  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="What We Do"
          eyebrowIcon="ri-grid-line"
          title="Our Services"
          description="One trusted partner for buying, selling, renting and investing in property across Gilgit-Baltistan."
          align="center"
          className="max-w-2xl"
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {homeServices.map((service) => (
            <Link
              key={service.id}
              to={linkFor(service.id)}
              className="group flex flex-col rounded-card border border-background-200 bg-background-50 p-6 hover:-translate-y-1 hover:border-primary-300 transition-all duration-300"
            >
              <span className="w-14 h-14 flex items-center justify-center rounded-md bg-primary-50 text-primary-700 group-hover:bg-primary-800 group-hover:text-background-50 transition-colors">
                <i className={`${service.icon} text-2xl`}></i>
              </span>
              <h3 className="mt-5 font-heading text-lg md:text-xl font-semibold text-foreground-950">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-600 leading-relaxed flex-1">
                {service.short}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:text-primary-900 transition-colors">
                Learn more
                <i className="ri-arrow-right-line"></i>
              </span>
            </Link>
          ))}

          <div className="flex flex-col items-start justify-center rounded-card bg-primary-700 p-6 md:p-8">
            <span className="w-14 h-14 flex items-center justify-center rounded-md bg-background-50/10 text-accent-400">
              <i className="ri-customer-service-2-line text-2xl"></i>
            </span>
            <h3 className="mt-5 font-heading text-lg md:text-xl font-semibold text-background-50">
              Not sure where to start?
            </h3>
            <p className="mt-2 text-sm text-background-300 leading-relaxed">
              Tell us what you need and we&apos;ll point you in the right direction — free of charge.
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-400 hover:text-accent-300 transition-colors"
            >
              Speak with a consultant
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}