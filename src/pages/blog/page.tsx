import { useMemo, useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import ConsultCTA from '@/components/base/ConsultCTA';
import PropertyAlertsBand from '@/components/feature/PropertyAlertsBand';
import { SITE } from '@/utils/site';
import { blogArticles } from '@/mocks/blog';
import type { BlogCategory } from '@/mocks/blog';
import BlogHero from './components/BlogHero';
import FeaturedArticle from './components/FeaturedArticle';
import BlogFilters from './components/BlogFilters';
import ArticleCard from './components/ArticleCard';

type Filter = 'All' | BlogCategory;

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Filter>('All');

  const featured = blogArticles.find((article) => article.featured);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogArticles.filter((article) => {
      const matchesCategory = category === 'All' || article.category === category;
      const matchesQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const showFeatured = category === 'All' && !query.trim() && featured;
  const gridArticles = showFeatured
    ? filtered.filter((article) => article.slug !== featured!.slug)
    : filtered;

  const reset = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <BlogHero />

        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <BlogFilters
              query={query}
              onQuery={setQuery}
              category={category}
              onCategory={setCategory}
            />

            {showFeatured && (
              <div className="mt-8">
                <FeaturedArticle article={featured!} />
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-4">
              <h2 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">
                {category === 'All' ? 'Latest Articles' : `${category} Articles`}
              </h2>
              <span className="text-sm text-foreground-500">
                {gridArticles.length} {gridArticles.length === 1 ? 'article' : 'articles'}
              </span>
            </div>

            {gridArticles.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridArticles.map((article, index) => (
                  <ArticleCard key={article.slug} article={article} index={index} />
                ))}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center rounded-card border border-background-200 bg-background-50 px-6 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background-100 text-foreground-400">
                  <i className="ri-file-search-line text-2xl"></i>
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground-950">
                  No articles found
                </h3>
                <p className="mt-2 max-w-sm text-sm text-foreground-600">
                  We couldn&apos;t find anything matching your search. Try a different keyword or
                  reset the filters.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
                >
                  <i className="ri-refresh-line"></i>
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>

        <PropertyAlertsBand />

        <ConsultCTA
          eyebrow="Need Local Advice?"
          eyebrowIcon="ri-customer-service-2-line"
          title="Have a Question About the Market?"
          description="Reading is a great start — talking to someone who knows the ground is better. Our Gilgit-Baltistan advisers are happy to help with no obligation."
          primary={{ label: 'Talk to Our Team', to: '/contact', icon: 'ri-chat-3-line' }}
          secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
        />
      </main>
      <Footer />
    </>
  );
}