import { Link } from 'react-router-dom';

export default function ListPropertyCTA() {
  return (
    <section className="bg-background-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-lg bg-primary-700 px-6 py-12 md:px-12 md:py-16">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Soft%20abstract%20artistic%20background%20of%20layered%20mountain%20silhouettes%20at%20sunset%20in%20warm%20orange%20and%20deep%20blue%20tones%20minimal%20elegant%20gradient%20design%20subtle%20texture%20clean%20modern%20aesthetic&width=1200&height=600&seq=zamin-cta&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-background-50">
                Ready to Sell or Rent Your Property?
              </h2>
              <p className="mt-3 text-background-200 max-w-xl">
                Get a free professional valuation and reach thousands of qualified buyers and
                tenants across Gilgit-Baltistan. List your property with Zamin today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/sell-your-property"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-background-50 text-primary-900 px-6 py-3.5 text-sm font-semibold whitespace-nowrap hover:bg-background-100 transition-colors"
              >
                List Your Property
                <i className="ri-arrow-right-line"></i>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-background-50/40 text-background-50 px-6 py-3.5 text-sm font-semibold whitespace-nowrap hover:bg-background-50/10 transition-colors"
              >
                Talk to an Agent
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}