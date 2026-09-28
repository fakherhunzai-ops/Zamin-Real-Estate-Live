import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import {
  Badge,
  EmptyState,
  ErrorState,
  LoadingBlock,
  ManagementBadge,
  VerifiedBadge,
  btnGhost,
  btnPrimary,
  btnSmall,
  inputClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from '@/pages/admin/components/AdminUI';
import { useAdminPeople, type HostSummary } from '@/hooks/useAdminPeople';
import { formatPKR } from '@/utils/stays';

export default function AdminHostsPage() {
  const { hosts, loading, error, refetch } = useAdminPeople();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<HostSummary | null>(null);

  const q = search.trim().toLowerCase();
  const filtered = hosts.filter((host) =>
    q ? `${host.name} ${host.email ?? ''} ${host.phone ?? ''}`.toLowerCase().includes(q) : true,
  );

  return (
    <AdminLayout
      title="Hosts"
      subtitle="Property owners and managers across ZAMIN Stays."
      actions={
        <Link to="/admin/stays/pending" className={btnPrimary}>
          <i className="ri-shield-star-line text-base"></i> Pending verification
        </Link>
      }
    >
      <div className="mb-4 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="relative md:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
            <i className="ri-search-line text-base"></i>
          </span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search host, email, phone" className={`${inputClass} pl-9`} />
        </div>
      </div>

      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load hosts." onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="ri-user-heart-line"
          title={hosts.length === 0 ? 'No hosts yet.' : 'No hosts match your search.'}
          message={hosts.length === 0 ? 'Hosts appear here automatically once stays are added.' : undefined}
        />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Host</th>
                <th className={thClass}>Contact</th>
                <th className={thClass}>Properties</th>
                <th className={thClass}>Management</th>
                <th className={thClass}>Bookings</th>
                <th className={thClass}>Earnings</th>
                <th className={thClass}>Verification</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((host) => (
                <tr key={host.key} className="border-t border-background-100 align-top">
                  <td className={tdClass}>
                    <button type="button" onClick={() => setSelected(host)} className="cursor-pointer text-left font-medium text-foreground-950 hover:text-primary-700">
                      {host.name}
                    </button>
                  </td>
                  <td className={`${tdClass} text-foreground-600`}>
                    <p>{host.phone || '—'}</p>
                    <p className="text-xs">{host.email || ''}</p>
                  </td>
                  <td className={`${tdClass} text-foreground-700`}>{host.stays.length}</td>
                  <td className={tdClass}>
                    <div className="flex flex-wrap gap-1.5">
                      {host.managementTypes.map((type) => (
                        <ManagementBadge key={type} type={type as 'LISTED' | 'MANAGED'} />
                      ))}
                    </div>
                  </td>
                  <td className={`${tdClass} text-foreground-700`}>{host.bookings}</td>
                  <td className={`${tdClass} font-semibold text-primary-700`}>{formatPKR(host.earnings)}</td>
                  <td className={tdClass}><VerifiedBadge verified={host.verified} /></td>
                  <td className={tdClass}>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <button type="button" onClick={() => setSelected(host)} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                        <i className="ri-eye-line"></i> View
                      </button>
                      {host.phone && (
                        <a href={`tel:${host.phone}`} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                          <i className="ri-phone-line"></i> Contact
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[65] flex justify-end">
          <div className="absolute inset-0 bg-foreground-950/50" onClick={() => setSelected(null)} aria-hidden="true" />
          <div className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-background-50">
            <div className="flex items-start justify-between gap-3 border-b border-background-200 px-5 py-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground-950">{selected.name}</h2>
                <p className="text-sm text-foreground-600">{selected.phone || selected.email || 'No contact'}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="flex flex-col gap-5 p-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-card border border-background-200 p-3"><p className="text-xs text-foreground-500">Properties</p><p className="font-heading text-lg font-bold text-foreground-950">{selected.stays.length}</p></div>
                <div className="rounded-card border border-background-200 p-3"><p className="text-xs text-foreground-500">Bookings</p><p className="font-heading text-lg font-bold text-foreground-950">{selected.bookings}</p></div>
                <div className="rounded-card border border-background-200 p-3"><p className="text-xs text-foreground-500">Earnings</p><p className="font-heading text-lg font-bold text-primary-700">{formatPKR(selected.earnings)}</p></div>
              </div>

              <div>
                <p className="mb-2 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">Properties</p>
                <ul className="divide-y divide-background-100 rounded-card border border-background-200">
                  {selected.stays.map((stay) => (
                    <li key={stay.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <Link to={`/admin/stays/${stay.id}`} className="block truncate text-sm font-medium text-foreground-950 hover:text-primary-700">{stay.title}</Link>
                        <p className="truncate text-xs text-foreground-500">{[stay.area?.name, stay.destination?.name].filter(Boolean).join(', ')}</p>
                      </div>
                      <Badge tone="muted">{stay.status}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className={btnPrimary}>
                    <i className="ri-phone-line text-base"></i> Call host
                  </a>
                )}
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
                    <i className="ri-whatsapp-line text-base"></i> WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}