import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { StayDestination } from '@/types/stays';

export function useStayDestinations() {
  const [destinations, setDestinations] = useState<StayDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('stay_destinations')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (queryError) throw queryError;
      setDestinations((data as StayDestination[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load destinations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { destinations, loading, error, refetch: fetchData };
}