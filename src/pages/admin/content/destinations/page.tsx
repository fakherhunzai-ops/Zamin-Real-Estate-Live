import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  btnGhost,
  btnPrimary,
  inputClass,
  labelClass,
  selectClass,
} from '@/pages/admin/components/AdminUI';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/utils/stays';

type DestinationRow = {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  tagline: string | null;
  description: string | null;
  hero_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  sort_order: number;
  is_active: boolean;
  areas?: { id: string; name: string }[];
};

const emptyForm = {
  id: '',
  slug: '',
  name: '',
  region: '',
  tagline: '',
  description: '',
  hero_image: '',
  seo_title: '',
  seo_description: '',
  is_active: true,
};

export default function AdminDestinationsPage() {
  const { notify } = useAdminToast();
  const [rows, setRows] = useState<DestinationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('stay_destinations')
        .select('*, areas:stay_areas(id, name)')
        .order('sort_order', { ascending: true });
      if (queryError) throw queryError;
      setRows((data as DestinationRow[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load destinations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setOpen(true);
  };

  const openEdit = (row: DestinationRow) => {
    setForm({
      id: row.id,
      slug: row.slug,
      name: row.name,
      region: row.region ?? '',
      tagline: row.tagline ?? '',
      description: row.description ?? '',
      hero_image: row.hero_image ?? '',
      seo_title: row.seo_title ?? '',
      seo_description: row.seo_description ?? '',
      is_active: row.is_active,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      notify({ title: 'Name is required', tone: 'error' });
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)).toLowerCase(),
      region: form.region.trim() || null,
      tagline: form.tagline.trim() || null,
      description: form.description.trim() || null,
      hero_image: form.hero_image.trim() || null,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      is_active: form.is_active,
    };
    try {
      if (form.id) {
        const { error: updateError } = await supabase.from('stay_destinations').update(payload).eq('id', form.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('stay_destinations')
          .insert({ ...payload, sort_order: rows.length });
        if (insertError) throw insertError;
      }
      await load();
      notify({ title: form.id ? 'Destination updated' : 'Destination added', tone: 'success' });
      setOpen(false);
    } catch (err) {
      notify({ title: 'Could not save', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (row: DestinationRow) => {
    setBusy(true);
    try {
      const { error: updateError } = await supabase.from('stay_destinations').update({ is_active: !row.is_active }).eq('id', row.id);
      if (updateError) throw updateError;
      await load();
      notify({ title: row.is_active ? 'Destination disabled' : 'Destination enabled', tone: 'success' });
    } catch (err) {
      notify({ title: 'Could not update', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const move = async (row: DestinationRow, direction: -1 | 1) => {
    const index = rows.findIndex((item) => item.id === row.id);
    const target = rows[index + direction];
    if (!target) return;
    setBusy(true);
    try {
      await Promise.all([
        supabase.from('stay_destinations').update({ sort_order: target.sort_order }).eq('id', row.id),
        supabase.from('stay_destinations').update({ sort_order: row.sort_order }).eq('id', target.id),
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
      title="Destinations"
      subtitle="Regions and sub-areas shown across ZAMIN Stays."
      actions={
        <button type="button" onClick={openCreate} className={btnPrimary}>
          <i className="ri-add-line text-base"></i> Add destination
        </button>
      }
    >
      {loading ? (
        <LoadingBlock rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : rows.length === 0 ? (
        <EmptyState icon="ri-map-pin-2-line" title="No destinations yet" action={<button type="button" onClick={openCreate} className={btnPrimary}><i className="ri-add-line"></i> Add destination</button>} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row, index) => (
            <Card key={row.id} bodyClassName="p-0">
              <div className="relative h-36 w-full overflow-hidden bg-background-100">
                {row.hero_image ? (
                  <img src={row.hero_image} alt={row.name} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-background-400"><i className="ri-image-line text-3xl"></i></div>
                )}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  <Badge tone={row.is_active ? 'primary' : 'muted'}>{row.is_active ? 'Active' : 'Hidden'}</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-heading text-base font-semibold text-foreground-950">{row.name}</h3>
                    <p className="text-xs text-foreground-500">/{row.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" disabled={busy || index === 0} onClick={() => move(row, -1)} className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-600 hover:bg-background-100 disabled:opacity-40"><i className="ri-arrow-up-s-line"></i></button>
                    <button type="button" disabled={busy || index === rows.length - 1} onClick={() => move(row, 1)} className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-600 hover:bg-background-100 disabled:opacity-40"><i className="ri-arrow-down-s-line"></i></button>
                  </div>
                </div>
                {row.tagline && <p className="mt-1 line-clamp-2 text-sm text-foreground-600">{row.tagline}</p>}
                {row.areas && row.areas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {row.areas.slice(0, 4).map((area) => (
                      <span key={area.id} className="rounded-md bg-background-100 px-2 py-0.5 text-[11px] font-medium text-foreground-600">{area.name}</span>
                    ))}
                    {row.areas.length > 4 && <span className="text-[11px] text-foreground-500">+{row.areas.length - 4} areas</span>}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => openEdit(row)} className={`${btnGhost} px-3 py-2 text-xs`}><i className="ri-edit-line text-sm"></i> Edit</button>
                  <button type="button" disabled={busy} onClick={() => toggleActive(row)} className={`${btnGhost} px-3 py-2 text-xs`}>
                    <i className={row.is_active ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i> {row.is_active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[65] flex justify-end">
          <div className="absolute inset-0 bg-foreground-950/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-background-50">
            <div className="flex items-center justify-between border-b border-background-200 px-5 py-4">
              <h2 className="font-heading text-lg font-semibold text-foreground-950">{form.id ? 'Edit destination' : 'Add destination'}</h2>
              <button type="button" onClick={() => setOpen(false)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100"><i className="ri-close-line text-xl"></i></button>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Name</span><input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Slug</span><input className={inputClass} value={form.slug} placeholder="auto from name" onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Region</span><input className={inputClass} value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} /></label>
                <label className="flex flex-col gap-1.5"><span className={labelClass}>Status</span><select className={selectClass} value={form.is_active ? '1' : '0'} onChange={(event) => setForm({ ...form, is_active: event.target.value === '1' })}><option value="1">Active</option><option value="0">Hidden</option></select></label>
              </div>
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Tagline</span><input className={inputClass} value={form.tagline} onChange={(event) => setForm({ ...form, tagline: event.target.value })} /></label>
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Hero image URL</span><input className={inputClass} value={form.hero_image} onChange={(event) => setForm({ ...form, hero_image: event.target.value })} /></label>
              <label className="flex flex-col gap-1.5"><span className={labelClass}>Description</span><textarea rows={4} className={`${inputClass} resize-y`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
              <div className="rounded-card border border-background-200 p-4">
                <p className="mb-3 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">SEO</p>
                <div className="flex flex-col gap-3">
                  <input className={inputClass} placeholder="SEO title" value={form.seo_title} onChange={(event) => setForm({ ...form, seo_title: event.target.value })} />
                  <textarea rows={2} className={`${inputClass} resize-y`} placeholder="SEO description" value={form.seo_description} onChange={(event) => setForm({ ...form, seo_description: event.target.value })} />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-background-200 bg-background-50 px-5 py-4">
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