import { supabase } from '@/lib/supabase';
import type { BookingConfirmation, StayQuote } from '@/types/stays';

export type CreateStayBookingInput = {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestPhone: string;
  guestEmail?: string | null;
  notes?: string | null;
};

export type CreateStayBookingResult = {
  success: boolean;
  reason?: string;
  reference?: string;
  booking_id?: string;
  quote?: StayQuote;
};

/**
 * Creates a real PENDING booking via the server function. Availability is
 * re-checked and the total is recalculated server-side — the browser never
 * gets to decide the price or force a double-booking.
 */
export async function createStayBooking(input: CreateStayBookingInput): Promise<CreateStayBookingResult> {
  const { data, error } = await supabase.rpc('create_booking', {
    p_stay_id: input.stayId,
    p_check_in: input.checkIn,
    p_check_out: input.checkOut,
    p_guests: input.guests,
    p_guest_name: input.guestName,
    p_guest_phone: input.guestPhone,
    p_guest_email: input.guestEmail ?? null,
    p_notes: input.notes ?? null,
  });
  if (error) throw error;
  return (data as CreateStayBookingResult) ?? { success: false, reason: 'UNKNOWN' };
}

/**
 * Looks up a single booking by its reference through a server function.
 * Only returns safe, confirmation-level fields (no guest phone/email).
 */
export async function fetchBookingByReference(reference: string): Promise<BookingConfirmation | null> {
  const { data, error } = await supabase.rpc('booking_by_reference', { p_reference: reference });
  if (error) throw error;
  return (data as BookingConfirmation) ?? null;
}