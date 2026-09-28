import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'gold' | 'outline' | 'outlineLight' | 'light' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary-800 text-background-50 hover:bg-primary-900 dark:text-foreground-950',
  gold: 'bg-primary-700 text-background-50 hover:bg-primary-800 dark:text-foreground-950',
  outline: 'border border-primary-300 text-primary-700 hover:bg-primary-50',
  outlineLight:
    'border border-background-50/40 bg-transparent text-background-50 hover:bg-background-50/10 hover:text-background-50',
  light: 'bg-background-50 text-primary-800 hover:bg-background-100',
  ghost: 'text-primary-700 hover:bg-primary-50',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: string;
  iconRight?: string;
  to?: string;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconRight,
  to,
  href,
  type = 'button',
  disabled = false,
  onClick,
  ariaLabel,
}: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {icon && (
        <span className="w-4 h-4 flex items-center justify-center">
          <i className={`${icon} text-base`}></i>
        </span>
      )}
      {children}
      {iconRight && (
        <span className="w-4 h-4 flex items-center justify-center">
          <i className={`${iconRight} text-base`}></i>
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}