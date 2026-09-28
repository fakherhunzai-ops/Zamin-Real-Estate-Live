import { useEffect, useState, type ReactNode } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import ConsultCTA from '@/components/base/ConsultCTA';
import { SITE } from '@/utils/site';

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type Props = {
  breadcrumbLabel: string;
  eyebrow: string;
  eyebrowIcon: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
};

const CONTENT_CLASS =
  'mt-4 flex flex-col gap-3 text-sm leading-relaxed text-foreground-600 ' +
  '[&_p]:m-0 [&_p]:leading-relaxed ' +
  '[&_a]:font-semibold [&_a]:text-primary-700 hover:[&_a]:underline ' +
  '[&_strong]:font-semibold [&_strong]:text-foreground-900 ' +
  '[&_ul]:mt-1 [&_ul]:space-y-2 ' +
  '[&_li]:relative [&_li]:pl-6 ' +
  '[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[7px] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-accent-500';

export default function LegalDoc({
  breadcrumbLabel,
  eyebrow,
  eyebrowIcon,
  title,
  intro,
  lastUpdated,
  sections,
}: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Serene%20minimalist%20mountain%20valley%20in%20Gilgit%20Baltistan%20Pakistan%20with%20soft%20morning%20mist%20and%20muted%20green%20terraced%20fields%2C%20calm%20understated%20cinematic%20wide%20landscape%20photography%20with%20gentle%20natural%20light&width=1600&height=600&seq=zamin-legal-hero&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: breadcrumbLabel }]} />
            <div className="mt-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
                <i className={`${eyebrowIcon} text-accent-400`}></i>
                {eyebrow}
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-background-300 md:text-base">{intro}</p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-background-50/10 px-3.5 py-1.5 text-xs font-medium text-background-200">
                <i className="ri-time-line"></i>
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
              <aside className="lg:col-span-3">
                <div className="lg:sticky lg:top-24">
                  <nav
                    aria-label="On this page"
                    className="rounded-card border border-background-200 bg-background-50 p-5"
                  >
                    <h2 className="flex items-center gap-2 font-label text-xs font-bold uppercase tracking-[0.18em] text-foreground-500">
                      <span className="flex h-4 w-4 items-center justify-center">
                        <i className="ri-list-check text-sm"></i>
                      </span>
                      On This Page
                    </h2>
                    <ol className="mt-4 flex flex-col gap-0.5">
                      {sections.map((section, index) => {
                        const active = activeId === section.id;
                        return (
                          <li key={section.id}>
                            <a
                              href={`#${section.id}`}
                              className={`flex items-start gap-2 rounded-md px-2.5 py-2 text-sm transition-colors ${
                                active
                                  ? 'bg-primary-50 font-semibold text-primary-700'
                                  : 'text-foreground-600 hover:bg-background-100 hover:text-foreground-900'
                              }`}
                            >
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-[11px] text-foreground-400">
                                {index + 1}
                              </span>
                              <span>{section.title}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ol>
                  </nav>
                </div>
              </aside>

              <div className="lg:col-span-9">
                <article className="rounded-card border border-background-200 bg-background-50 p-6 md:p-10">
                  <div className="flex flex-col gap-9">
                    {sections.map((section, index) => (
                      <section
                        key={section.id}
                        id={section.id}
                        className="scroll-mt-24 border-b border-background-100 pb-9 last:border-0 last:pb-0"
                      >
                        <h2 className="flex items-start gap-3 font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-100 font-label text-sm font-bold text-primary-700">
                            {index + 1}
                          </span>
                          <span>{section.title}</span>
                        </h2>
                        <div className={CONTENT_CLASS}>{section.content}</div>
                      </section>
                    ))}
                  </div>
                </article>

                <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-card border border-background-200 bg-background-50 p-6 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                      <i className="ri-customer-service-2-line text-xl"></i>
                    </span>
                    <div>
                      <h3 className="font-heading text-base font-semibold text-foreground-950">
                        Questions about this page?
                      </h3>
                      <p className="mt-0.5 text-sm text-foreground-600">
                        Our team is happy to explain anything you need in plain language.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={SITE.emailHref}
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-800 transition-colors hover:border-primary-300 hover:text-primary-700"
                    >
                      <i className="ri-mail-line"></i>
                      Email Us
                    </a>
                    <a
                      href={SITE.phoneHref}
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
                    >
                      <i className="ri-phone-line"></i>
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ConsultCTA
          eyebrow="Buy & Sell With Confidence"
          eyebrowIcon="ri-shield-check-line"
          title="Ready to Talk Property?"
          description="Whether you are buying, selling, renting or investing, our local advisers are here to help across Gilgit-Baltistan."
          primary={{ label: 'Contact Our Team', to: '/contact', icon: 'ri-chat-3-line' }}
          secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
        />
      </main>
      <Footer />
    </>
  );
}