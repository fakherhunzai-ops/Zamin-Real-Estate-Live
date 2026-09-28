import { useCallback, useEffect, useState } from 'react';
import { fetchCleaningTasks } from '@/utils/opsTasks';
import type { CleaningTaskRecord } from '@/types/stays';

export function useCleaningTasks() {
  const [tasks, setTasks] = useState<CleaningTaskRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCleaningTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load cleaning tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { tasks, loading, error, refetch: fetchData };
}