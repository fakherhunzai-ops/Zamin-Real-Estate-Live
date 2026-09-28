import { supabase } from '@/lib/supabase';
import type {
  Booking,
  BookingStatus,
  ManagementType,
  Stay,
  StayAvailabilityBlock,
  StayBlockReason,
  StayRateRule,
  StaySettings,
  StayStatus,
} from '@/types/stays';

export type StayFormInput = {
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  category_id: string | null;
  management_type: ManagementType;
  destination_id: string | null;
  area_id: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  guest_capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  base_nightly_rate: number;
  currency: string;
  cleaning_fee: number;
  service_fee_percent: number;
  check_in_time: string | null;
  check_out_time: string | null;
  cancellation_policy: string | null;
  house_rules: string | null;
  host_name: string | null;
  host_email: string | null;
  host_phone: string | null;
  status: StayStatus;
  verified: boolean;
  featured: boolean;
};

export type StayImageInput = {
  url: string;
  alt: string | null;
  is_cover: boolean;
  sort_order: number;
};

/** Upload a file to the public `stay-images` bucket and return its public URL. */
export async function uploadStayImage(file: File): Promise<string> {
  const rawExt = file.name.includes('.') ? file.name.split('.').pop() ?? 'jpg' : 'jpg';
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from('stay-images')
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from('stay-images').getPublicUrl(path);
  return data.publicUrl;
}

export async function createStay(input: StayFormInput): Promise<Stay> {
  const { data, error } = await supabase.from('stays').insert(input).select('*').single();
  if (error) throw error;
  return data as Stay;
}

export async function updateStay(
  id: string,
  input: Partial<StayFormInput> & { verified_at?: string | null },
): Promise<Stay> {
  const { data, error } = await supabase
    .from('stays')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Stay;
}

export async function deleteStay(id: string): Promise<void> {
  const { error } = await supabase.from('stays').delete().eq('id', id);
  if (error) throw error;
}

export async function setStayStatus(id: string, status: StayStatus): Promise<void> {
  const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (status === 'VERIFIED') {
    patch.verified = true;
    patch.verified_at = new Date().toISOString();
  }
  const { error } = await supabase.from('stays').update(patch).eq('id', id);
  if (error) throw error;
}

export async function setStayVerified(id: string, verified: boolean): Promise<void> {
  const { error } = await supabase
    .from('stays')
    .update({
      verified,
      verified_at: verified ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function setStayFeatured(id: string, featured: boolean): Promise<void> {
  const { error } = await supabase
    .from('stays')
    .update({ featured, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function replaceStayImages(stayId: string, images: StayImageInput[]): Promise<void> {
  const { error: deleteError } = await supabase.from('stay_images').delete().eq('stay_id', stayId);
  if (deleteError) throw deleteError;
  if (images.length === 0) return;
  const { error } = await supabase
    .from('stay_images')
    .insert(images.map((image) => ({ ...image, stay_id: stayId })));
  if (error) throw error;
}

export async function replaceStayAmenities(stayId: string, amenityIds: string[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from('stay_amenity_links')
    .delete()
    .eq('stay_id', stayId);
  if (deleteError) throw deleteError;
  if (amenityIds.length === 0) return;
  const { error } = await supabase
    .from('stay_amenity_links')
    .insert(amenityIds.map((amenityId) => ({ stay_id: stayId, amenity_id: amenityId })));
  if (error) throw error;
}

/* ---------- Rate rules ---------- */

export async function saveRateRule(
  stayId: string,
  rule: Pick<StayRateRule, 'label' | 'rule_type' | 'nightly_rate' | 'min_nights' | 'priority' | 'is_active'> & {
    start_date: string | null;
    end_date: string | null;
  },
): Promise<void> {
  const { error } = await supabase.from('stay_rate_rules').insert({ ...rule, stay_id: stayId });
  if (error) throw error;
}

export async function deleteRateRule(id: string): Promise<void> {
  const { error } = await supabase.from('stay_rate_rules').delete().eq('id', id);
  if (error) throw error;
}

/* ---------- Availability blocks ---------- */

export async function addAvailabilityBlock(
  stayId: string,
  block: { start_date: string; end_date: string; reason: StayBlockReason; note: string | null },
  createdBy: string | null,
): Promise<void> {
  const { error } = await supabase
    .from('stay_availability_blocks')
    .insert({ ...block, stay_id: stayId, created_by: createdBy });
  if (error) throw error;
}

export async function deleteAvailabilityBlock(id: string): Promise<void> {
  const { error } = await supabase.from('stay_availability_blocks').delete().eq('id', id);
  if (error) throw error;
}

/* ---------- Bookings ---------- */

export async function fetchBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, stay:stays(id, title, slug, destination:stay_destinations(name), area:stay_areas(name))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Booking[]) ?? [];
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export type { StayAvailabilityBlock, StayRateRule };

/* ---------- Platform settings ---------- */

export async function fetchStaySettings(): Promise<StaySettings> {
  const { data, error } = await supabase.from('stay_settings').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Settings row is missing.');
  return data as StaySettings;
}

export async function updateStaySettings(
  input: Partial<Omit<StaySettings, 'id' | 'updated_at'>>,
): Promise<StaySettings> {
  const { data, error } = await supabase
    .from('stay_settings')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select('*')
    .single();
  if (error) throw error;
  return data as StaySettings;
}