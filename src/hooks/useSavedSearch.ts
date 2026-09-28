import { useCallback, useEffect, useState } from 'react';
import type { PropertyFiltersValue } from '@/pages/properties/components/PropertyFilters';

const STORAGE_KEY = 'zamin.savedSearch';
const EVENT = 'zamin:savedSearch';

export type SavedSearch = {
  filters: PropertyFiltersValue;
  listingType: 'sale' | 'rent';
  savedAt: string;
};

function read(): SavedSearch | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedSearch;
    if (!parsed || typeof parsed !== 'object' || !parsed.filters) return null;
    return parsed;
  } catch {
    return null;
  }
}

function write(value: SavedSearch | null) {
  try {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* ignore storage failures */
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Remembers the visitor's most recent property search filters on their own
 * device so we can invite them to re-check for new matching listings on a
 * later visit. Kept in sync across tabs / pages via a custom window event.
 */
export function useSavedSearch() {
  const [saved, setSaved] = useState<SavedSearch | null>(() => read());

  useEffect(() => {
    const sync = () => setSaved(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const save = useCallback((search: SavedSearch) => {
    write(search);
  }, []);

  const clear = useCallback(() => {
    write(null);
  }, []);

  return { saved, save, clear };
}