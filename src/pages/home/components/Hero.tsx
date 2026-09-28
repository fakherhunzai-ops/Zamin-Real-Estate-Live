import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="relative flex min-h-[640px] md:min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=Majestic%20wide%20view%20of%20Hunza%20Valley%20in%20Gilgit-Baltistan%20Pakistan%20at%20golden%20hour%2C%20snow%20capped%20Rakaposhi%20and%20Karakoram%20peaks%2C%20terraced%20green%20fields%20and%20a%20traditional%20stone%20village%2C%20dramatic%20soft%20clouds%2C%20rich%20warm%20cinematic%20landscape%20photography%2C%20deep%20shadows%20for%20text%20contrast%2C%20premium%20editorial%20quality&width=1920&height=1080&seq=zamin-hero-premium&orientation=landscape&nocache=true"
          alt="Panoramic view of Hunza Valley, Gilgit-Baltistan, Pakistan"
          title="Hunza Valley, Gilgit-Baltistan — find your place"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60"></div>
      </div>

      <div className="relative z-10 w-full px-4 md:px-6 pt-32 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-background-50/10 backdrop-blur-sm border border-background-50/25 px-4 py-1.5 text-xs md:text-sm font-semibold tracking-wide text-background-50 animate-fade-up">
            <i className="ri-shield-star-line text-accent-400"></i>
            Trusted Real Estate Across Gilgit-Baltistan
          </span>

          <h1 className="mt-6 font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white animate-fade-up animate-fade-up-delay-1">
            Find a Place You&apos;ll Be Proud to Call Home
          </h1>

          <p className="mt-5 text-sm md:text-lg text-background-200 max-w-2xl mx-auto leading-relaxed animate-fade-up animate-fade-up-delay-2">
            Buying, selling and renting property across Hunza, Gilgit, Skardu, Nagar, Ghizer and
            the surrounding valleys — with transparent pricing and genuine local expertise.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up animate-fade-up-delay-3">
            <Link
              to="/properties-for-sale"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary-800 text-background-50 px-6 py-3.5 text-sm font-semibold whitespace-nowrap hover:bg-primary-900 transition-colors"
            >
              Explore Properties
              <i className="ri-arrow-right-line"></i>
            </Link>
            <Link
              to="/sell-your-property"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-background-50/50 text-background-50 px-6 py-3.5 text-sm font-semibold whitespace-nowrap hover:bg-background-50 hover:text-primary-800 transition-colors"
            >
              <i className="ri-add-line"></i>
              List Your Property
            </Link>
          </div>
        </div>

        <SearchBar />
      </div>
    </section>
  );
}