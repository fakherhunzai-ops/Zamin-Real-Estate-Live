import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  EmptyState,
  ErrorState,
  LoadingBlock,
  btnGhost,
  btnPrimary,
  inputClass,
  labelClass,
  selectClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from '@/pages/admin/components/AdminUI';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/stays';

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
};

const emptyForm = { id: '', slug: '', name: '', description: '', icon: 'ri-home-4-line', is_active: true };

export default function AdminStayCategoriesPage() {
  const { notify } = useAdminToast();
  const [rows, setRows] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase.from('stay_categories').select('*').order('sort_order', { ascending: true });
      if (queryError) throw queryError;
      setRows((data as CategoryRow[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!form.name.trim()) {
      notify({ title: 'Name is required', tone: 'error' });
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)).toLowerCase(),
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
      is_active: form.is_active,
    };
    try {
      if (form.id) {
        const { error: updateError } = await supabase.from('stay_categories').update(payload).eq('id', form.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('stay_categories').insert({ ...payload, sort_order: rows.length });
        if (insertError) throw insertError;
      }
      await load();
      notify({ title: form.id ? 'Category updated' : 'Category added', tone: 'success' });
      setOpen(false);
    } catch (err) {
      notify({ title: 'Could not save', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (row: CategoryRow) => {
    setBusy(true);
    try {
      const { error: updateError } = await supabase.from('stay_categories').update({ is_active: !row.is_active }).eq('id', row.id);
      if (updateError) throw updateError;
      await load();
    } catch (err) {
      notify({ title: 'Could not update', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const move = async (row: CategoryRow, direction: -1 | 1) => {
    const index = rows.findIndex((item) => item.id === row.id);
    const target = rows[index + direction];
    if (!target) return;
    setBusy(true);
    try {
      await Promise.all([
        supabase.from('stay_categories').update({ sort_order: target.sort_order }).eq('id', row.id),
        supabase.from('stay_categories').update({ sort_order: row.sort_order }).eq('id', target.id),
      ]);
      await load();
    } catch (err) {
      notify({ title: 'Could not reorder', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout
      title="Stay Categories"
      subtitle="Types and themes used to classify stays."
      actions={
        <button type="button" onClick={() => { setForm({ ...emptyForm }); setOpen(true); }} className={btnPrimary}>
          <i className="ri-add-line text-base"></i> Add category
        </button>
      }
    >
      {loading ? (
        <LoadingBlock rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : rows.length === 0 ? (
        <EmptyState icon="ri-apps-2-line" title="No categories yet" action={<button type="button" onClick={() => { setForm({ ...emptyForm }); setOpen(true); }} className={btnPrimary}><i className="ri-add-line"></i> Add category</button>} />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Category</th>
                <th className={thClass}>Slug</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-t border-background-100 align-top">
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-background-100 text-accent-700">
                        <i className={`${row.icon ?? 'ri-apps-2-line'} text-lg`}></i>
                      </span>
                      <div>
                        <p className="font-medium text-foreground-950">{row.name}</p>
                        {row.description && <p className="text-xs text-foreground-500">{row.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className={`${tdClass} text-foreground-600`}>/{row.slug}</td>
                  <td className={tdClass}><Badge tone={row.is_active ? 'primary' : 'muted'}>{row.is_active ? 'Enabled' : 'Disabled'}</Badge></td>
                  <td className={tdClass}>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <button type="button" disabled={busy || index === 0} onClick={() => move(row, -1)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-600 hover:bg-background-100 disabled:opacity-40"><i className="ri-arrow-up-s-line"></i></button>
                      <button type="button" disabled={busy || index === rows.length - 1} onClick={() => move(row, 1)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-600 hover:bg-background-100 disabled:opacity-40"><i className="ri-arrow-down-s-line"></i></button>
                      <button type="button" onClick={() => { setForm({ id: row.id, slug: row.slug, name: row.name, description: row.description ?? '', icon: row.icon ?? 'ri-home-4-line', is_active: row.is_active }); setOpen(true); }} className={`${btnGhost} px-3 py-1.5 text-xs`}>
                        <i className="ri-edit-line text-sm"></i> Edit
                      </button>
                      <button type="button" disabled={busy} onClick={() => toggleActive(row)} className={`${btnGhost} px-3 py-1.5 text-xs`}>
                        <i className={row.is_active ? 'ri-toggle-line text-base' : 'ri-toggle-fill text-base'}></i> {row.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-foreground-950/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="relative w-full max-w-md rounded-card border border-background-200 bg-background-50 p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground-950">{form.id ? 'Edit category' : 'Add category'}</h2>
            <div className="mt-4 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Name</span><input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Slug</span><input className={inputClass} value={form.slug} placeholder="auto from name" onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Icon (Remix class)</span><input className={inputClass} value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} /></label>
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Description</span><textarea rows={2} className={`${inputClass} resize-y`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Status</span><select className={selectClass} value={form.is_active ? '1' : '0'} onChange={(event) => setForm({ ...form, is_active: event.target.value === '1' })}><option value="1">Enabled</option><option value="0">Disabled</option></select></label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className={btnGhost}>Cancel</button>
              <button type="button" disabled={busy} onClick={save} className={btnPrimary}>
                <i className={`${busy ? 'ri-loader-4-line animate-spin' : 'ri-save-3-line'} text-base`}></i> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}