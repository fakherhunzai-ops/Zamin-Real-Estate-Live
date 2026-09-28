import type { BlogCategory } from '@/mocks/blog';
import { blogCategories } from '@/mocks/blog';

type Filter = 'All' | BlogCategory;

type Props = {
  query: string;
  onQuery: (value: string) => void;
  category: Filter;
  onCategory: (value: Filter) => void;
};

const tabs: Filter[] = ['All', ...blogCategories];

export default function BlogFilters({ query, onQuery, category, onCategory }: Props) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2 rounded-full bg-background-100 p-1">
        {tabs.map((tab) => {
          const active = category === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onCategory(tab)}
              aria-pressed={active}
              className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-primary-800 text-background-50'
                  : 'text-foreground-700 hover:bg-background-50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="relative w-full lg:w-80">
        <span className="absolute left-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-foreground-400">
          <i className="ri-search-line text-base"></i>
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search articles…"
          aria-label="Search articles"
          className="w-full rounded-full border border-background-200 bg-background-50 py-2.5 pl-11 pr-4 text-sm text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none"
        />
      </div>
    </div>
  );
}