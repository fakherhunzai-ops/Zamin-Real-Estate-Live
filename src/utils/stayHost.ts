import { supabase } from '@/lib/supabase';
import type { ManagementType } from '@/types/stays';

export type HostStayInput = {
  hostName: string;
  hostEmail: string;
  hostPhone: string;
  title: string;
  managementType: ManagementType;
  destinationId: string | null;
  areaId: string | null;
  categoryId: string | null;
  address: string | null;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  guestCapacity: number;
  baseNightlyRate: number;
  description: string | null;
  houseRules: string | null;
  amenityIds: string[];
  ownershipNote: string | null;
};

export type HostStayResult = {
  success: boolean;
  reason?: string;
  id?: string;
  slug?: string;
};

/**
 * Submits a host onboarding application. A server function creates the stay
 * with status PENDING — it is never auto-published and lands in /admin/stays
 * for review.
 */
export async function submitHostStay(input: HostStayInput): Promise<HostStayResult> {
  const { data, error } = await supabase.rpc('submit_host_stay', {
    p_host_name: input.hostName,
    p_host_email: input.hostEmail,
    p_host_phone: input.hostPhone,
    p_title: input.title,
    p_destination_id: input.destinationId,
    p_area_id: input.areaId,
    p_category_id: input.categoryId,
    p_management_type: input.managementType,
    p_address: input.address,
    p_bedrooms: input.bedrooms,
    p_beds: input.beds,
    p_bathrooms: input.bathrooms,
    p_guest_capacity: input.guestCapacity,
    p_base_nightly_rate: input.baseNightlyRate,
    p_description: input.description,
    p_house_rules: input.houseRules,
    p_amenity_ids: input.amenityIds.length > 0 ? input.amenityIds : null,
    p_ownership_note: input.ownershipNote,
  });
  if (error) throw error;
  return (data as HostStayResult) ?? { success: false, reason: 'UNKNOWN' };
}