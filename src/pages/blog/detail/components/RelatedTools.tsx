import { Link } from 'react-router-dom';
import { getRelatedTools, isFinanceArticle, type ToolArticle } from '@/utils/tools';

/**
 * Sidebar block that auto-suggests the most relevant free tools for an article.
 * Finance-related pieces always surface the mortgage calculator first.
 */
export default function RelatedTools({ article }: { article: ToolArticle }) {
  const related = getRelatedTools(article, 2);
  const finance = isFinanceArticle(article);

  if (related.length === 0) return null;

  return (
    <div className="rounded-card border border-primary-200 bg-primary-50 p-6">
      <h4 className="font-label text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
        Related tools
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-foreground-600">
        {finance
          ? 'Run the numbers mentioned in this article with our free calculators.'
          : 'Free calculators to help you plan your next move.'}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {related.map((tool) => (
          <Link
            key={tool.key}
            to={tool.href}
            className="group flex items-start gap-3 rounded-md border border-primary-200 bg-background-50 p-4 transition-colors hover:border-primary-300 hover:bg-background-100"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-800 text-background-50">
              <i className={`${tool.icon} text-lg`}></i>
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-foreground-950">{tool.name}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-foreground-600">
                {tool.short}
              </span>
            </span>
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center text-primary-700">
              <i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5"></i>
            </span>
          </Link>
        ))}
      </div>

      <Link
        to="/tools"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
      >
        See all free tools
        <i className="ri-arrow-right-line"></i>
      </Link>
    </div>
  );
}