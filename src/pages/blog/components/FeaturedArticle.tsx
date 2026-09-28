import { Link } from 'react-router-dom';
import type { BlogArticle } from '@/mocks/blog';

export default function FeaturedArticle({ article }: { article: BlogArticle }) {
  return (
    <article className="group grid grid-cols-1 overflow-hidden rounded-card border border-background-200 bg-background-50 lg:grid-cols-2">
      <Link
        to={`/blog/${article.slug}`}
        className="block h-64 w-full overflow-hidden lg:h-full"
        aria-label={`Read ${article.title}`}
      >
        <img
          src={article.image}
          alt={article.title}
          title={`${article.title} | Zamin Real Estate`}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-col justify-center p-6 md:p-10">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-700">
          <i className="ri-star-smile-line"></i>
          Featured Guide
        </span>
        <h2 className="mt-4 font-heading text-2xl font-bold leading-tight text-foreground-950 md:text-3xl">
          <Link to={`/blog/${article.slug}`} className="transition-colors hover:text-primary-700">
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground-600 md:text-base">
          {article.excerpt}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-500">
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-user-3-line"></i>
            {article.author} · {article.role}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-time-line"></i>
            {article.readTime}
          </span>
        </div>
        <div className="mt-6">
          <Link
            to={`/blog/${article.slug}`}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
          >
            Read the guide
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </article>
  );
}