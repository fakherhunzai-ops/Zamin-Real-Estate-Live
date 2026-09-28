import { Link } from 'react-router-dom';
import { useShortlist } from '@/hooks/useShortlist';

/**
 * Navbar entry point for saved (shortlisted) properties, with a live count badge.
 */
export default function ShortlistLink({ className = '' }: { className?: string }) {
  const { count } = useShortlist();

  return (
    <Link
      to="/shortlist"
      aria-label={count > 0 ? `Saved properties (${count})` : 'Saved properties'}
      className={`relative hidden h-10 w-10 items-center justify-center rounded-full text-foreground-700 transition-colors hover:bg-primary-50 hover:text-primary-700 sm:flex ${className}`.trim()}
    >
      <i className="ri-heart-3-line text-lg"></i>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold leading-none text-background-50">
          {count}
        </span>
      )}
    </Link>
  );
}