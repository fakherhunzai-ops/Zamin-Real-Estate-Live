import { supabase } from '@/lib/supabase';
import type {
  CleaningStatus,
  CleaningTaskRecord,
  MaintenanceIssue,
  MaintenancePriority,
  MaintenanceStatus,
} from '@/types/stays';

const STAY_REF = 'stay:stays(id, title, slug)';

/* ------------------------------- cleaning -------------------------------- */

export async function fetchCleaningTasks(): Promise<CleaningTaskRecord[]> {
  const { data, error } = await supabase
    .from('cleaning_tasks')
    .select(`*, ${STAY_REF}`)
    .order('scheduled_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as CleaningTaskRecord[]) ?? [];
}

export type CleaningTaskInput = {
  stay_id: string;
  booking_id?: string | null;
  assigned_to?: string | null;
  status?: CleaningStatus;
  scheduled_date?: string | null;
  notes?: string | null;
};

export async function createCleaningTask(input: CleaningTaskInput): Promise<void> {
  const { error } = await supabase.from('cleaning_tasks').insert(input);
  if (error) throw error;
}

export async function updateCleaningTask(
  id: string,
  patch: Partial<Omit<CleaningTaskInput, 'stay_id' | 'booking_id'>>,
): Promise<void> {
  const { error } = await supabase
    .from('cleaning_tasks')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCleaningTask(id: string): Promise<void> {
  const { error } = await supabase.from('cleaning_tasks').delete().eq('id', id);
  if (error) throw error;
}

/* ------------------------------ maintenance ------------------------------ */

export async function fetchMaintenanceIssues(): Promise<MaintenanceIssue[]> {
  const { data, error } = await supabase
    .from('maintenance_issues')
    .select(`*, ${STAY_REF}`)
    .order('reported_date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as MaintenanceIssue[]) ?? [];
}

export type MaintenanceIssueInput = {
  stay_id: string;
  title: string;
  description?: string | null;
  priority?: MaintenancePriority;
  assigned_to?: string | null;
  cost?: number;
  status?: MaintenanceStatus;
  reported_date?: string;
  notes?: string | null;
};

export async function createMaintenanceIssue(input: MaintenanceIssueInput): Promise<void> {
  const { error } = await supabase.from('maintenance_issues').insert(input);
  if (error) throw error;
}

export async function updateMaintenanceIssue(
  id: string,
  patch: Partial<Omit<MaintenanceIssueInput, 'stay_id'>>,
): Promise<void> {
  const resolvedAt = patch.status === 'RESOLVED' ? new Date().toISOString() : null;
  const { error } = await supabase
    .from('maintenance_issues')
    .update({
      ...patch,
      ...(patch.status ? { resolved_at: resolvedAt } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMaintenanceIssue(id: string): Promise<void> {
  const { error } = await supabase.from('maintenance_issues').delete().eq('id', id);
  if (error) throw error;
}