import { useCallback, useEffect, useState } from 'react';
import { fetchStaySettings, updateStaySettings } from '@/utils/stayAdmin';
import type { StaySettings } from '@/types/stays';

export function useStaySettings() {
  const [settings, setSettings] = useState<StaySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStaySettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const save = useCallback(
    async (input: Partial<Omit<StaySettings, 'id' | 'updated_at'>>) => {
      const data = await updateStaySettings(input);
      setSettings(data);
      return data;
    },
    [],
  );

  return { settings, loading, error, refetch: fetchData, save };
}