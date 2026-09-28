import { Link } from 'react-router-dom';

export type Crumb = { label: string; to?: string };

export default function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className={`transition-colors ${
                    light
                      ? 'text-background-300 hover:text-accent-300'
                      : 'text-foreground-500 hover:text-primary-700'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={light ? 'text-background-100 font-medium' : 'text-foreground-900 font-medium'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className={`w-4 h-4 flex items-center justify-center ${light ? 'text-background-400' : 'text-foreground-300'}`}>
                  <i className="ri-arrow-right-s-line text-sm"></i>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}