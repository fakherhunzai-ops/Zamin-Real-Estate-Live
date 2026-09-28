import type { ReactNode } from 'react';
import { STATUS_META, BOOKING_STATUS_META, MANAGEMENT_META } from '@/utils/stays';
import type { BookingStatus, ManagementType, StayStatus } from '@/types/stays';

/* ---------------------------------------------------------------- primitives */

export function Spinner({ className = 'text-2xl' }: { className?: string }) {
  return <i className={`ri-loader-4-line animate-spin ${className}`}></i>;
}

export function LoadingBlock({ label = 'Loading…', rows }: { label?: string; rows?: number }) {
  if (rows && rows > 0) {
    return (
      <div className="divide-y divide-background-100 rounded-card border border-background-200 bg-background-50">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 w-4 animate-pulse rounded bg-background-200" />
            <div className="h-4 flex-1 animate-pulse rounded bg-background-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-background-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-background-200" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 rounded-card border border-background-200 bg-background-50 py-16 text-foreground-500">
      <Spinner />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function Card({
  title,
  icon,
  actions,
  children,
  className = '',
  bodyClassName = '',
}: {
  title?: string;
  icon?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`rounded-card border border-background-200 bg-background-50 ${className}`}>
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-100 px-5 py-4">
          <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-foreground-950">
            {icon && (
              <span className="flex h-5 w-5 items-center justify-center text-accent-600">
                <i className={`${icon} text-lg`}></i>
              </span>
            )}
            {title}
          </h2>
          {actions}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export function SectionLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500 ${className}`}>
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------- badges */

type Tone = 'neutral' | 'primary' | 'accent' | 'secondary' | 'solid' | 'urgent' | 'muted' | 'outline';

const TONES: Record<Tone, string> = {
  neutral: 'bg-background-200 text-foreground-800',
  primary: 'bg-primary-100 text-primary-800',
  accent: 'bg-accent-100 text-accent-900',
  secondary: 'bg-secondary-100 text-secondary-900',
  solid: 'bg-primary-800 text-background-50 dark:text-foreground-950',
  urgent: 'bg-accent-500 text-background-50 dark:text-foreground-950',
  muted: 'bg-background-200 text-foreground-600',
  outline: 'border border-background-300 text-foreground-700',
};

export function Badge({
  children,
  tone = 'neutral',
  icon,
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${TONES[tone]} ${className}`}
    >
      {icon && <i className={icon}></i>}
      {children}
    </span>
  );
}

export function StayStatusBadge({ status }: { status: StayStatus }) {
  const meta = STATUS_META[status];
  const tone: Tone =
    status === 'PUBLISHED'
      ? 'primary'
      : status === 'VERIFIED'
        ? 'accent'
        : status === 'PENDING'
          ? 'secondary'
          : status === 'DRAFT'
            ? 'neutral'
            : 'muted';
  return (
    <Badge tone={tone} icon={meta.icon}>
      {meta.label}
    </Badge>
  );
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const meta = BOOKING_STATUS_META[status];
  const tone: Tone =
    status === 'CONFIRMED' || status === 'CHECKED_IN'
      ? 'primary'
      : status === 'AWAITING_PAYMENT'
        ? 'accent'
        : status === 'PENDING'
          ? 'secondary'
          : 'muted';
  return (
    <Badge tone={tone} icon={meta.icon}>
      {meta.label}
    </Badge>
  );
}

export function ManagementBadge({ type }: { type: ManagementType }) {
  const meta = MANAGEMENT_META[type];
  return (
    <Badge tone={type === 'MANAGED' ? 'solid' : 'outline'} icon={type === 'MANAGED' ? 'ri-vip-diamond-line' : 'ri-user-line'}>
      {meta.label}
    </Badge>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return <span className="text-xs text-foreground-400">—</span>;
  return (
    <Badge tone="accent" icon="ri-shield-check-fill">
      Verified
    </Badge>
  );
}

/* --------------------------------------------------------------- stat cards */

export function StatCard({
  label,
  value,
  icon,
  hint,
  tone = 'default',
}: {
  label: string;
  value: ReactNode;
  icon: string;
  hint?: ReactNode;
  tone?: 'default' | 'accent' | 'primary';
}) {
  const iconWrap =
    tone === 'accent'
      ? 'bg-accent-100 text-accent-800'
      : tone === 'primary'
        ? 'bg-primary-100 text-primary-800'
        : 'bg-background-100 text-foreground-600';
  return (
    <div className="flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground-500">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-md ${iconWrap}`}>
          <i className={`${icon} text-base`}></i>
        </span>
      </div>
      <p className="font-heading text-2xl font-bold leading-none text-foreground-950">{value}</p>
      {hint && <p className="text-xs text-foreground-500">{hint}</p>}
    </div>
  );
}

/* ------------------------------------------------------------- empty/error */

export function EmptyState({
  icon,
  title,
  message,
  action,
  compact = false,
}: {
  icon: string;
  title: string;
  message?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-card border border-dashed border-background-300 bg-background-50 text-center ${
        compact ? 'gap-2 px-4 py-10' : 'gap-3 px-6 py-16'
      }`}
    >
      <span className="flex h-14 w-14 items-center justify-center text-background-400">
        <i className={`${icon} text-4xl`}></i>
      </span>
      <h3 className="font-heading text-base font-semibold text-foreground-950">{title}</h3>
      {message && <p className="max-w-md text-sm text-foreground-600">{message}</p>}
      {action && <div className="mt-1 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-background-200 bg-background-50 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center text-primary-700">
        <i className="ri-error-warning-line text-3xl"></i>
      </span>
      <p className="text-sm text-foreground-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 dark:text-foreground-950"
        >
          <i className="ri-refresh-line text-base"></i> Retry
        </button>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------- tabs */

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-background-200">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-accent-600 text-foreground-950'
                : 'border-transparent text-foreground-500 hover:text-foreground-800'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${isActive ? 'bg-primary-100 text-primary-800' : 'bg-background-200 text-foreground-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; icon?: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex gap-1 rounded-full border border-background-300 bg-background-50 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            value === option.value ? 'bg-primary-800 text-background-50 dark:text-foreground-950' : 'text-foreground-700 hover:bg-background-100'
          }`}
        >
          {option.icon && <i className={`${option.icon} text-base`}></i>}
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- pagination */

export function Pagination({
  page,
  pageCount,
  onPage,
  total,
}: {
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
  total?: number;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-background-100 px-4 py-3">
      <p className="text-xs text-foreground-500">
        Page {page} of {pageCount}
        {typeof total === 'number' && ` · ${total} total`}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border border-background-300 px-3 py-1.5 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i className="ri-arrow-left-s-line"></i> Prev
        </button>
        <button
          type="button"
          onClick={() => onPage(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border border-background-300 px-3 py-1.5 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ helpers */

export const inputClass =
  'w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none';
export const selectClass = `cursor-pointer ${inputClass}`;
export const labelClass = 'text-xs font-semibold uppercase tracking-wide text-foreground-600';
export const thClass = 'px-4 py-3 font-semibold whitespace-nowrap';
export const tdClass = 'px-4 py-3 align-top';
export const btnPrimary =
  'inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-foreground-950';
export const btnGhost =
  'inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100 disabled:cursor-not-allowed disabled:opacity-60';
export const btnSmall =
  'inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';
export const tableWrap = 'overflow-x-auto rounded-card border border-background-200 bg-background-50';
export const theadClass = 'bg-background-100 text-left text-xs uppercase tracking-wide text-foreground-600';