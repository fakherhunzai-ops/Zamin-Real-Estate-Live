import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import ConfirmDialog from '@/pages/admin/components/ConfirmDialog';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  EmptyState,
  ErrorState,
  LoadingBlock,
  StayStatusBadge,
  btnGhost,
  btnPrimary,
  btnSmall,
  inputClass,
} from '@/pages/admin/components/AdminUI';
import { useStays } from '@/hooks/useStays';
import { coverImage, formatPKR, stayAmenities } from '@/utils/stays';
import { setStayStatus, setStayVerified } from '@/utils/stayAdmin';
import type { Stay } from '@/types/stays';

const CHECKLIST = [
  { id: 'owner', label: 'Owner Verified' },
  { id: 'inspection', label: 'Property Inspected' },
  { id: 'address', label: 'Address Checked' },
  { id: 'images', label: 'Images Checked' },
  { id: 'amenities', label: 'Amenities Verified' },
  { id: 'license', label: 'License Checked' },
  { id: 'safety', label: 'Safety Checked' },
];

function initialChecklist(stay: Stay): Record<string, boolean> {
  return {
    owner: Boolean(stay.host_name && stay.host_phone),
    inspection: false,
    address: Boolean(stay.address),
    images: (stay.images ?? []).length >= 3,
    amenities: stayAmenities(stay).length > 0,
    license: false,
    safety: false,
  };
}

export default function AdminStaysPendingPage() {
  const { stays, loading, error, refetch } = useStays({ includeDrafts: true });
  const { notify } = useAdminToast();
  const [checks, setChecks] = useState<Record<string, Record<string, boolean>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Stay | null>(null);

  const pending = useMemo(() => stays.filter((stay) => stay.status === 'PENDING'), [stays]);

  const checklistFor = (stay: Stay) => checks[stay.id] ?? initialChecklist(stay);

  const toggle = (stay: Stay, id: string) =>
    setChecks((prev) => ({
      ...prev,
      [stay.id]: { ...(prev[stay.id] ?? initialChecklist(stay)), [id]: !(prev[stay.id] ?? initialChecklist(stay))[id] },
    }));

  const progressFor = (stay: Stay) => {
    const list = checklistFor(stay);
    const done = CHECKLIST.filter((item) => list[item.id]).length;
    return Math.round((done / CHECKLIST.length) * 100);
  };

  const approve = async (stay: Stay) => {
    setBusyId(stay.id);
    try {
      await setStayVerified(stay.id, true);
      await setStayStatus(stay.id, 'VERIFIED');
      await refetch();
      notify({ title: 'Stay verified', message: `${stay.title} is now verified. Publish when ready.`, tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not verify', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  const publish = async (stay: Stay) => {
    setBusyId(stay.id);
    try {
      await setStayStatus(stay.id, 'PUBLISHED');
      await refetch();
      notify({ title: 'Stay published', message: `${stay.title} is now live on the site.`, tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not publish', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  const requestChanges = async (stay: Stay) => {
    setBusyId(stay.id);
    try {
      await setStayStatus(stay.id, 'DRAFT');
      await refetch();
      notify({ title: 'Changes requested', message: `${stay.title} was sent back as a draft.`, tone: 'info' });
    } catch (err) {
      notify({ title: 'Could not update', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    const stay = rejectTarget;
    setBusyId(stay.id);
    try {
      await setStayStatus(stay.id, 'ARCHIVED');
      await refetch();
      notify({ title: 'Submission rejected', message: `${stay.title} was archived.`, tone: 'info' });
    } catch (err) {
      notify({ title: 'Could not reject', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusyId(null);
      setRejectTarget(null);
    }
  };

  return (
    <AdminLayout title="Pending Verification" subtitle="Review host submissions before they go live.">
      {loading ? (
        <LoadingBlock rows={5} />
      ) : error ? (
        <ErrorState message="Couldn’t load submissions." onRetry={refetch} />
      ) : pending.length === 0 ? (
        <EmptyState
          icon="ri-shield-check-line"
          title="No stays awaiting verification."
          message="New host submissions will appear here for review."
          action={
            <Link to="/admin/stays" className={btnGhost}>
              <i className="ri-home-4-line text-base"></i> All stays
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-5">
          {pending.map((stay) => {
            const list = checklistFor(stay);
            const progress = progressFor(stay);
            const busy = busyId === stay.id;
            const image = coverImage(stay);
            return (
              <article key={stay.id} className="overflow-hidden rounded-card border border-background-200 bg-background-50">
                <div className="flex flex-col gap-4 border-b border-background-100 p-5 lg:flex-row">
                  <div className="h-40 w-full shrink-0 overflow-hidden rounded-md bg-background-100 lg:h-28 lg:w-40">
                    {image ? (
                      <img src={image} alt={stay.title} className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-background-400">
                        <i className="ri-image-line text-3xl"></i>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-lg font-semibold text-foreground-950">{stay.title}</h2>
                      <StayStatusBadge status={stay.status} />
                    </div>
                    <p className="mt-1 text-sm text-foreground-600">
                      {[stay.area?.name, stay.destination?.name].filter(Boolean).join(', ') || 'No location'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-foreground-600">
                      <span className="flex items-center gap-1.5">
                        <i className="ri-user-line text-base text-accent-600"></i>
                        {stay.host_name || 'Unknown host'}
                      </span>
                      {stay.host_phone && (
                        <span className="flex items-center gap-1.5">
                          <i className="ri-phone-line text-base text-accent-600"></i>
                          {stay.host_phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <i className="ri-price-tag-3-line text-base text-accent-600"></i>
                        {formatPKR(stay.base_nightly_rate, stay.currency)} / night
                      </span>
                      <span className="flex items-center gap-1.5">
                        <i className="ri-calendar-line text-base text-accent-600"></i>
                        Submitted {new Date(stay.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 w-40 overflow-hidden rounded-full bg-background-200">
                        <div className="h-full rounded-full bg-accent-500" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground-600">{progress}% verified</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-start gap-2 lg:flex-col">
                    <Link to={`/admin/stays/${stay.id}`} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                      <i className="ri-eye-line"></i> Full details
                    </Link>
                    <Link to={`/admin/stays/${stay.id}/edit`} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                      <i className="ri-edit-line"></i> Edit
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <p className="mb-3 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">
                      Verification checklist
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {CHECKLIST.map((item) => (
                        <label key={item.id} className="flex cursor-pointer items-center gap-2.5 rounded-md border border-background-200 px-3 py-2.5 text-sm text-foreground-800 transition-colors hover:bg-background-100">
                          <input type="checkbox" className="h-4 w-4 cursor-pointer accent-primary-700" checked={list[item.id]} onChange={() => toggle(stay, item.id)} />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="mb-2 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">
                        Internal notes
                      </p>
                      <textarea
                        rows={4}
                        value={notes[stay.id] ?? ''}
                        onChange={(event) => setNotes((prev) => ({ ...prev, [stay.id]: event.target.value }))}
                        placeholder="Inspection findings, follow-ups…"
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <button type="button" disabled={busy} onClick={() => approve(stay)} className={`${btnSmall} border-accent-300 text-accent-900 hover:bg-accent-100`}>
                        <i className="ri-shield-check-line"></i> Approve &amp; Verify
                      </button>
                      <button type="button" disabled={busy || stay.status !== 'VERIFIED'} onClick={() => publish(stay)} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                        <i className="ri-upload-cloud-2-line"></i> Publish
                      </button>
                      <button type="button" disabled={busy} onClick={() => requestChanges(stay)} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                        <i className="ri-arrow-go-back-line"></i> Request changes
                      </button>
                      <button type="button" disabled={busy} onClick={() => setRejectTarget(stay)} className={`${btnSmall} border-primary-200 text-primary-700 hover:bg-primary-50`}>
                        <i className="ri-close-circle-line"></i> Reject
                      </button>
                    </div>
                    <p className="text-xs text-foreground-500">
                      Verified properties only show the “Verified by ZAMIN” badge after approval.
                    </p>
                    {stay.verified && <Badge tone="accent" icon="ri-shield-check-fill">Already verified</Badge>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={rejectTarget !== null}
        title="Reject this submission?"
        message={rejectTarget ? `“${rejectTarget.title}” will be archived and won’t be published.` : undefined}
        confirmLabel="Reject & archive"
        tone="accent"
        busy={busyId === rejectTarget?.id}
        onConfirm={confirmReject}
        onCancel={() => setRejectTarget(null)}
      />

      <div className="mt-6 flex justify-start">
        <Link to="/admin/stays" className={btnPrimary}>
          <i className="ri-home-4-line text-base"></i> Back to all stays
        </Link>
      </div>
    </AdminLayout>
  );
}