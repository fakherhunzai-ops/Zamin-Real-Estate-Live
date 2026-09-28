import { useCallback, useEffect, useState } from 'react';
import { fetchStayReviews } from '@/utils/reviews';
import type { StayReview } from '@/types/stays';

/** Published reviews for a stay (public display). */
export function useStayReviews(stayId: string | undefined) {
  const [reviews, setReviews] = useState<StayReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!stayId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchStayReviews(stayId);
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [stayId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { reviews, loading };
}