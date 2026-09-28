import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import ConfirmDialog from '@/pages/admin/components/ConfirmDialog';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  Segmented,
  StatCard,
  btnGhost,
  btnSmall,
  inputClass,
  tdClass,
  thClass,
  theadClass,
  tableWrap,
} from '@/pages/admin/components/AdminUI';
import { useReviews } from '@/hooks/useReviews';
import { useBookings } from '@/hooks/useBookings';
import { setReviewStatus } from '@/utils/reviews';
import { formatPKR } from '@/utils/stays';
import type { ReviewStatus, StayReview } from '@/types/stays';

const STATUS_META: Record<ReviewStatus, { label: string; tone: 'primary' | 'muted' | 'urgent'; icon: string }> = {
  PUBLISHED: { label: 'Published', tone: 'primary', icon: 'ri-checkbox-circle-line' },
  HIDDEN: { label: 'Hidden', tone: 'muted', icon: 'ri-eye-off-line' },
  FLAGGED: { label: 'Flagged', tone: 'urgent', icon: 'ri-flag-2-line' },
};

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

export default function AdminReviewsPage() {
  const { reviews, loading, error, refetch } = useReviews();
  const { bookings } = useBookings();
  const { notify } = useAdminToast();

  const [filter, setFilter] = useState<'ALL' | ReviewStatus>('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<StayReview | null>(null);
  const [pendingAction, setPendingAction] = useState<{ review: StayReview; status: ReviewStatus } | null>(null);
  const [busy, setBusy] = useState(false);

  const counts = useMemo(
    () => ({
      total: reviews.length,
      published: reviews.filter((review) => review.status === 'PUBLISHED').length,
      hidden: reviews.filter((review) => review.status === 'HIDDEN').length,
      flagged: reviews.filter((review) => review.status === 'FLAGGED').length,
      avg:
        reviews.length > 0
          ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
          : 0,
    }),
    [reviews],
  );

  const reviewedBookingIds = useMemo(
    () => new Set(reviews.map((review) => review.booking_id).filter(Boolean) as string[]),
    [reviews],
  );

  const awaiting = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === 'CHECKED_OUT' && !reviewedBookingIds.has(booking.id))
        .sort((a, b) => b.check_out.localeCompare(a.check_out)),
    [bookings, reviewedBookingIds],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews.filter((review) => {
      if (filter !== 'ALL' && review.status !== filter) return false;
      if (q && !`${review.guest_name} ${review.comment ?? ''} ${review.stay?.title ?? ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [reviews, filter, search]);

  const applyStatus = async (review: StayReview, status: ReviewStatus) => {
    setBusy(true);
    try {
      await setReviewStatus(review.id, status);
      await refetch();
      notify({
        title:
          status === 'HIDDEN' ? 'Review hidden' : status === 'FLAGGED' ? 'Review flagged' : 'Review restored',
        message: review.guest_name,
        tone: 'success',
      });
      setSelected(null);
    } catch (err) {
      notify({ title: 'Could not update review', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
      setPendingAction(null);
    }
  };

  return (
    <AdminLayout
      title="Reviews"
      subtitle="Guest reviews and post-stay feedback — view, hide, flag and restore."
      actions={
        <Link to="/admin/bookings" className={btnGhost}>
          <i className="ri-calendar-check-line text-base"></i> Bookings
        </Link>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total reviews" value={counts.total} icon="ri-star-line" />
        <StatCard label="Average rating" value={counts.avg ? counts.avg.toFixed(1) : '—'} icon="ri-star-half-line" tone="accent" />
        <StatCard label="Published" value={counts.published} icon="ri-checkbox-circle-line" tone="primary" />
        <StatCard label="Hidden / Flagged" value={`${counts.hidden} / ${counts.flagged}`} icon="ri-shield-star-line" />
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4 md:flex-row md:items-center">
        <div className="relative md:max-w-md md:flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
            <i className="ri-search-line text-base"></i>
          </span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guest, stay or comment" className={`${inputClass} pl-9`} />
        </div>
        <Segmented
          options={[
            { value: 'ALL', label: 'All' },
            { value: 'PUBLISHED', label: 'Published' },
            { value: 'HIDDEN', label: 'Hidden' },
            { value: 'FLAGGED', label: 'Flagged' },
          ]}
          value={filter}
          onChange={(value) => setFilter(value as 'ALL' | ReviewStatus)}
        />
      </div>

      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load reviews." onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="ri-star-line"
          title={reviews.length === 0 ? 'No reviews yet.' : 'No reviews match this view.'}
          message={reviews.length === 0 ? 'Guest reviews appear here for moderation once guests submit them after a completed stay.' : undefined}
        />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Rating</th>
                <th className={thClass}>Guest</th>
                <th className={thClass}>Stay</th>
                <th className={thClass}>Comment</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((review) => {
                const meta = STATUS_META[review.status];
                return (
                  <tr key={review.id} className="border-t border-background-100 align-top">
                    <td className={tdClass}><Stars rating={review.rating} /></td>
                    <td className={tdClass}>
                      <p className="font-medium text-foreground-900">{review.guest_name}</p>
                      {review.guest_email && <p className="text-xs text-foreground-500">{review.guest_email}</p>}
                    </td>
                    <td className={`${tdClass} text-foreground-700`}>
                      {review.stay ? (
                        <Link to={`/admin/stays/${review.stay.id}`} className="hover:text-primary-700">{review.stay.title}</Link>
                      ) : '—'}
                    </td>
                    <td className={`${tdClass} max-w-[280px] text-foreground-600`}>
                      <p className="line-clamp-2">{review.comment || '—'}</p>
                    </td>
                    <td className={`${tdClass} text-xs text-foreground-500`}>{new Date(review.created_at).toLocaleDateString()}</td>
                    <td className={tdClass}><Badge tone={meta.tone} icon={meta.icon}>{meta.label}</Badge></td>
                    <td className={tdClass}>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <button type="button" onClick={() => setSelected(review)} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                          <i className="ri-eye-line"></i> View
                        </button>
                        {review.status !== 'HIDDEN' && (
                          <button type="button" disabled={busy} onClick={() => setPendingAction({ review, status: 'HIDDEN' })} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                            <i className="ri-eye-off-line"></i> Hide
                          </button>
                        )}
                        {review.status !== 'FLAGGED' && (
                          <button type="button" disabled={busy} onClick={() => applyStatus(review, 'FLAGGED')} className={`${btnSmall} border-accent-300 text-accent-800 hover:bg-accent-50`}>
                            <i className="ri-flag-2-line"></i> Flag
                          </button>
                        )}
                        {review.status !== 'PUBLISHED' && (
                          <button type="button" disabled={busy} onClick={() => applyStatus(review, 'PUBLISHED')} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                            <i className="ri-refresh-line"></i> Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Card title="Awaiting review" icon="ri-mail-star-line" bodyClassName="p-0">
          {awaiting.length === 0 ? (
            <div className="p-5">
              <EmptyState compact icon="ri-mail-star-line" title="No completed stays awaiting a review." />
            </div>
          ) : (
            <div className={tableWrap + ' border-0'}>
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className={theadClass}>
                  <tr>
                    <th className={thClass}>Guest</th>
                    <th className={thClass}>Stay</th>
                    <th className={thClass}>Check-out</th>
                    <th className={thClass}>Booking value</th>
                    <th className={thClass}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {awaiting.map((booking) => (
                    <tr key={booking.id} className="border-t border-background-100">
                      <td className={tdClass}>
                        <Link to={`/admin/bookings/${booking.id}`} className="font-medium text-foreground-950 hover:text-primary-700">
                          {booking.guest_name}
                        </Link>
                      </td>
                      <td className={`${tdClass} text-foreground-700`}>{booking.stay?.title ?? '—'}</td>
                      <td className={`${tdClass} text-foreground-600`}>{booking.check_out}</td>
                      <td className={`${tdClass} text-foreground-700`}>{formatPKR(booking.total, booking.currency)}</td>
                      <td className={tdClass}><Badge tone="secondary" icon="ri-time-line">Review due</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-foreground-950/50" onClick={() => setSelected(null)} aria-hidden="true" />
          <div className="relative w-full max-w-lg rounded-card border border-background-200 bg-background-50 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground-950">{selected.guest_name}</h2>
                <p className="text-sm text-foreground-600">{selected.stay?.title ?? 'Stay'}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Stars rating={selected.rating} />
              <Badge tone={STATUS_META[selected.status].tone} icon={STATUS_META[selected.status].icon}>
                {STATUS_META[selected.status].label}
              </Badge>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground-700">
              {selected.comment || 'No comment provided.'}
            </p>
            <p className="mt-4 text-xs text-foreground-500">
              Submitted {new Date(selected.created_at).toLocaleString()}
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {selected.status !== 'HIDDEN' && (
                <button type="button" disabled={busy} onClick={() => setPendingAction({ review: selected, status: 'HIDDEN' })} className={btnGhost}>
                  <i className="ri-eye-off-line text-base"></i> Hide
                </button>
              )}
              {selected.status !== 'FLAGGED' && (
                <button type="button" disabled={busy} onClick={() => applyStatus(selected, 'FLAGGED')} className={`${btnSmall} border-accent-300 text-accent-800 hover:bg-accent-50`}>
                  <i className="ri-flag-2-line"></i> Flag
                </button>
              )}
              {selected.status !== 'PUBLISHED' && (
                <button type="button" disabled={busy} onClick={() => applyStatus(selected, 'PUBLISHED')} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                  <i className="ri-refresh-line"></i> Restore
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingAction !== null}
        title="Hide this review?"
        message="Hiding removes the review from the public stay page. You can restore it at any time."
        confirmLabel="Hide review"
        tone="accent"
        busy={busy}
        onConfirm={() => pendingAction && applyStatus(pendingAction.review, pendingAction.status)}
        onCancel={() => setPendingAction(null)}
      />
    </AdminLayout>
  );
}