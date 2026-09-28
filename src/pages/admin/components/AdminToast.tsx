import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ToastTone = 'success' | 'error' | 'info';

type Toast = { id: number; title: string; message?: string; tone: ToastTone };

type ToastContextValue = { notify: (toast: { title: string; message?: string; tone?: ToastTone }) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_META: Record<ToastTone, { icon: string; className: string; bar: string }> = {
  success: { icon: 'ri-checkbox-circle-line', className: 'text-primary-800', bar: 'bg-primary-700' },
  error: { icon: 'ri-error-warning-line', className: 'text-accent-800', bar: 'bg-accent-500' },
  info: { icon: 'ri-information-line', className: 'text-foreground-800', bar: 'bg-foreground-500' },
};

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((toast: { title: string; message?: string; tone?: ToastTone }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title: toast.title, message: toast.message, tone: toast.tone ?? 'success' }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2.5">
        {toasts.map((toast) => {
          const meta = TONE_META[toast.tone];
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-start gap-3 overflow-hidden rounded-card border border-background-200 bg-background-50 p-4"
            >
              <span className={`flex h-5 w-5 items-center justify-center ${meta.className}`}>
                <i className={`${meta.icon} text-lg`}></i>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground-950">{toast.title}</p>
                {toast.message && <p className="mt-0.5 text-xs text-foreground-600">{toast.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-foreground-400 transition-colors hover:bg-background-100 hover:text-foreground-700"
                aria-label="Dismiss"
              >
                <i className="ri-close-line text-base"></i>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useAdminToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    return { notify: () => undefined };
  }
  return context;
}