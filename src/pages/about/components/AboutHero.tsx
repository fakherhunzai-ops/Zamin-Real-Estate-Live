import Breadcrumbs from '@/components/base/Breadcrumbs';
import Button from '@/components/base/Button';
import { SITE } from '@/utils/site';

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://readdy.ai/api/search-image?query=Wide%20cinematic%20view%20of%20Gilgit%20Baltistan%20mountain%20valleys%20with%20green%20terraced%20fields%20and%20scattered%20stone%20villages%20under%20soft%20afternoon%20light%2C%20serene%20premium%20landscape%20photography&width=1600&height=600&seq=zamin-about-hero&orientation=landscape"
          alt=""
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
        <div className="mt-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
            <i className="ri-award-line text-accent-400"></i>
            Since {SITE.founded} · Local &amp; Trusted
          </span>
          <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
            Rooted in Gilgit-Baltistan, Committed to Your Property Goals
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-background-300 md:text-base">
            Zamin Real Estate &amp; Rentals is a local agency built on genuine knowledge of Hunza,
            Gilgit, Skardu, Nagar, Ghizer and Chilas — helping families, landlords and investors buy,
            sell and rent with confidence.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button to="/contact" variant="light" size="lg" icon="ri-customer-service-2-line">
              Talk to Our Team
            </Button>
            <Button to="/properties-for-sale" variant="outlineLight" size="lg">
              Explore Properties
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}