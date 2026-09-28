import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { StayCalendar } from '@/types/stays';

/** Availability for a stay: booked nights + admin/host blocked ranges. */
export function useStayCalendar(stayId: string | undefined) {
  const [calendar, setCalendar] = useState<StayCalendar | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!stayId) {
      setCalendar(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('stay_calendar', { p_stay_id: stayId });
      if (error) throw error;
      setCalendar(data as StayCalendar);
    } catch {
      setCalendar(null);
    } finally {
      setLoading(false);
    }
  }, [stayId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { calendar, loading, refetch: fetchData };
}