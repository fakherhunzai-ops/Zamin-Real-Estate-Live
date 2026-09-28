import { useCallback, useEffect, useState } from 'react';
import { fetchMaintenanceIssues } from '@/utils/opsTasks';
import type { MaintenanceIssue } from '@/types/stays';

export function useMaintenanceIssues() {
  const [issues, setIssues] = useState<MaintenanceIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMaintenanceIssues();
      setIssues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load maintenance issues');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { issues, loading, error, refetch: fetchData };
}