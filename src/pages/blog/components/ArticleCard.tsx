import { Link } from 'react-router-dom';
import type { BlogArticle } from '@/mocks/blog';

const DELAYS = ['animate-fade-up-delay-1', 'animate-fade-up-delay-2', 'animate-fade-up-delay-3'];

export default function ArticleCard({
  article,
  index = 0,
}: {
  article: BlogArticle;
  index?: number;
}) {
  const delay = DELAYS[index % DELAYS.length];

  return (
    <article
      className={`animate-fade-up ${delay} group flex flex-col overflow-hidden rounded-card border border-background-200 bg-background-50 transition-all duration-300 hover:-translate-y-1 hover:border-primary-300`}
    >
      <Link
        to={`/blog/${article.slug}`}
        className="block h-52 w-full overflow-hidden"
        aria-label={`Read ${article.title}`}
      >
        <img
          src={article.image}
          alt={article.title}
          title={`${article.title} | Zamin Real Estate`}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-secondary-900">
          {article.category}
        </span>
        <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-foreground-950">
          <Link to={`/blog/${article.slug}`} className="transition-colors hover:text-primary-700">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-600">{article.excerpt}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-background-100 pt-4 text-xs text-foreground-500">
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-user-3-line"></i>
            {article.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-calendar-line"></i>
            {article.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-time-line"></i>
            {article.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}