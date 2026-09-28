import { useState } from 'react';
import type { FormEvent } from 'react';
import { submitStayReview } from '@/utils/reviews';
import type { BookingConfirmation } from '@/types/stays';

/** Guest review form, shown once a stay has been completed. */
export default function StayReviewForm({ booking }: { booking: BookingConfirmation }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (booking.status !== 'CHECKED_OUT') return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (rating < 1) {
      setError('Please choose a star rating.');
      return;
    }
    setBusy(true);
    try {
      const result = await submitStayReview({
        reference: booking.reference,
        rating,
        comment: comment.trim(),
        guestName: booking.guest_name,
      });
      if (result.ok) setSuccess(result.message);
      else setError(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your review. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <div className="mt-6 rounded-card border border-accent-200 bg-accent-50 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-accent-900">
          <i className="ri-checkbox-circle-line text-lg"></i>
          {success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-card border border-background-200 bg-background-50 p-5 md:p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground-950">How was your stay?</h2>
      <p className="mt-1 text-sm text-foreground-600">
        Share a quick review of {booking.stay_title ?? 'your stay'}. It helps other guests and our hosts.
      </p>

      <div className="mt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Your rating</span>
        <div className="mt-2 flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center"
              aria-label={`${value} star${value > 1 ? 's' : ''}`}
            >
              <i className={`${value <= rating ? 'ri-star-fill text-accent-600' : 'ri-star-line text-background-400'} text-2xl`}></i>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <label htmlFor="review-comment" className="text-xs font-semibold uppercase tracking-wide text-foreground-600">
          Your review
        </label>
        <textarea
          id="review-comment"
          name="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value.slice(0, 500))}
          maxLength={500}
          placeholder="What did you love? Anything to improve?"
          className="min-h-[110px] w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 transition-colors focus:border-primary-500 focus:outline-none"
        />
        <span className="self-end text-xs text-foreground-400">{comment.length}/500</span>
      </div>

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-md bg-accent-50 px-3 py-2.5 text-sm text-accent-800">
          <i className="ri-error-warning-line mt-0.5"></i>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary-800 px-5 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-foreground-950"
      >
        {busy && <i className="ri-loader-4-line animate-spin"></i>}
        Submit review
      </button>
    </form>
  );
}