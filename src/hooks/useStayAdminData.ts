import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { StayAvailabilityBlock, StayRateRule } from '@/types/stays';

export function useStayRateRules(stayId: string | undefined) {
  const [rules, setRules] = useState<StayRateRule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!stayId) {
      setRules([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stay_rate_rules')
        .select('*')
        .eq('stay_id', stayId)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });
      if (error) throw error;
      setRules((data as StayRateRule[]) ?? []);
    } catch {
      setRules([]);
    } finally {
      setLoading(false);
    }
  }, [stayId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { rules, loading, refetch: fetchData };
}

export function useStayAvailabilityBlocks(stayId: string | undefined) {
  const [blocks, setBlocks] = useState<StayAvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!stayId) {
      setBlocks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stay_availability_blocks')
        .select('*')
        .eq('stay_id', stayId)
        .order('start_date', { ascending: true });
      if (error) throw error;
      setBlocks((data as StayAvailabilityBlock[]) ?? []);
    } catch {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  }, [stayId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { blocks, loading, refetch: fetchData };
}