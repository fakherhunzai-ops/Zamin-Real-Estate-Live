import { Link } from 'react-router-dom';
import { SITE } from '@/utils/site';

type Props = {
  title: string;
  message: string;
  onReset?: () => void;
  resetLabel?: string;
};

/**
 * Friendly confirmation panel shown in place of a form once it has been
 * submitted successfully. Gives the visitor a clear "done" moment plus
 * helpful next actions instead of a small inline notice.
 */
export default function FormSuccessPanel({ title, message, onReset, resetLabel = 'Send another' }: Props) {
  return (
    <div
      role="status"
      className="flex flex-col items-center rounded-card border border-primary-200 bg-background-50 px-6 py-10 text-center"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-700">
        <i className="ri-checkbox-circle-fill text-4xl"></i>
      </span>
      <h3 className="mt-5 font-heading text-xl font-bold text-foreground-950 md:text-2xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground-600">{message}</p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900"
          >
            <i className="ri-refresh-line text-base"></i>
            {resetLabel}
          </button>
        )}
        <a
          href={SITE.phoneHref}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-5 py-2.5 text-sm font-semibold text-foreground-800 transition-colors hover:border-primary-300 hover:text-primary-700"
        >
          <i className="ri-phone-line text-base"></i>
          Call Us
        </a>
        <Link
          to="/"
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-5 py-2.5 text-sm font-semibold text-foreground-800 transition-colors hover:border-primary-300 hover:text-primary-700"
        >
          <i className="ri-home-4-line text-base"></i>
          Back to Home
        </Link>
      </div>
    </div>
  );
}