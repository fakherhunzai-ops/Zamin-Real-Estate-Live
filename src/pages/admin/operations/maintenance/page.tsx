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
  StatCard,
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
import { useMaintenanceIssues } from '@/hooks/useMaintenanceIssues';
import { useStays } from '@/hooks/useStays';
import { createMaintenanceIssue, deleteMaintenanceIssue, updateMaintenanceIssue } from '@/utils/opsTasks';
import { formatPKR } from '@/utils/stays';
import type { MaintenanceIssue, MaintenancePriority, MaintenanceStatus } from '@/types/stays';

const PRIORITY_META: Record<MaintenancePriority, { label: string; tone: 'muted' | 'secondary' | 'accent' | 'urgent' }> = {
  LOW: { label: 'Low', tone: 'muted' },
  MEDIUM: { label: 'Medium', tone: 'secondary' },
  HIGH: { label: 'High', tone: 'accent' },
  URGENT: { label: 'Urgent', tone: 'urgent' },
};

const STATUS_META: Record<MaintenanceStatus, { label: string; tone: 'accent' | 'primary' | 'muted'; icon: string }> = {
  OPEN: { label: 'Open', tone: 'accent', icon: 'ri-error-warning-line' },
  IN_PROGRESS: { label: 'In Progress', tone: 'primary', icon: 'ri-loader-4-line' },
  RESOLVED: { label: 'Resolved', tone: 'muted', icon: 'ri-check-double-line' },
};

type EditorState = {
  id: string | null;
  stay_id: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  assigned_to: string;
  cost: number;
  status: MaintenanceStatus;
  reported_date: string;
  notes: string;
};

const emptyEditor = (): EditorState => ({
  id: null,
  stay_id: '',
  title: '',
  description: '',
  priority: 'MEDIUM',
  assigned_to: '',
  cost: 0,
  status: 'OPEN',
  reported_date: new Date().toISOString().slice(0, 10),
  notes: '',
});

export default function AdminMaintenancePage() {
  const { issues, loading, error, refetch } = useMaintenanceIssues();
  const { stays } = useStays({ includeDrafts: true });
  const { notify } = useAdminToast();

  const [status, setStatus] = useState<'ALL' | MaintenanceStatus>('ALL');
  const [priority, setPriority] = useState<'ALL' | MaintenancePriority>('ALL');
  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MaintenanceIssue | null>(null);
  const [busy, setBusy] = useState(false);

  const stayName = (id: string) => stays.find((stay) => stay.id === id)?.title ?? 'Stay';

  const metrics = useMemo(() => {
    const open = issues.filter((issue) => issue.status === 'OPEN').length;
    const inProgress = issues.filter((issue) => issue.status === 'IN_PROGRESS').length;
    const resolved = issues.filter((issue) => issue.status === 'RESOLVED').length;
    const totalCost = issues.reduce((sum, issue) => sum + (issue.cost || 0), 0);
    return { open, inProgress, resolved, totalCost };
  }, [issues]);

  const q = search.trim().toLowerCase();
  const filtered = issues.filter((issue) => {
    if (status !== 'ALL' && issue.status !== status) return false;
    if (priority !== 'ALL' && issue.priority !== priority) return false;
    if (q && !`${stayName(issue.stay_id)} ${issue.title} ${issue.assigned_to ?? ''}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const openEdit = (issue: MaintenanceIssue) => {
    setEditor({
      id: issue.id,
      stay_id: issue.stay_id,
      title: issue.title,
      description: issue.description ?? '',
      priority: issue.priority,
      assigned_to: issue.assigned_to ?? '',
      cost: issue.cost,
      status: issue.status,
      reported_date: issue.reported_date,
      notes: issue.notes ?? '',
    });
  };

  const saveEditor = async () => {
    if (!editor) return;
    if (!editor.stay_id || !editor.title.trim()) {
      notify({ title: 'Missing details', message: 'Pick a stay and add an issue title.', tone: 'error' });
      return;
    }
    setBusy(true);
    try {
      const payload = {
        title: editor.title.trim(),
        description: editor.description.trim() || null,
        priority: editor.priority,
        assigned_to: editor.assigned_to.trim() || null,
        cost: editor.cost,
        status: editor.status,
        reported_date: editor.reported_date || new Date().toISOString().slice(0, 10),
        notes: editor.notes.trim() || null,
      };
      if (editor.id) {
        await updateMaintenanceIssue(editor.id, payload);
      } else {
        await createMaintenanceIssue({ stay_id: editor.stay_id, ...payload });
      }
      await refetch();
      notify({ title: editor.id ? 'Issue updated' : 'Issue logged', tone: 'success' });
      setEditor(null);
    } catch (err) {
      notify({ title: 'Could not save issue', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const setIssueStatus = async (issue: MaintenanceIssue, next: MaintenanceStatus) => {
    setBusy(true);
    try {
      await updateMaintenanceIssue(issue.id, { status: next });
      await refetch();
      notify({ title: `Marked ${STATUS_META[next].label}`, tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not update issue', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      await deleteMaintenanceIssue(pendingDelete.id);
      await refetch();
      notify({ title: 'Issue deleted', tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not delete issue', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
      setPendingDelete(null);
    }
  };

  return (
    <AdminLayout
      title="Maintenance"
      subtitle="Repairs, issues and property upkeep — with priority, cost and status tracking."
      actions={
        <>
          <Link to="/admin/operations/cleaning" className={btnGhost}>
            <i className="ri-brush-line text-base"></i> Cleaning
          </Link>
          <button type="button" onClick={() => setEditor(emptyEditor())} className={btnPrimary}>
            <i className="ri-add-line text-base"></i> Log issue
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Open" value={metrics.open} icon="ri-error-warning-line" tone="accent" />
        <StatCard label="In Progress" value={metrics.inProgress} icon="ri-loader-4-line" tone="primary" />
        <StatCard label="Resolved" value={metrics.resolved} icon="ri-check-double-line" />
        <StatCard label="Total cost" value={formatPKR(metrics.totalCost)} icon="ri-money-cny-circle-line" />
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
              <i className="ri-search-line text-base"></i>
            </span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stay or issue" className={`${inputClass} pl-9`} />
          </div>
          <select className={selectClass} value={status} onChange={(event) => setStatus(event.target.value as 'ALL' | MaintenanceStatus)}>
            <option value="ALL">All statuses</option>
            {Object.entries(STATUS_META).map(([value, meta]) => (
              <option key={value} value={value}>{meta.label}</option>
            ))}
          </select>
          <select className={selectClass} value={priority} onChange={(event) => setPriority(event.target.value as 'ALL' | MaintenancePriority)}>
            <option value="ALL">All priorities</option>
            {Object.entries(PRIORITY_META).map(([value, meta]) => (
              <option key={value} value={value}>{meta.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load maintenance issues." onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="ri-hammer-line"
          title={issues.length === 0 ? 'No maintenance issues logged.' : 'No issues match your filters.'}
          message={issues.length === 0 ? 'Log repairs and issues per property to track priority, cost and resolution.' : undefined}
          action={
            <button type="button" onClick={() => setEditor(emptyEditor())} className={btnPrimary}>
              <i className="ri-add-line text-base"></i> Log issue
            </button>
          }
        />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Stay</th>
                <th className={thClass}>Issue</th>
                <th className={thClass}>Priority</th>
                <th className={thClass}>Assigned To</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Cost</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((issue) => {
                const pMeta = PRIORITY_META[issue.priority];
                const sMeta = STATUS_META[issue.status];
                const urgent = issue.priority === 'URGENT' && issue.status !== 'RESOLVED';
                return (
                  <tr key={issue.id} className={`border-t border-background-100 align-top ${urgent ? 'bg-accent-50' : ''}`}>
                    <td className={tdClass}>
                      <Link to={`/admin/stays/${issue.stay_id}`} className="font-medium text-foreground-950 hover:text-primary-700">
                        {stayName(issue.stay_id)}
                      </Link>
                    </td>
                    <td className={`${tdClass} max-w-[260px]`}>
                      <p className="font-medium text-foreground-900">{issue.title}</p>
                      {issue.description && <p className="line-clamp-1 text-xs text-foreground-500">{issue.description}</p>}
                    </td>
                    <td className={tdClass}><Badge tone={pMeta.tone}>{pMeta.label}</Badge></td>
                    <td className={`${tdClass} text-foreground-700`}>{issue.assigned_to || <span className="text-foreground-400">Unassigned</span>}</td>
                    <td className={`${tdClass} text-foreground-600`}>{issue.reported_date}</td>
                    <td className={`${tdClass} font-semibold text-foreground-900`}>{formatPKR(issue.cost)}</td>
                    <td className={tdClass}><Badge tone={sMeta.tone} icon={sMeta.icon}>{sMeta.label}</Badge></td>
                    <td className={tdClass}>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {issue.status === 'OPEN' && (
                          <button type="button" disabled={busy} onClick={() => setIssueStatus(issue, 'IN_PROGRESS')} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                            <i className="ri-play-line"></i> Start
                          </button>
                        )}
                        {issue.status !== 'RESOLVED' && (
                          <button type="button" disabled={busy} onClick={() => setIssueStatus(issue, 'RESOLVED')} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                            <i className="ri-check-line"></i> Resolve
                          </button>
                        )}
                        <button type="button" onClick={() => openEdit(issue)} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                          <i className="ri-edit-line"></i> Edit
                        </button>
                        <button type="button" onClick={() => setPendingDelete(issue)} className={`${btnSmall} border-primary-200 text-primary-700 hover:bg-primary-50`}>
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editor && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-foreground-950/50" onClick={() => setEditor(null)} aria-hidden="true" />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card border border-background-200 bg-background-50 p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold text-foreground-950">
                {editor.id ? 'Edit maintenance issue' : 'Log maintenance issue'}
              </h2>
              <button type="button" onClick={() => setEditor(null)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Stay</span>
                <select className={selectClass} value={editor.stay_id} disabled={Boolean(editor.id)} onChange={(event) => setEditor({ ...editor, stay_id: event.target.value })}>
                  <option value="">Select a stay</option>
                  {stays.map((stay) => (
                    <option key={stay.id} value={stay.id}>{stay.title}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Issue title</span>
                <input className={inputClass} value={editor.title} placeholder="e.g. Leaking bathroom tap" onChange={(event) => setEditor({ ...editor, title: event.target.value })} />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Description</span>
                <textarea className={`${inputClass} min-h-[80px]`} value={editor.description} onChange={(event) => setEditor({ ...editor, description: event.target.value })} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Priority</span>
                <select className={selectClass} value={editor.priority} onChange={(event) => setEditor({ ...editor, priority: event.target.value as MaintenancePriority })}>
                  {Object.entries(PRIORITY_META).map(([value, meta]) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Status</span>
                <select className={selectClass} value={editor.status} onChange={(event) => setEditor({ ...editor, status: event.target.value as MaintenanceStatus })}>
                  {Object.entries(STATUS_META).map(([value, meta]) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Assigned to</span>
                <input className={inputClass} value={editor.assigned_to} placeholder="Unassigned" onChange={(event) => setEditor({ ...editor, assigned_to: event.target.value })} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Cost (PKR)</span>
                <input type="number" min={0} className={inputClass} value={editor.cost} onChange={(event) => setEditor({ ...editor, cost: Number(event.target.value) || 0 })} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Reported date</span>
                <input type="date" className={inputClass} value={editor.reported_date} onChange={(event) => setEditor({ ...editor, reported_date: event.target.value })} />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Notes</span>
                <textarea className={`${inputClass} min-h-[70px]`} value={editor.notes} onChange={(event) => setEditor({ ...editor, notes: event.target.value })} />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditor(null)} className={btnGhost}>Cancel</button>
              <button type="button" disabled={busy} onClick={saveEditor} className={btnPrimary}>
                {busy && <i className="ri-loader-4-line animate-spin"></i>}
                {editor.id ? 'Save issue' : 'Log issue'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this maintenance issue?"
        message="This removes the issue and its cost record."
        confirmLabel="Delete"
        tone="accent"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
}