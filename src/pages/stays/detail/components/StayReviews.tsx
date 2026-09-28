import { useStayReviews } from '@/hooks/useStayReviews';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={`${rating} / 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <i
          key={index}
          className={`${index < rating ? 'ri-star-fill text-accent-600' : 'ri-star-line text-background-400'} text-sm`}
        ></i>
      ))}
    </span>
  );
}

export default function StayReviews({ stayId }: { stayId: string }) {
  const { reviews, loading } = useStayReviews(stayId);

  if (loading || reviews.length === 0) return null;

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-heading text-xl font-semibold text-foreground-950 md:text-2xl">
          Guest reviews
        </h2>
        <span className="flex items-center gap-2 rounded-full bg-accent-100 px-3 py-1 text-sm font-semibold text-accent-900">
          <i className="ri-star-fill text-accent-600"></i>
          {average.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reviews.slice(0, 4).map((review) => (
          <article key={review.id} className="rounded-card border border-background-200 bg-background-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground-950">{review.guest_name}</p>
              <Stars rating={review.rating} />
            </div>
            {review.comment && (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground-700">
                {review.comment}
              </p>
            )}
            <p className="mt-3 text-xs text-foreground-500">
              {new Date(review.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}