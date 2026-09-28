import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import ConfirmDialog from '@/pages/admin/components/ConfirmDialog';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  EmptyState,
  ErrorState,
  LoadingBlock,
  ManagementBadge,
  Pagination,
  Segmented,
  StayStatusBadge,
  VerifiedBadge,
  btnGhost,
  btnPrimary,
  btnSmall,
  inputClass,
  selectClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from '@/pages/admin/components/AdminUI';
import { useStays } from '@/hooks/useStays';
import { useBookings } from '@/hooks/useBookings';
import { coverImage, formatPKR } from '@/utils/stays';
import { deleteStay, setStayFeatured, setStayStatus, setStayVerified } from '@/utils/stayAdmin';
import type { ManagementType, Stay, StayStatus } from '@/types/stays';

const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: StayStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rate-desc', label: 'Rate: high to low' },
  { value: 'rate-asc', label: 'Rate: low to high' },
  { value: 'name', label: 'Name A–Z' },
];

export default function AdminStaysPage() {
  const { stays, loading, error, refetch } = useStays({ includeDrafts: true });
  const { bookings, refetch: refetchBookings } = useBookings();
  const { notify } = useAdminToast();

  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('ALL');
  const [status, setStatus] = useState<StayStatus | 'ALL'>('ALL');
  const [management, setManagement] = useState<ManagementType | 'ALL'>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Stay[] | null>(null);

  const bookingCounts = useMemo(
    () =>
      bookings.reduce<Record<string, number>>((acc, booking) => {
        acc[booking.stay_id] = (acc[booking.stay_id] ?? 0) + 1;
        return acc;
      }, {}),
    [bookings],
  );

  const destinations = useMemo(() => {
    const map = new Map<string, string>();
    stays.forEach((stay) => {
      if (stay.destination) map.set(stay.destination.id, stay.destination.name);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [stays]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = stays.filter((stay) => {
      if (q && !`${stay.title} ${stay.slug} ${stay.host_name ?? ''}`.toLowerCase().includes(q)) return false;
      if (destination !== 'ALL' && stay.destination_id !== destination) return false;
      if (status !== 'ALL' && stay.status !== status) return false;
      if (management !== 'ALL' && stay.management_type !== management) return false;
      if (verifiedOnly && !stay.verified) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'rate-desc') return b.base_nightly_rate - a.base_nightly_rate;
      if (sort === 'rate-asc') return a.base_nightly_rate - b.base_nightly_rate;
      if (sort === 'name') return a.title.localeCompare(b.title);
      return b.created_at.localeCompare(a.created_at);
    });
    return list;
  }, [stays, search, destination, status, management, verifiedOnly, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((stay) => selected.includes(stay.id));

  const afterChange = async () => {
    await refetch();
    await refetchBookings();
  };

  const runAction = async (fn: () => Promise<void>, successMessage: string) => {
    setBusy(true);
    try {
      await fn();
      await afterChange();
      notify({ title: successMessage, tone: 'success' });
    } catch (err) {
      notify({ title: 'Action failed', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const runBulk = async (fn: (id: string) => Promise<void>, successMessage: string) => {
    if (selected.length === 0) return;
    setBusy(true);
    try {
      await Promise.all(selected.map((id) => fn(id)));
      await afterChange();
      notify({ title: successMessage, message: `${selected.length} stay(s) updated.`, tone: 'success' });
      setSelected([]);
    } catch (err) {
      notify({ title: 'Bulk action failed', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const targets = pendingDelete;
    setBusy(true);
    try {
      await Promise.all(targets.map((stay) => deleteStay(stay.id)));
      await afterChange();
      notify({ title: 'Deleted', message: `${targets.length} stay(s) removed.`, tone: 'success' });
      setSelected([]);
    } catch (err) {
      notify({ title: 'Delete failed', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
      setPendingDelete(null);
    }
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const toggleAllOnPage = () => {
    if (allOnPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageRows.some((stay) => stay.id === id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageRows.map((stay) => stay.id)])]);
    }
  };

  const hasFilters = search || destination !== 'ALL' || status !== 'ALL' || management !== 'ALL' || verifiedOnly;

  return (
    <AdminLayout
      title="All Stays"
      subtitle="Manage short-term rental properties."
      actions={
        <Link to="/admin/stays/new" className={btnPrimary}>
          <i className="ri-add-line text-base"></i> Add New Stay
        </Link>
      }
    >
      <div className="mb-4 flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
              <i className="ri-search-line text-base"></i>
            </span>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search stay"
              className={`${inputClass} pl-9`}
            />
          </div>
          <select className={selectClass} value={destination} onChange={(event) => { setDestination(event.target.value); setPage(1); }}>
            <option value="ALL">All destinations</option>
            {destinations.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <select className={selectClass} value={management} onChange={(event) => { setManagement(event.target.value as ManagementType | 'ALL'); setPage(1); }}>
            <option value="ALL">All management</option>
            <option value="LISTED">ZAMIN Listed</option>
            <option value="MANAGED">ZAMIN Managed</option>
          </select>
          <select className={selectClass} value={sort} onChange={(event) => setSort(event.target.value)}>
            {SORTS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Status</span>
          <Segmented
            options={STATUS_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
            value={status}
            onChange={(value) => {
              setStatus(value as StayStatus | 'ALL');
              setPage(1);
            }}
          />
          <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground-700">
            <input type="checkbox" className="h-4 w-4 cursor-pointer accent-primary-700" checked={verifiedOnly} onChange={(event) => { setVerifiedOnly(event.target.checked); setPage(1); }} />
            Verified only
          </label>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-card border border-accent-300 bg-accent-50 px-4 py-3">
          <span className="text-sm font-semibold text-accent-900">{selected.length} selected</span>
          <div className="ml-auto flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => runBulk((id) => setStayStatus(id, 'VERIFIED'), 'Verified')} className={`${btnSmall} border-accent-300 text-accent-900 hover:bg-accent-100`}>
              <i className="ri-shield-check-line"></i> Verify
            </button>
            <button type="button" disabled={busy} onClick={() => runBulk((id) => setStayStatus(id, 'PUBLISHED'), 'Published')} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
              <i className="ri-upload-cloud-2-line"></i> Publish
            </button>
            <button type="button" disabled={busy} onClick={() => runBulk((id) => setStayStatus(id, 'PAUSED'), 'Paused')} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
              <i className="ri-pause-circle-line"></i> Pause
            </button>
            <button type="button" disabled={busy} onClick={() => runBulk((id) => setStayStatus(id, 'ARCHIVED'), 'Archived')} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
              <i className="ri-archive-line"></i> Archive
            </button>
            <button type="button" disabled={busy} onClick={() => setPendingDelete(stays.filter((stay) => selected.includes(stay.id)))} className={`${btnSmall} border-primary-200 text-primary-700 hover:bg-primary-50`}>
              <i className="ri-delete-bin-line"></i> Delete
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingBlock rows={8} />
      ) : error ? (
        <ErrorState message="Couldn’t load stays." onRetry={refetch} />
      ) : stays.length === 0 ? (
        <EmptyState
          icon="ri-home-4-line"
          title="No stays yet"
          message="Add your first ZAMIN Stays property. Nothing is public until you set it to PUBLISHED."
          action={
            <Link to="/admin/stays/new" className={btnPrimary}>
              <i className="ri-add-line text-base"></i> Add your first stay
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="ri-search-eye-line"
          title="No stays match your filters"
          message="Try clearing the search or picking a different destination."
          action={
            hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setDestination('ALL');
                  setStatus('ALL');
                  setManagement('ALL');
                  setVerifiedOnly(false);
                }}
                className={btnGhost}
              >
                <i className="ri-close-line text-base"></i> Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={`${thClass} w-10`}>
                  <input type="checkbox" className="h-4 w-4 cursor-pointer accent-primary-700" checked={allOnPageSelected} onChange={toggleAllOnPage} aria-label="Select all" />
                </th>
                <th className={thClass}>Stay</th>
                <th className={thClass}>Destination</th>
                <th className={thClass}>Host</th>
                <th className={thClass}>Management</th>
                <th className={thClass}>Nightly Rate</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Verified</th>
                <th className={thClass}>Bookings</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((stay) => {
                const image = coverImage(stay);
                return (
                  <tr key={stay.id} className="border-t border-background-100 align-top">
                    <td className={tdClass}>
                      <input type="checkbox" className="mt-1 h-4 w-4 cursor-pointer accent-primary-700" checked={selected.includes(stay.id)} onChange={() => toggleSelect(stay.id)} aria-label={`Select ${stay.title}`} />
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-background-100">
                          {image ? (
                            <img src={image} alt={stay.title} className="h-full w-full object-cover object-top" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-background-400">
                              <i className="ri-image-line"></i>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link to={`/admin/stays/${stay.id}`} className="font-medium text-foreground-950 hover:text-primary-700">
                            {stay.title}
                          </Link>
                          <p className="mt-0.5 text-xs text-foreground-500">{stay.category?.name ?? 'Uncategorised'}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${tdClass} text-foreground-700`}>
                      {[stay.area?.name, stay.destination?.name].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className={`${tdClass} text-foreground-700`}>{stay.host_name || '—'}</td>
                    <td className={tdClass}>
                      <ManagementBadge type={stay.management_type} />
                    </td>
                    <td className={`${tdClass} font-semibold text-primary-700`}>{formatPKR(stay.base_nightly_rate, stay.currency)}</td>
                    <td className={tdClass}>
                      <StayStatusBadge status={stay.status} />
                    </td>
                    <td className={tdClass}>
                      <VerifiedBadge verified={stay.verified} />
                    </td>
                    <td className={`${tdClass} text-foreground-700`}>{bookingCounts[stay.id] ?? 0}</td>
                    <td className={tdClass}>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Link to={`/admin/stays/${stay.id}`} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                          <i className="ri-eye-line"></i> View
                        </Link>
                        <Link to={`/admin/stays/${stay.id}/edit`} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                          <i className="ri-edit-line"></i> Edit
                        </Link>
                        <Link to={`/admin/calendar?stay=${stay.id}`} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                          <i className="ri-calendar-2-line"></i>
                        </Link>
                        <Link to={`/admin/pricing?stay=${stay.id}`} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                          <i className="ri-price-tag-3-line"></i>
                        </Link>
                        <button type="button" disabled={busy} onClick={() => runAction(() => setStayFeatured(stay.id, !stay.featured), stay.featured ? 'Unfeatured' : 'Featured')} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                          <i className={stay.featured ? 'ri-star-fill text-accent-600' : 'ri-star-line'}></i>
                        </button>
                        {stay.status === 'PUBLISHED' ? (
                          <button type="button" disabled={busy} onClick={() => runAction(() => setStayStatus(stay.id, 'PAUSED'), 'Listing paused')} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                            <i className="ri-pause-circle-line"></i>
                          </button>
                        ) : (
                          <button type="button" disabled={busy} onClick={() => runAction(() => setStayStatus(stay.id, 'PUBLISHED'), 'Stay published')} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                            <i className="ri-upload-cloud-2-line"></i>
                          </button>
                        )}
                        <button type="button" disabled={busy} onClick={() => setPendingDelete([stay])} className={`${btnSmall} border-primary-200 text-primary-700 hover:bg-primary-50`}>
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination page={current} pageCount={pageCount} onPage={setPage} total={filtered.length} />
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete && pendingDelete.length > 1 ? `Delete ${pendingDelete.length} stays?` : 'Delete this stay?'}
        message="This permanently removes the stay and its images. This can’t be undone."
        confirmLabel="Delete"
        tone="accent"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
}