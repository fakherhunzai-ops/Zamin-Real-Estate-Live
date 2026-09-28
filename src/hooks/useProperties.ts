import { useCallback, useEffect, useMemo, useState } from 'react';
import { properties, type PropertyListing } from '@/mocks/properties';

/**
 * Property catalogue source.
 *
 * Currently backed by the static mock catalogue in `src/mocks/properties.ts`.
 * When a database or API is connected later, only `fetchProperties` needs to
 * change — the returned shape (`PropertyListing[]`) stays the same, so every
 * page and component that consumes this hook keeps working unchanged.
 */
export function useProperties(options?: { listingType?: 'sale' | 'rent' }) {
  const [all, setAll] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulated async so loading states behave like a real API request.
      await new Promise((resolve) => setTimeout(resolve, 200));
      setAll(properties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const list = useMemo(
    () =>
      options?.listingType
        ? all.filter((property) => property.listingType === options.listingType)
        : all,
    [all, options?.listingType],
  );

  return { properties: list, loading, error, refetch: fetchProperties };
}