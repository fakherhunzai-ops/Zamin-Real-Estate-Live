import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Stay } from '@/types/stays';

const ADMIN_DETAIL_SELECT =
  '*, category:stay_categories(*), destination:stay_destinations(*), area:stay_areas(*), images:stay_images(*), amenity_links:stay_amenity_links(amenity:stay_amenities(*))';

/** Loads a single stay by id for the admin editor — any status, no publishing gate. */
export function useAdminStay(id: string | undefined) {
  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setStay(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('stays')
        .select(ADMIN_DETAIL_SELECT)
        .eq('id', id)
        .maybeSingle();
      if (queryError) throw queryError;
      setStay((data as Stay) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this stay');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stay, loading, error, refetch: fetchData };
}