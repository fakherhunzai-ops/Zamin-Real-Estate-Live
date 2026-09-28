import { useMemo, useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import Button from '@/components/base/Button';
import ConsultCTA from '@/components/base/ConsultCTA';
import { faqs, faqCategories } from '@/mocks/faqs';
import { SITE } from '@/utils/site';

export default function FaqPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = category === 'All' || faq.category === category;
      const matchesQuery =
        !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const categories = ['All', ...faqCategories];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://readdy.ai/api/search-image?query=Calm%20minimal%20mountain%20valley%20in%20Gilgit%20Baltistan%20Pakistan%20with%20soft%20morning%20mist%20and%20green%20fields%2C%20serene%20muted%20tones%2C%20cinematic%20wide%20landscape%20photography&width=1600&height=600&seq=zamin-faq-hero&orientation=landscape"
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumbs light items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
            <div className="mt-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
                <i className="ri-question-line text-accent-400"></i>
                Help Centre
              </span>
              <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-background-300 md:text-base">
                Buying, selling, renting, commission, verification and documentation — find clear
                answers to the questions our clients ask most.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-foreground-400">
                <i className="ri-search-line text-lg"></i>
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions, e.g. commission, documents, renting…"
                aria-label="Search frequently asked questions"
                className="w-full rounded-md border border-background-300 bg-background-50 py-3.5 pl-11 pr-4 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary-800 text-background-50'
                        : 'border border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-primary-700'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-sm text-foreground-500">
              {filtered.length} {filtered.length === 1 ? 'question' : 'questions'} found
            </p>

            {filtered.length === 0 ? (
              <div className="mt-4 rounded-card border border-background-200 bg-background-50 p-10 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                  <i className="ri-search-eye-line text-2xl"></i>
                </span>
                <h2 className="mt-4 font-heading text-xl font-semibold text-foreground-950">
                  No matching questions
                </h2>
                <p className="mt-2 text-sm text-foreground-600">
                  Try a different keyword or choose another category.
                </p>
                <div className="mt-5 flex justify-center">
                  <Button
                    onClick={() => {
                      setQuery('');
                      setCategory('All');
                    }}
                    icon="ri-refresh-line"
                  >
                    Reset Search
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {filtered.map((faq) => {
                  const open = openId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="overflow-hidden rounded-card border border-background-200 bg-background-50"
                    >
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpenId(open ? null : faq.id)}
                          aria-expanded={open}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold uppercase tracking-wide text-accent-600">
                              {faq.category}
                            </span>
                            <span className="font-heading text-base font-semibold text-foreground-950 md:text-lg">
                              {faq.question}
                            </span>
                          </span>
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
                              open ? 'bg-primary-800 text-background-50' : 'bg-background-100 text-foreground-700'
                            }`}
                          >
                            <i className={`${open ? 'ri-subtract-line' : 'ri-add-line'} text-lg`}></i>
                          </span>
                        </button>
                      </h3>
                      {open && (
                        <div className="border-t border-background-200 px-5 pb-5 pt-4">
                          <p className="text-sm leading-relaxed text-foreground-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <ConsultCTA
          eyebrow="Need More Help?"
          eyebrowIcon="ri-customer-service-2-line"
          title="Still Have Questions?"
          description="Our team is happy to help with anything about buying, selling, renting or investing in Gilgit-Baltistan property."
          primary={{ label: 'Contact Our Team', to: '/contact', icon: 'ri-mail-send-line' }}
          secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
        />
      </main>
      <Footer />
    </>
  );
}