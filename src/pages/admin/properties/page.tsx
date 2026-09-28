import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import {
  Badge,
  EmptyState,
  ErrorState,
  LoadingBlock,
  StatCard,
  btnGhost,
  btnSmall,
  inputClass,
  selectClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from '@/pages/admin/components/AdminUI';
import { supabase } from '@/lib/supabase';
import { formatPKR } from '@/utils/stays';

type PropertyRow = {
  id: string;
  title: string;
  type: string | null;
  listing_type: string | null;
  location: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  area_unit: string | null;
  image: string | null;
  featured: boolean | null;
  created_at: string;
};

export default function AdminPropertiesPage() {
  const [rows, setRows] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [listing, setListing] = useState('ALL');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (queryError) throw queryError;
      setRows((data as PropertyRow[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(
    () => ({
      total: rows.length,
      sale: rows.filter((row) => row.listing_type === 'sale').length,
      rent: rows.filter((row) => row.listing_type === 'rent').length,
      featured: rows.filter((row) => row.featured).length,
    }),
    [rows],
  );

  const q = search.trim().toLowerCase();
  const filtered = rows.filter((row) => {
    if (listing !== 'ALL' && row.listing_type !== listing) return false;
    if (q && !`${row.title} ${row.location ?? ''}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <AdminLayout title="Properties" subtitle="ZAMIN Real Estate listings (sale & long-term rent).">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Properties" value={counts.total} icon="ri-home-office-line" tone="primary" />
        <StatCard label="For Sale" value={counts.sale} icon="ri-price-tag-3-line" />
        <StatCard label="For Rent" value={counts.rent} icon="ri-key-2-line" />
        <StatCard label="Featured" value={counts.featured} icon="ri-star-line" tone="accent" />
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-card border border-background-200 bg-background-50 p-4 md:flex-row">
        <div className="relative md:max-w-md md:flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
            <i className="ri-search-line text-base"></i>
          </span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search property or location" className={`${inputClass} pl-9`} />
        </div>
        <select className={`${selectClass} md:max-w-xs`} value={listing} onChange={(event) => setListing(event.target.value)}>
          <option value="ALL">All listings</option>
          <option value="sale">For sale</option>
          <option value="rent">For rent</option>
        </select>
      </div>

      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="ri-home-office-line" title="No properties to show." message="Real-estate listings from your existing platform appear here." />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Property</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Listing</th>
                <th className={thClass}>Location</th>
                <th className={thClass}>Price</th>
                <th className={thClass}>Beds / Baths</th>
                <th className={thClass}>Area</th>
                <th className={thClass}>Added</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-background-100 align-top">
                  <td className={tdClass}>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-background-100">
                        {row.image ? (
                          <img src={row.image} alt={row.title} className="h-full w-full object-cover object-top" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-background-400"><i className="ri-image-line"></i></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground-950">{row.title}</p>
                        {row.featured && <Badge tone="secondary" icon="ri-star-fill">Featured</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className={`${tdClass} text-foreground-600`}>{row.type ?? '—'}</td>
                  <td className={tdClass}><Badge tone="outline">{row.listing_type ?? '—'}</Badge></td>
                  <td className={`${tdClass} text-foreground-600`}>{row.location ?? '—'}</td>
                  <td className={`${tdClass} font-semibold text-primary-700`}>{row.price ? formatPKR(row.price) : '—'}</td>
                  <td className={`${tdClass} text-foreground-600`}>{row.bedrooms ?? '—'} / {row.bathrooms ?? '—'}</td>
                  <td className={`${tdClass} text-foreground-600`}>{row.area ? `${row.area} ${row.area_unit ?? ''}` : '—'}</td>
                  <td className={`${tdClass} text-xs text-foreground-500`}>{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className={tdClass}>
                    <div className="flex justify-end">
                      <Link to={`/property/${row.id}`} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                        <i className="ri-eye-line"></i> View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <Link to="/admin/stays" className={btnGhost}>
          <i className="ri-home-4-line text-base"></i> Go to ZAMIN Stays
        </Link>
      </div>
    </AdminLayout>
  );
}