import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Stay } from '@/types/stays';

const LIST_SELECT =
  '*, category:stay_categories(*), destination:stay_destinations(*), area:stay_areas(*), images:stay_images(*)';

export type UseStaysOptions = {
  destinationId?: string;
  areaId?: string;
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  includeDrafts?: boolean;
};

export function useStays(options: UseStaysOptions = {}) {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { destinationId, areaId, categoryId, featured, limit, includeDrafts } = options;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('stays').select(LIST_SELECT);
      if (!includeDrafts) query = query.eq('status', 'PUBLISHED');
      if (destinationId) query = query.eq('destination_id', destinationId);
      if (areaId) query = query.eq('area_id', areaId);
      if (categoryId) query = query.eq('category_id', categoryId);
      if (featured) query = query.eq('featured', true);
      query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
      if (limit) query = query.limit(limit);

      const { data, error: queryError } = await query;
      if (queryError) throw queryError;
      setStays((data as Stay[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load stays');
    } finally {
      setLoading(false);
    }
  }, [destinationId, areaId, categoryId, featured, limit, includeDrafts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stays, loading, error, refetch: fetchData };
}