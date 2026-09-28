import { supabase } from '@/lib/supabase';
import type { ReviewStatus, StayReview } from '@/types/stays';

const REVIEW_SELECT = '*, stay:stays(id, title, slug)';

/** Every review (admin moderation queue). */
export async function fetchAllReviews(): Promise<StayReview[]> {
  const { data, error } = await supabase
    .from('stay_reviews')
    .select(REVIEW_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as StayReview[]) ?? [];
}

/** Published reviews for a single stay (public display). */
export async function fetchStayReviews(stayId: string): Promise<StayReview[]> {
  const { data, error } = await supabase
    .from('stay_reviews')
    .select('*')
    .eq('stay_id', stayId)
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as StayReview[]) ?? [];
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<void> {
  const { error } = await supabase
    .from('stay_reviews')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export type SubmitReviewInput = {
  reference: string;
  rating: number;
  comment: string;
  guestName?: string;
};

/** Guest review submission keyed by booking reference (no sign-in required). */
export async function submitStayReview(
  input: SubmitReviewInput,
): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await supabase.rpc('submit_stay_review', {
    p_reference: input.reference,
    p_rating: input.rating,
    p_comment: input.comment,
    p_guest_name: input.guestName ?? null,
  });
  if (error) throw error;
  return (data as { ok: boolean; message: string }) ?? {
    ok: false,
    message: 'Could not submit your review. Please try again.',
  };
}