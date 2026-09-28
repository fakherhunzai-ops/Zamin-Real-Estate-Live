import { useCallback, useEffect, useState } from 'react';

const EVENT = 'zamin:savedreport';

export type SavedReport<T> = { savedAt: string; data: T };

const keyFor = (key: string) => `zamin.report.${key}`;

function read<T>(key: string): SavedReport<T> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(keyFor(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedReport<T>>;
    if (parsed && typeof parsed === 'object' && 'savedAt' in parsed && 'data' in parsed) {
      return parsed as SavedReport<T>;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists a visitor's last calculator inputs on their own device so they can
 * reopen the report later. Kept intentionally small (a compact JSON string).
 */
export function useSavedReport<T>(key: string) {
  const [saved, setSaved] = useState<SavedReport<T> | null>(() => read<T>(key));

  useEffect(() => {
    const sync = () => setSaved(read<T>(key));
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [key]);

  const save = useCallback(
    (data: T) => {
      try {
        const record: SavedReport<T> = { savedAt: new Date().toISOString(), data };
        window.localStorage.setItem(keyFor(key), JSON.stringify(record));
      } catch {
        /* ignore storage failures */
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(keyFor(key));
    } catch {
      /* ignore storage failures */
    }
    window.dispatchEvent(new Event(EVENT));
  }, [key]);

  return { saved, save, clear };
}