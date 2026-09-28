import { useEffect, useState } from 'react';
import { properties, type PropertyListing } from '@/mocks/properties';

/**
 * Look up a single listing by id from the current catalogue.
 * Replace the lookup with a real API/database call when a backend is connected.
 */
export function useProperty(id?: string) {
  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const found = properties.find((item) => item.id === id) ?? null;
    setProperty(found);
    setLoading(false);
  }, [id]);

  return { property, loading };
}