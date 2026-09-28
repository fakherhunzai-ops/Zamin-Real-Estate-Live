import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { StayQuote } from '@/types/stays';

/**
 * Server-side price quote for a stay + date range.
 * Debounced and sequence-guarded so fast date changes never land out of order.
 * The returned total is the *authoritative* amount the backend will use.
 */
export function useStayQuote(
  stayId: string | undefined,
  checkIn: string,
  checkOut: string,
  guests: number,
) {
  const [quote, setQuote] = useState<StayQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    if (!stayId || !checkIn || !checkOut || checkOut <= checkIn) {
      setQuote(null);
      setError(null);
      setLoading(false);
      return;
    }

    const current = ++seq.current;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const { data, error: rpcError } = await supabase.rpc('quote_stay', {
          p_stay_id: stayId,
          p_check_in: checkIn,
          p_check_out: checkOut,
          p_guests: guests,
        });
        if (current !== seq.current) return;
        if (rpcError) throw rpcError;
        setQuote(data as StayQuote);
      } catch (err) {
        if (current !== seq.current) return;
        setError(err instanceof Error ? err.message : 'Could not calculate the price');
      } finally {
        if (current === seq.current) setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [stayId, checkIn, checkOut, guests]);

  return { quote, loading, error };
}