import Breadcrumbs from '@/components/base/Breadcrumbs';

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://readdy.ai/api/search-image?query=Wide%20cinematic%20view%20of%20Gilgit%20Baltistan%20mountains%20at%20golden%20hour%20with%20layered%20green%20valleys%20and%20distant%20snow%20peaks%20under%20soft%20dramatic%20light%2C%20serene%20premium%20landscape%20photography%2C%20deep%20forest%20green%20and%20warm%20tones&width=1600&height=600&seq=zamin-blog-hero&orientation=landscape"
          alt=""
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'Blog & Resources' }]} />
        <div className="mt-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
            <i className="ri-article-line text-accent-400"></i>
            Guides, Insights &amp; Area Reports
          </span>
          <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
            Blog &amp; Resources
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-background-300 md:text-base">
            Practical guides on buying, selling and renting property in Gilgit-Baltistan, plus
            in-depth area reports on Hunza, Skardu, Gilgit and beyond — written by the team who
            lives and works here.
          </p>
        </div>
      </div>
    </section>
  );
}