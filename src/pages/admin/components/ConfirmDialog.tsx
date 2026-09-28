import type { ReactNode } from 'react';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  busy = false,
  onConfirm,
  onCancel,
  children,
}: {
  open: boolean;
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'accent';
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}) {
  if (!open) return null;

  const confirmClass =
    tone === 'accent'
      ? 'bg-accent-500 text-background-50 hover:bg-accent-600 dark:text-foreground-950'
      : 'bg-primary-800 text-background-50 hover:bg-primary-900 dark:text-foreground-950';

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-foreground-950/50 px-4">
      <div className="w-full max-w-md rounded-card border border-background-200 bg-background-50 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-100 text-accent-800">
            <i className="ri-alert-line text-xl"></i>
          </span>
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-semibold text-foreground-950">{title}</h2>
            {message && <div className="mt-2 text-sm text-foreground-600">{message}</div>}
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex cursor-pointer items-center whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${confirmClass}`}
          >
            {busy && <i className="ri-loader-4-line animate-spin"></i>}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}