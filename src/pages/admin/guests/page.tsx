import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import {
  BookingStatusBadge,
  EmptyState,
  ErrorState,
  LoadingBlock,
  btnGhost,
  btnSmall,
  inputClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from '@/pages/admin/components/AdminUI';
import { useAdminPeople, type GuestSummary } from '@/hooks/useAdminPeople';
import { formatPKR } from '@/utils/stays';

export default function AdminGuestsPage() {
  const { guests, loading, error, refetch } = useAdminPeople();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<GuestSummary | null>(null);

  const q = search.trim().toLowerCase();
  const filtered = guests.filter((guest) =>
    q ? `${guest.name} ${guest.email ?? ''} ${guest.phone}`.toLowerCase().includes(q) : true,
  );

  return (
    <AdminLayout title="Guests" subtitle="Everyone who has booked a ZAMIN Stay.">
      <div className="mb-4 rounded-card border border-background-200 bg-background-50 p-4">
        <div className="relative md:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
            <i className="ri-search-line text-base"></i>
          </span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search guest, email, phone" className={`${inputClass} pl-9`} />
        </div>
      </div>

      {loading ? (
        <LoadingBlock rows={6} />
      ) : error ? (
        <ErrorState message="Couldn’t load guests." onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="ri-group-2-line"
          title={guests.length === 0 ? 'No guests yet.' : 'No guests match your search.'}
          message={guests.length === 0 ? 'Guests appear here after their first booking.' : undefined}
        />
      ) : (
        <div className={tableWrap}>
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Guest</th>
                <th className={thClass}>Phone</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Bookings</th>
                <th className={thClass}>Completed</th>
                <th className={thClass}>Cancelled</th>
                <th className={thClass}>Total Spend</th>
                <th className={thClass}>Joined</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((guest) => (
                <tr key={guest.key} className="border-t border-background-100 align-top">
                  <td className={tdClass}>
                    <button type="button" onClick={() => setSelected(guest)} className="cursor-pointer text-left font-medium text-foreground-950 hover:text-primary-700">
                      {guest.name}
                    </button>
                  </td>
                  <td className={`${tdClass} text-foreground-600`}>{guest.phone}</td>
                  <td className={`${tdClass} text-foreground-600`}>{guest.email || '—'}</td>
                  <td className={`${tdClass} text-foreground-700`}>{guest.totalBookings}</td>
                  <td className={`${tdClass} text-foreground-700`}>{guest.completed}</td>
                  <td className={`${tdClass} text-foreground-700`}>{guest.cancelled}</td>
                  <td className={`${tdClass} font-semibold text-primary-700`}>{formatPKR(guest.totalSpend)}</td>
                  <td className={`${tdClass} text-xs text-foreground-500`}>{new Date(guest.joined).toLocaleDateString()}</td>
                  <td className={tdClass}>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <button type="button" onClick={() => setSelected(guest)} className={`${btnSmall} border-background-300 text-foreground-700 hover:bg-background-100`}>
                        <i className="ri-eye-line"></i> View
                      </button>
                      <a href={`tel:${guest.phone}`} className={`${btnSmall} border-primary-300 text-primary-700 hover:bg-primary-50`}>
                        <i className="ri-phone-line"></i>
                      </a>
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
                <p className="text-sm text-foreground-600">{selected.phone}{selected.email ? ` · ${selected.email}` : ''}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="flex flex-col gap-5 p-5">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-card border border-background-200 p-3"><p className="text-xs text-foreground-500">Bookings</p><p className="font-heading text-lg font-bold text-foreground-950">{selected.totalBookings}</p></div>
                <div className="rounded-card border border-background-200 p-3"><p className="text-xs text-foreground-500">Completed</p><p className="font-heading text-lg font-bold text-foreground-950">{selected.completed}</p></div>
                <div className="rounded-card border border-background-200 p-3"><p className="text-xs text-foreground-500">Spend</p><p className="font-heading text-lg font-bold text-primary-700">{formatPKR(selected.totalSpend)}</p></div>
              </div>

              <div>
                <p className="mb-2 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">Booking history</p>
                <ul className="divide-y divide-background-100 rounded-card border border-background-200">
                  {selected.bookings.map((booking) => (
                    <li key={booking.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <Link to={`/admin/bookings/${booking.id}`} className="block truncate text-sm font-medium text-foreground-950 hover:text-primary-700">
                          {booking.stay?.title ?? 'Stay'}
                        </Link>
                        <p className="truncate text-xs text-foreground-500">{booking.check_in} → {booking.check_out} · {formatPKR(booking.total, booking.currency)}</p>
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 font-label text-[11px] font-bold uppercase tracking-[0.16em] text-foreground-500">Reviews</p>
                <EmptyState compact icon="ri-star-line" title="No reviews from this guest yet." />
              </div>

              <div className="flex flex-wrap gap-2">
                <a href={`tel:${selected.phone}`} className={btnGhost}>
                  <i className="ri-phone-line text-base"></i> Call guest
                </a>
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className={btnGhost}>
                    <i className="ri-mail-line text-base"></i> Email guest
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