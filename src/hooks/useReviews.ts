import { useCallback, useEffect, useState } from 'react';
import { fetchAllReviews } from '@/utils/reviews';
import type { StayReview } from '@/types/stays';

/** Admin review moderation queue. */
export function useReviews() {
  const [reviews, setReviews] = useState<StayReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllReviews();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { reviews, loading, error, refetch: fetchData };
}