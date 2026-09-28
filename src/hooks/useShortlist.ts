import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'zamin.shortlist';
const EVENT = 'zamin:shortlist';

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore storage failures */
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Shared visitor shortlist (favourite properties). Persists to this device and
 * keeps every consumer (cards, navbar badge, shortlist page) in sync via a
 * custom window event.
 */
export function useShortlist() {
  const [ids, setIds] = useState<string[]>(() => read());

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string) => {
    const current = read();
    const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
    write(next);
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((value) => value !== id));
  }, []);

  const clear = useCallback(() => {
    write([]);
  }, []);

  return { ids, count: ids.length, has, toggle, remove, clear };
}