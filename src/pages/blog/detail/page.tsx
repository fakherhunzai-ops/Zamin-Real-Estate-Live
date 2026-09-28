import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Breadcrumbs from '@/components/base/Breadcrumbs';
import ConsultCTA from '@/components/base/ConsultCTA';
import { SITE } from '@/utils/site';
import { blogArticles } from '@/mocks/blog';
import ArticleCard from '@/pages/blog/components/ArticleCard';
import ArticleBody from './components/ArticleBody';
import ArticleSidebar from './components/ArticleSidebar';
import ReadingProgress from './components/ReadingProgress';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const article = blogArticles.find((item) => item.slug === slug);

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-background-100 px-4 py-32 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background-200 text-foreground-600">
            <i className="ri-file-unknow-line text-3xl"></i>
          </span>
          <h1 className="mt-6 font-heading text-2xl font-bold text-foreground-950 md:text-4xl">
            Article not found
          </h1>
          <p className="mt-3 max-w-md text-foreground-600">
            The article you&apos;re looking for may have been moved or is no longer available.
          </p>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-3 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
          >
            <i className="ri-arrow-left-line"></i>
            Back to Blog &amp; Resources
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const related = blogArticles
    .filter((item) => item.category === article.category && item.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <ReadingProgress targetId="article-body" />
      <main className="min-h-screen bg-background-100">
        <section className="relative overflow-hidden bg-primary-800 pb-12 pt-24 md:pb-16 md:pt-28">
          <div className="absolute inset-0 opacity-10">
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 md:px-6">
            <Breadcrumbs
              light
              items={[
                { label: 'Home', to: '/' },
                { label: 'Blog', to: '/blog' },
                { label: article.category, to: '/blog' },
              ]}
            />
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-background-50/25 bg-background-50/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-background-50">
              <i className="ri-price-tag-3-line text-accent-400"></i>
              {article.category}
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-background-50 md:text-5xl">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-background-300">
              <span className="inline-flex items-center gap-2">
                <i className="ri-user-3-line"></i>
                {article.author} · {article.role}
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="ri-calendar-line"></i>
                {article.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <i className="ri-time-line"></i>
                {article.readTime}
              </span>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
              <article id="article-body">
                <div className="h-64 w-full overflow-hidden rounded-card border border-background-200 md:h-[420px]">
                  <img
                    src={article.image}
                    alt={article.title}
                    title={`${article.title} | Zamin Real Estate`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <div className="mt-8 rounded-card border border-background-200 bg-background-50 p-6 md:p-10">
                  <p className="font-heading text-lg leading-relaxed text-foreground-900 md:text-xl">
                    {article.excerpt}
                  </p>
                  <div className="my-6 border-t border-background-100" />
                  <ArticleBody blocks={article.content} />
                </div>

                <div className="mt-6">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
                  >
                    <i className="ri-arrow-left-line"></i>
                    Back to Blog &amp; Resources
                  </Link>
                </div>
              </article>

              <ArticleSidebar article={article} blocks={article.content} />
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="bg-background-50 py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
              <h2 className="font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
                More {article.category} Articles
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <ArticleCard key={item.slug} article={item} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        <ConsultCTA
          eyebrow="Ready to Take the Next Step?"
          eyebrowIcon="ri-customer-service-2-line"
          title="Speak With a Property Consultant"
          description="Tell us what you need — buying, selling, renting, valuation or investment — and a Zamin adviser will guide you with no obligation."
          primary={{ label: 'Talk to a Consultant', to: '/contact', icon: 'ri-chat-3-line' }}
          secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
        />
      </main>
      <Footer />
    </>
  );
}