import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { StayArea } from '@/types/stays';

/** Areas belonging to a destination (used by host onboarding + admin). */
export function useStayAreas(destinationId: string | null) {
  const [areas, setAreas] = useState<StayArea[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!destinationId) {
      setAreas([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stay_areas')
        .select('*')
        .eq('destination_id', destinationId)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setAreas((data as StayArea[]) ?? []);
    } catch {
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }, [destinationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { areas, loading };
}