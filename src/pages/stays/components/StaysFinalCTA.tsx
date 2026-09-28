import { Link } from 'react-router-dom';
import { SITE } from '@/utils/site';

export default function StaysFinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=Serene%20wide%20mountain%20valley%20in%20Gilgit-Baltistan%20Pakistan%20at%20dusk%2C%20soft%20purple%20and%20amber%20sky%20over%20snow%20capped%20peaks%20and%20a%20quiet%20village%20with%20warm%20glowing%20windows%2C%20calm%20atmospheric%20travel%20photography%20with%20dark%20tones%20for%20text%20contrast&width=1920&height=900&seq=stays-cta-gb-v1&orientation=landscape"
          alt="Evening in a Gilgit-Baltistan mountain valley"
          title="Plan your ZAMIN stay in Gilgit-Baltistan"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-950/75 to-primary-950/60"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50 backdrop-blur-sm md:text-sm">
            <i className="ri-compass-3-line text-accent-400"></i>
            Hunza · Gojal · Skardu · Naltar · Ghizer
          </span>
          <h2 className="mt-5 font-heading text-3xl font-bold leading-tight text-white md:text-5xl">
            Your next stay in Gilgit-Baltistan starts here
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-background-200 md:text-lg">
            Tell us where you want to go and how you like to travel. Our local team will match you
            with the right verified stay — or help you list your own.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-background-50 px-6 py-3.5 text-sm font-semibold text-primary-800 transition-colors hover:bg-background-100 sm:w-auto"
            >
              <i className="ri-send-plane-line text-base"></i>
              Plan My Stay
            </Link>
            <Link
              to="/stays/host"
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-background-50/50 px-6 py-3.5 text-sm font-semibold text-background-50 transition-colors hover:bg-background-50 hover:text-primary-800 sm:w-auto"
            >
              <i className="ri-home-gear-line text-base"></i>
              List Your Property
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-background-300">
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-2 transition-colors hover:text-background-50"
            >
              <i className="ri-phone-line text-accent-400"></i>
              {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-background-50"
            >
              <i className="ri-whatsapp-line text-accent-400"></i>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}