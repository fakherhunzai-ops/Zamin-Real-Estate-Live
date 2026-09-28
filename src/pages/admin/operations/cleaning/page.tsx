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
  btnPrimary,
  btnSmall,
  inputClass,
  selectClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from '@/pages/admin/components/AdminUI';
import { useCleaningTasks } from '@/hooks/useCleaningTasks';
import { useStays } from '@/hooks/useStays';
import { useBookings } from '@/hooks/useBookings';
import { createCleaningTask, deleteCleaningTask, updateCleaningTask } from '@/utils/opsTasks';
import type { CleaningStatus, CleaningTaskRecord } from '@/types/stays';

const STATUS_META: Record<CleaningStatus, { label: string; tone: 'accent' | 'secondary' | 'primary' | 'muted' | 'urgent'; icon: string }> = {
  TO_DO: { label: 'To Do', tone: 'accent', icon: 'ri-time-line' },
  ASSIGNED: { label: 'Assigned', tone: 'secondary', icon: 'ri-user-received-line' },
  IN_PROGRESS: { label: 'In Progress', tone: 'primary', icon: 'ri-loader-4-line' },
  COMPLETED: { label: 'Completed', tone: 'muted', icon: 'ri-check-double-line' },
  ISSUE: { label: 'Issue', tone: 'urgent', icon: 'ri-error-warning-line' },
};

const CLEANERS = ['Ayesha', 'Karim', 'Sana', 'Rahul', 'Fatima'];

type EditorState = {
  id: string | null;
  stay_id: string;
  booking_id: string | null;
  assigned_to: string;
  status: CleaningStatus;
  scheduled_date: string;
  notes: string;
};

const emptyEditor = (): EditorState => ({
  id: null,
  stay_id: '',
  booking_id: null,
  assigned_to: '',
  status: 'TO_DO',
  scheduled_date: '',
  notes: '',
});

export default function AdminCleaningPage() {
  const { tasks, loading, error, refetch } = useCleaningTasks();
  const { stays } = useStays({ includeDrafts: true });
  const { bookings } = useBookings();
  const { notify } = useAdminToast();

  const [filter, setFilter] = useState<'ALL' | CleaningStatus>('ALL');
  const [search, setSearch] = useState('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CleaningTaskRecord | null>(null);
  const [busy, setBusy] = useState(false);

  const stayName = (id: string) => stays.find((stay) => stay.id === id)?.title ?? 'Stay';
  const todayIso = new Date().toISOString().slice(0, 10);

  const counts = useMemo(
    () => ({
      toDo: tasks.filter((task) => task.status === 'TO_DO').length,
      inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS' || task.status === 'ASSIGNED').length,
      completed: tasks.filter((task) => task.status === 'COMPLETED').length,
      issues: tasks.filter((task) => task.status === 'ISSUE').length,
    }),
    [tasks],
  );

  const q = search.trim().toLowerCase();
  const filtered = tasks.filter((task) => {
    if (filter !== 'ALL' && task.status !== filter) return false;
    if (q && !`${stayName(task.stay_id)} ${task.assigned_to ?? ''} ${task.notes ?? ''}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const taskBookingIds = useMemo(
    () => new Set(tasks.map((task) => task.booking_id).filter(Boolean) as string[]),
    [tasks],
  );
  const turnovers = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === 'CHECKED_OUT' && !taskBookingIds.has(booking.id))
        .sort((a, b) => b.check_out.localeCompare(a.check_out)),
    [bookings, taskBookingIds],
  );

  const openCreate = (booking?: { id: string; stay_id: string; check_out: string }) => {
    setEditor(
      booking
        ? { ...emptyEditor(), stay_id: booking.stay_id, booking_id: booking.id, scheduled_date: booking.check_out }
        : emptyEditor(),
    );
  };

  const openEdit = (task: CleaningTaskRecord) => {
    setEditor({
      id: task.id,
      stay_id: task.stay_id,
      booking_id: task.booking_id,
      assigned_to: task.assigned_to ?? '',
      status: task.status,
      scheduled_date: task.scheduled_date ?? '',
      notes: task.notes ?? '',
    });
  };

  const saveEditor = async () => {
    if (!editor) return;
    if (!editor.stay_id) {
      notify({ title: 'Pick a stay', message: 'A cleaning task must belong to a property.', tone: 'error' });
      return;
    }
    setBusy(true);
    try {
      const payload = {
        assigned_to: editor.assigned_to.trim() || null,
        status: editor.status,
        scheduled_date: editor.scheduled_date || null,
        notes: editor.notes.trim() || null,
      };
      if (editor.id) {
        await updateCleaningTask(editor.id, payload);
      } else {
        await createCleaningTask({ stay_id: editor.stay_id, booking_id: editor.booking_id, ...payload });
      }
      await refetch();
      notify({ title: editor.id ? 'Task updated' : 'Task created', tone: 'success' });
      setEditor(null);
    } catch (err) {
      notify({ title: 'Could not save task', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const advance = async (task: CleaningTaskRecord, status: CleaningStatus) => {
    setBusy(true);
    try {
      await updateCleaningTask(task.id, { status });
      await refetch();
      notify({ title: `Task marked ${STATUS_META[status].label}`, tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not update task', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      await deleteCleaningTask(pendingDelete.id);
      await refetch();
      notify({ title: 'Task deleted', tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not delete task', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
      setPendingDelete(null);
    }
  };

  return (
    <AdminLayout
      title="Cleaning Operations"
      subtitle="Assign cleaners, track turnover statuses and keep housekeeping moving."
      actions={
        <>
          <Link to="/admin/operations/maintenance" className={btnGhost}>
            <i className="ri-hammer-line text-base"></i> Maintenance
          </Link>
          <button type="button" onClick={() => openCreate()} className={btnPrimary}>
            <i className="ri-add-line text-base"></i> New task
          </button>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="To Do" value={counts.toDo} icon="ri-time-line" tone="accent" />
        <StatCard label="Assigned / In Progress" value={counts.inProgress} icon="ri-loader-4-line" tone="primary" />
        <StatCard label="Completed" value={counts.completed} icon="ri-check-double-line" />
        <StatCard label="Issues reported" value={counts.issues} icon="ri-error-warning-line" />
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4 md:flex-row md:items-center">
        <div className="relative md:max-w-md md:flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
            <i className="ri-search-line text-base"></i>
          </span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search stay, cleaner or note" className={`${inputClass} pl-9`} />
        </div>
        <Segmented
          options={[
            { value: 'ALL', label: 'All' },
            { value: 'TO_DO', label: 'To Do' },
            { value: 'ASSIGNED', label: 'Assigned' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'ISSUE', label: 'Issues' },
          ]}
          value={filter}
          onChange={(value) => setFilter(value as 'ALL' | CleaningStatus)}
        />
      </div>

      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load cleaning tasks." onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="ri-brush-line"
          title={tasks.length === 0 ? 'No cleaning tasks yet.' : 'No tasks match this view.'}
          message={tasks.length === 0 ? 'Create a task from a completed booking below, or add one manually.' : undefined}
          action={
            <button type="button" onClick={() => openCreate()} className={btnPrimary}>
              <i className="ri-add-line text-base"></i> New task
            </button>
          }
        />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Stay</th>
                <th className={thClass}>Scheduled</th>
                <th className={thClass}>Assigned Cleaner</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Notes</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => {
                const meta = STATUS_META[task.status];
                const urgent = task.status !== 'COMPLETED' && task.scheduled_date !== null && task.scheduled_date <= todayIso;
                return (
                  <tr key={task.id} className={`border-t border-background-100 align-top ${urgent ? 'bg-accent-50' : ''}`}>
                    <td className={tdClass}>
                      <Link to={`/admin/stays/${task.stay_id}`} className="font-medium text-foreground-950 hover:text-primary-700">
                        {stayName(task.stay_id)}
                      </Link>
                    </td>
                    <td className={`${tdClass} text-foreground-700`}>
                      {task.scheduled_date ?? '—'}
                      {urgent && <Badge tone="urgent" className="ml-2">Due</Badge>}
                    </td>
                    <td className={`${tdClass} text-foreground-700`}>{task.assigned_to || <span className="text-foreground-400">Unassigned</span>}</td>
                    <td className={tdClass}><Badge tone={meta.tone} icon={meta.icon}>{meta.label}</Badge></td>
                    <td className={`${tdClass} max-w-[220px] text-foreground-600`}>{task.notes || '—'}</td>
                    <td className={tdClass}>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {task.status === 'TO_DO' && (
                          <button type="button" disabled={busy} onClick={() => advance(task, 'IN_PROGRESS')} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                            <i className="ri-play-line"></i> Start
                          </button>
                        )}
                        {task.status !== 'COMPLETED' && (
                          <button type="button" disabled={busy} onClick={() => advance(task, 'COMPLETED')} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                            <i className="ri-check-line"></i> Done
                          </button>
                        )}
                        <button type="button" onClick={() => openEdit(task)} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                          <i className="ri-edit-line"></i> Edit
                        </button>
                        <button type="button" onClick={() => setPendingDelete(task)} className={`${btnSmall} border-primary-200 text-primary-700 hover:bg-primary-50`}>
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

      <div className="mt-6">
        <Card title="Turnovers needing a task" icon="ri-magic-line" bodyClassName="p-0">
          {turnovers.length === 0 ? (
            <div className="p-5">
              <EmptyState compact icon="ri-check-double-line" title="Every completed stay has a cleaning task." />
            </div>
          ) : (
            <ul className="divide-y divide-background-100">
              {turnovers.slice(0, 10).map((booking) => (
                <li key={booking.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground-900">{booking.stay?.title ?? 'Stay'}</p>
                    <p className="text-xs text-foreground-500">Checked out {booking.check_out} · after {booking.guest_name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreate({ id: booking.id, stay_id: booking.stay_id, check_out: booking.check_out })}
                    className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}
                  >
                    <i className="ri-add-line"></i> Create task
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {editor && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-foreground-950/50" onClick={() => setEditor(null)} aria-hidden="true" />
          <div className="relative w-full max-w-lg rounded-card border border-background-200 bg-background-50 p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold text-foreground-950">
                {editor.id ? 'Edit cleaning task' : 'New cleaning task'}
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
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Assigned cleaner</span>
                <input list="cleaner-list" className={inputClass} value={editor.assigned_to} placeholder="Unassigned" onChange={(event) => setEditor({ ...editor, assigned_to: event.target.value })} />
                <datalist id="cleaner-list">
                  {CLEANERS.map((name) => <option key={name} value={name} />)}
                </datalist>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Scheduled date</span>
                <input type="date" className={inputClass} value={editor.scheduled_date} onChange={(event) => setEditor({ ...editor, scheduled_date: event.target.value })} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Status</span>
                <select className={selectClass} value={editor.status} onChange={(event) => setEditor({ ...editor, status: event.target.value as CleaningStatus })}>
                  {Object.entries(STATUS_META).map(([value, meta]) => (
                    <option key={value} value={value}>{meta.label}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground-600">Notes</span>
                <textarea className={`${inputClass} min-h-[80px]`} value={editor.notes} onChange={(event) => setEditor({ ...editor, notes: event.target.value })} />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditor(null)} className={btnGhost}>Cancel</button>
              <button type="button" disabled={busy} onClick={saveEditor} className={btnPrimary}>
                {busy && <i className="ri-loader-4-line animate-spin"></i>}
                {editor.id ? 'Save task' : 'Create task'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this cleaning task?"
        message="This removes the task from the operations board."
        confirmLabel="Delete"
        tone="accent"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
}