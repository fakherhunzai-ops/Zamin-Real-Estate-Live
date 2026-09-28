import Button from '@/components/base/Button';

export default function FinalCTA() {
  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-card bg-primary-900 px-6 py-12 md:px-14 md:py-16">
          <div className="absolute inset-0 opacity-[0.14]">
            <img
              src="https://readdy.ai/api/search-image?query=Soft%20abstract%20artistic%20background%20of%20layered%20mountain%20silhouettes%20in%20deep%20forest%20green%20and%20warm%20gold%20tones%2C%20minimal%20elegant%20gradient%2C%20subtle%20texture%2C%20clean%20modern%20premium%20aesthetic&width=1600&height=700&seq=zamin-cta-premium&orientation=landscape&nocache=true"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-white leading-tight">
                Thinking About Selling or Renting Your Property?
              </h2>
              <p className="mt-3 text-background-200 max-w-xl leading-relaxed">
                Get a free professional valuation and reach thousands of qualified buyers and tenants
                across Gilgit-Baltistan. Transparent commission, expert support, no obligation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button to="/valuation" variant="light" size="lg" iconRight="ri-arrow-right-line">
                Get a Free Valuation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}