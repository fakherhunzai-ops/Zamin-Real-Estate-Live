type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';

type Props = {
  count: number;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
  view: 'grid' | 'list';
  onViewChange: (value: 'grid' | 'list') => void;
  onOpenFilters: () => void;
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function ListingToolbar({
  count,
  sort,
  onSortChange,
  view,
  onViewChange,
  onOpenFilters,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-primary-300 px-3.5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 lg:hidden"
        >
          <i className="ri-equalizer-line text-base"></i>
          Filters
        </button>
        <p className="text-sm text-foreground-600">
          <span className="font-semibold text-foreground-950">{count}</span>{' '}
          {count === 1 ? 'property' : 'properties'} found
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <label className="flex items-center gap-2 text-sm text-foreground-600">
          <span className="hidden sm:inline">Sort by</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
            className="cursor-pointer rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-900 focus:border-primary-500 focus:outline-none"
            aria-label="Sort properties"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="hidden items-center gap-1 rounded-md border border-background-300 p-1 sm:flex">
          {(['grid', 'list'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewChange(mode)}
              aria-label={`${mode} view`}
              aria-pressed={view === mode}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors ${
                view === mode
                  ? 'bg-primary-800 text-background-50'
                  : 'text-foreground-600 hover:bg-background-100'
              }`}
            >
              <i className={`${mode === 'grid' ? 'ri-grid-fill' : 'ri-list-check-2'} text-base`}></i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}