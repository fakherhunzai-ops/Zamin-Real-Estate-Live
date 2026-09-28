import { supabase } from '@/lib/supabase';
import type { Booking, Host, Stay, StayStatus } from '@/types/stays';

export const HOST_STAY_SELECT =
  '*, category:stay_categories(*), destination:stay_destinations(*), area:stay_areas(*), images:stay_images(*)';

async function sessionEmail(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.email?.toLowerCase() ?? null;
}

/** The host profile row for the signed-in user, if one exists. */
export async function fetchHostProfile(): Promise<Host | null> {
  const email = await sessionEmail();
  if (!email) return null;
  const { data, error } = await supabase.from('hosts').select('*').eq('email', email).maybeSingle();
  if (error) return null;
  return (data as Host) ?? null;
}

/** All stays owned by the signed-in host (matched by their email on the stay). */
export async function fetchHostStays(): Promise<Stay[]> {
  const email = await sessionEmail();
  if (!email) return [];
  const { data, error } = await supabase
    .from('stays')
    .select(HOST_STAY_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data as Stay[]) ?? []).filter(
    (stay) => (stay.host_email ?? '').toLowerCase() === email,
  );
}

/** Bookings for the host's stays (RLS restricts these to the signed-in host). */
export async function fetchHostBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, stay:stays(id, title, slug, destination:stay_destinations(name), area:stay_areas(name))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Booking[]) ?? [];
}

export type HostStayPatch = Partial<{
  title: string;
  summary: string | null;
  description: string | null;
  address: string | null;
  guest_capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  base_nightly_rate: number;
  cleaning_fee: number;
  check_in_time: string | null;
  check_out_time: string | null;
  house_rules: string | null;
  cancellation_policy: string | null;
  status: StayStatus;
}>;

export async function updateHostStay(id: string, patch: HostStayPatch): Promise<void> {
  const { error } = await supabase
    .from('stays')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function setHostStayStatus(id: string, status: StayStatus): Promise<void> {
  await updateHostStay(id, { status });
}