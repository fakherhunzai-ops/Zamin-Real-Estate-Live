import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { StayCategory, StayAmenity } from '@/types/stays';

export function useStayCategories() {
  const [categories, setCategories] = useState<StayCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('stay_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (queryError) throw queryError;
      setCategories((data as StayCategory[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load stay types');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { categories, loading, error, refetch: fetchData };
}

export function useStayAmenities() {
  const [amenities, setAmenities] = useState<StayAmenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('stay_amenities')
        .select('*')
        .order('sort_order', { ascending: true });
      if (queryError) throw queryError;
      setAmenities((data as StayAmenity[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load amenities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { amenities, loading, error, refetch: fetchData };
}