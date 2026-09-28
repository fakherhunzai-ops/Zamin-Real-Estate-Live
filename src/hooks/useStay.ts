import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Stay, StayDestination, StayArea } from '@/types/stays';

const DETAIL_SELECT =
  '*, category:stay_categories(*), destination:stay_destinations(*), area:stay_areas(*), images:stay_images(*), amenity_links:stay_amenity_links(amenity:stay_amenities(*))';

export function useStay(slug: string | undefined) {
  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!slug) {
      setStay(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('stays')
        .select(DETAIL_SELECT)
        .eq('slug', slug)
        .eq('status', 'PUBLISHED')
        .maybeSingle();
      if (queryError) throw queryError;
      setStay((data as Stay) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this stay');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stay, loading, error, refetch: fetchData };
}

export function useDestination(slug: string | undefined) {
  const [destination, setDestination] = useState<StayDestination | null>(null);
  const [areas, setAreas] = useState<StayArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!slug) {
      setDestination(null);
      setAreas([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('stay_destinations')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (queryError) throw queryError;
      setDestination((data as StayDestination) ?? null);

      if (data) {
        const { data: areaData, error: areaError } = await supabase
          .from('stay_areas')
          .select('*')
          .eq('destination_id', (data as StayDestination).id)
          .order('sort_order', { ascending: true });
        if (areaError) throw areaError;
        setAreas((areaData as StayArea[]) ?? []);
      } else {
        setAreas([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this destination');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { destination, areas, loading, error, refetch: fetchData };
}