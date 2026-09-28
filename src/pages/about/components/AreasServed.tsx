import { Link } from 'react-router-dom';
import SectionHeading from '@/components/base/SectionHeading';
import { areas } from '@/mocks/locations';

export default function AreasServed() {
  return (
    <section className="bg-background-100 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Where We Work"
          eyebrowIcon="ri-road-map-line"
          title="Areas We Serve"
          description="From the orchards of Hunza to the lakes of Skardu, our advisers cover Gilgit-Baltistan's most sought-after valleys and communities."
          align="center"
          className="max-w-2xl"
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Link
              key={area.id}
              to={`/properties-for-sale?location=${area.name}`}
              className="group relative block h-56 overflow-hidden rounded-card border border-background-200 cursor-pointer"
            >
              <img
                src={area.image}
                alt={`Property in ${area.name}, Gilgit-Baltistan`}
                title={`Properties in ${area.name}`}
                className="absolute inset-0 h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/30 to-transparent"></div>
              <div className="relative z-10 flex h-full flex-col justify-end p-5">
                <h3 className="font-heading text-xl font-bold text-white">{area.name}</h3>
                <p className="mt-0.5 text-sm text-background-300">{area.tagline}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-background-50">
                  <i className="ri-home-smile-line"></i>
                  {area.propertyCount} properties available
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}