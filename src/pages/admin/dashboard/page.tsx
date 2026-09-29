import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAdminOverview } from '@/hooks/useAdminOverview';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  SectionLabel,
  StatCard,
  btnGhost,
  btnPrimary,
  btnSmall,
} from '@/pages/admin/components/AdminUI';
import type { Booking, Stay } from '@/types/stays';
import { formatPKR } from '@/utils/stays';

type PropertyMetrics = {
  total: number;
  published: number;
  pending: number;
  sold: number;
  rented: number;
  sale: number;
  rent: number;
};

type PropertyRecord = {
  id: string;
  title: string;
  listing_type: string | null;
  status: string | null;
  location: string | null;
  created_at: string;
};

type DashboardRecord = Record<string, unknown> & { id: string; created_at?: string };
type Source<T> = { data: T | null; error: string | null };

type RealEstateData = {
  properties: Source<{ metrics: PropertyMetrics; recent: PropertyRecord[]; pending: PropertyRecord[] }>;
  enquiries: Source<{ total: number; newCount: number; recent: DashboardRecord[] }>;
  valuations: Source<{ total: number; newCount: number; recent: DashboardRecord[] }>;
};

const EMPTY_SOURCE = { data: null, error: null };
const EMPTY_DATA: RealEstateData = {
  properties: EMPTY_SOURCE,
  enquiries: EMPTY_SOURCE,
  valuations: EMPTY_SOURCE,
};

async function countRows(
  table: 'properties' | 'enquiries' | 'valuations',
  filter?: { column: string; values: string[] },
): Promise<number> {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  if (filter) query = query.in(filter.column, filter.values);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

async function recentRows(table: 'enquiries' | 'valuations'): Promise<DashboardRecord[]> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (error) throw error;
  return (data ?? []) as DashboardRecord[];
}

function messageOf(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return 'Could not load this data source.';
}

async function loadProperties(): Promise<RealEstateData['properties']> {
  try {
    const [total, published, pending, sold, rented, sale, rent, recentResult, pendingResult] = await Promise.all([
      countRows('properties'),
      countRows('properties', { column: 'status', values: ['published', 'PUBLISHED'] }),
      countRows('properties', { column: 'status', values: ['pending', 'PENDING'] }),
      countRows('properties', { column: 'status', values: ['sold', 'SOLD'] }),
      countRows('properties', { column: 'status', values: ['rented', 'RENTED'] }),
      countRows('properties', { column: 'listing_type', values: ['sale', 'SALE'] }),
      countRows('properties', { column: 'listing_type', values: ['rent', 'RENT'] }),
      supabase
        .from('properties')
        .select('id,title,listing_type,status,location,created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('properties')
        .select('id,title,listing_type,status,location,created_at')
        .in('status', ['pending', 'PENDING'])
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    if (recentResult.error) throw recentResult.error;
    if (pendingResult.error) throw pendingResult.error;

    return {
      data: {
        metrics: { total, published, pending, sold, rented, sale, rent },
        recent: (recentResult.data ?? []) as PropertyRecord[],
        pending: (pendingResult.data ?? []) as PropertyRecord[],
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: messageOf(error) };
  }
}

async function loadLeadSource(table: 'enquiries' | 'valuations'): Promise<RealEstateData['enquiries']> {
  try {
    const [total, newCount, recent] = await Promise.all([
      countRows(table),
      countRows(table, { column: 'status', values: ['new', 'NEW'] }),
      recentRows(table),
    ]);
    return { data: { total, newCount, recent }, error: null };
  } catch (error) {
    return { data: null, error: messageOf(error) };
  }
}

function firstText(record: DashboardRecord, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return 'Unnamed record';
}

function RecordList<T>({
  title,
  icon,
  source,
  to,
  labelOf,
  detailOf,
}: {
  title: string;
  icon: string;
  source: Source<T[]>;
  to: string;
  labelOf: (record: T) => string;
  detailOf: (record: T) => string;
}) {
  return (
    <Card
      title={title}
      icon={icon}
      actions={<Link to={to} className={btnSmall}>View all</Link>}
      bodyClassName="p-0"
    >
      {source.error ? (
        <p role="status" className="px-5 py-4 text-sm text-foreground-600">Data unavailable: {source.error}</p>
      ) : source.data?.length ? (
        <ul className="divide-y divide-background-100">
          {source.data.map((record, index) => (
            <li key={index} className="flex items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground-950">{labelOf(record)}</p>
                <p className="truncate text-xs text-foreground-500">{detailOf(record)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-5"><EmptyState compact icon={icon} title="No recent records." /></div>
      )}
    </Card>
  );
}

function PropertyList({ rows, emptyTitle }: { rows: PropertyRecord[] | null; emptyTitle: string }) {
  if (!rows?.length) return <div className="p-5"><EmptyState compact icon="ri-home-office-line" title={emptyTitle} /></div>;
  return (
    <ul className="divide-y divide-background-100">
      {rows.map((property) => (
        <li key={property.id} className="flex items-center gap-3 px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground-950">{property.title}</p>
            <p className="truncate text-xs text-foreground-500">
              {[property.location, property.listing_type, property.status].filter(Boolean).join(' · ') || 'Property listing'}
            </p>
          </div>
          <Link to="/admin/properties" className={btnSmall}>Open</Link>
        </li>
      ))}
    </ul>
  );
}

function BookingList({ rows, dateKey }: { rows: Booking[]; dateKey: 'check_in' | 'check_out' }) {
  if (!rows.length) {
    return <div className="p-5"><EmptyState compact icon="ri-calendar-line" title="No upcoming bookings." /></div>;
  }
  return (
    <ul className="divide-y divide-background-100">
      {rows.slice(0, 5).map((booking) => (
        <li key={booking.id} className="flex items-center gap-3 px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <Link to={`/admin/bookings/${booking.id}`} className="block truncate text-sm font-semibold text-foreground-950 hover:text-primary-700">
              {booking.guest_name}
            </Link>
            <p className="truncate text-xs text-foreground-500">{booking.stay?.title ?? 'Stay'} · {booking[dateKey]}</p>
          </div>
          <Badge tone="outline">{booking.status.replace('_', ' ')}</Badge>
        </li>
      ))}
    </ul>
  );
}

function StayList({ rows }: { rows: Stay[] }) {
  if (!rows.length) return <div className="p-5"><EmptyState compact icon="ri-shield-check-line" title="No stays awaiting verification." /></div>;
  return (
    <ul className="divide-y divide-background-100">
      {rows.slice(0, 5).map((stay) => (
        <li key={stay.id} className="flex items-center gap-3 px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <Link to={`/admin/stays/${stay.id}`} className="block truncate text-sm font-semibold text-foreground-950 hover:text-primary-700">{stay.title}</Link>
            <p className="truncate text-xs text-foreground-500">{stay.host_name || 'Host not assigned'}</p>
          </div>
          <Badge tone="secondary">Pending</Badge>
        </li>
      ))}
    </ul>
  );
}

export default function AdminDashboardPage() {
  const overview = useAdminOverview();
  const [realEstate, setRealEstate] = useState<RealEstateData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([loadProperties(), loadLeadSource('enquiries'), loadLeadSource('valuations')]).then(
      ([properties, enquiries, valuations]) => {
        if (!active) return;
        setRealEstate({ properties, enquiries, valuations });
        setLoading(false);
      },
    );
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const refresh = () => {
    setRefreshKey((current) => current + 1);
    overview.refetch();
  };

  const propertyMetrics = realEstate.properties.data?.metrics;
  const enquiryMetrics = realEstate.enquiries.data;
  const valuationMetrics = realEstate.valuations.data;
  const realEstateStats = [
    { label: 'Total Properties', value: propertyMetrics?.total, icon: 'ri-home-office-line', tone: 'primary' as const },
    { label: 'Published', value: propertyMetrics?.published, icon: 'ri-upload-cloud-2-line' },
    { label: 'For Sale', value: propertyMetrics?.sale, icon: 'ri-price-tag-3-line' },
    { label: 'For Rent', value: propertyMetrics?.rent, icon: 'ri-key-2-line' },
    { label: 'Pending Listings', value: propertyMetrics?.pending, icon: 'ri-time-line', tone: 'accent' as const },
    { label: 'Sold', value: propertyMetrics?.sold, icon: 'ri-checkbox-circle-line' },
    { label: 'Rented', value: propertyMetrics?.rented, icon: 'ri-home-2-line' },
    { label: 'New Enquiries', value: enquiryMetrics?.newCount, icon: 'ri-mail-line' },
    { label: 'Valuation Requests', value: valuationMetrics?.newCount, icon: 'ri-scales-3-line' },
  ];

  const staysStats = [
    { label: 'Total Stays', value: overview.metrics.totalStays, icon: 'ri-hotel-line', tone: 'primary' as const },
    { label: 'Published Stays', value: overview.metrics.publishedStays, icon: 'ri-check-double-line' },
    { label: 'Pending Verification', value: overview.metrics.pendingVerification, icon: 'ri-shield-star-line', tone: 'accent' as const },
    { label: 'Managed Properties', value: overview.metrics.managedStays, icon: 'ri-vip-diamond-line' },
    { label: 'Active Bookings', value: overview.metrics.activeBookings, icon: 'ri-calendar-check-line' },
    { label: 'Upcoming Check-ins', value: overview.metrics.upcomingCheckIns, icon: 'ri-login-circle-line' },
    { label: 'Upcoming Check-outs', value: overview.metrics.upcomingCheckOuts, icon: 'ri-logout-circle-line' },
    { label: 'Occupancy · 30 days', value: `${overview.metrics.occupancyRate}%`, icon: 'ri-pie-chart-2-line', tone: 'accent' as const },
    { label: 'Booking Revenue', value: formatPKR(overview.metrics.bookingRevenue), icon: 'ri-money-dollar-circle-line', tone: 'primary' as const },
    { label: 'ZAMIN Revenue', value: formatPKR(overview.metrics.zaminRevenue), icon: 'ri-hand-coin-line' },
    { label: 'Pending Payouts', value: formatPKR(overview.metrics.pendingPayouts), icon: 'ri-wallet-3-line', tone: 'accent' as const },
    { label: 'Average Nightly Rate', value: formatPKR(overview.metrics.avgNightlyRate), icon: 'ri-price-tag-3-line' },
  ];

  const sourceErrors = [
    realEstate.properties.error && `Properties: ${realEstate.properties.error}`,
    realEstate.enquiries.error && `Enquiries: ${realEstate.enquiries.error}`,
    realEstate.valuations.error && `Valuations: ${realEstate.valuations.error}`,
  ].filter(Boolean);

  return (
    <AdminLayout
      title="ZAMIN Business Overview"
      subtitle="Live portfolio, lead, booking and operations overview."
      actions={
        <>
          <Link to="/admin/properties" className={btnGhost}><i className="ri-home-office-line text-base"></i> Real Estate</Link>
          <Link to="/admin/stays/new" className={btnPrimary}><i className="ri-add-line text-base"></i> Add Stay</Link>
        </>
      }
    >
      {overview.error ? (
        <ErrorState message={`Could not load Stays overview: ${overview.error}`} onRetry={refresh} />
      ) : loading || overview.loading ? (
        <LoadingBlock label="Loading business overview…" rows={6} />
      ) : (
        <div className="flex flex-col gap-8">
          {sourceErrors.length > 0 && (
            <div role="status" className="rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-sm text-foreground-800">
              Some real-estate dashboard sources are unavailable. Their metrics show as unavailable rather than zero.
              <ul className="mt-2 list-inside list-disc text-xs">{sourceErrors.map((error) => <li key={error}>{error}</li>)}</ul>
            </div>
          )}

          <section>
            <SectionLabel className="mb-3">REAL ESTATE</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {realEstateStats.map((item) => {
                const source = item.label === 'New Enquiries' ? realEstate.enquiries : item.label === 'Valuation Requests' ? realEstate.valuations : realEstate.properties;
                return <StatCard key={item.label} label={item.label} value={source.error ? 'Unavailable' : item.value ?? 0} icon={item.icon} tone={item.tone} />;
              })}
            </div>
          </section>

          <section>
            <SectionLabel className="mb-3">ZAMIN STAYS</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {staysStats.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} tone={item.tone} />
              ))}
            </div>
            <p className="mt-2 text-xs text-foreground-500">Booking and ZAMIN revenue are derived from booking records. Pending payouts are estimated host net from checked-out bookings; no payout provider is connected.</p>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card title="Recent Properties" icon="ri-home-office-line" actions={<Link to="/admin/properties" className={btnSmall}>View all</Link>} bodyClassName="p-0">
              {realEstate.properties.error ? <p className="px-5 py-4 text-sm text-foreground-600">Data unavailable: {realEstate.properties.error}</p> : <PropertyList rows={realEstate.properties.data?.recent ?? null} emptyTitle="No properties yet." />}
            </Card>
            <RecordList
              title="Recent Enquiries"
              icon="ri-mail-line"
              source={realEstate.enquiries.data ? { data: realEstate.enquiries.data.recent, error: realEstate.enquiries.error } : { data: null, error: realEstate.enquiries.error }}
              to="/admin/enquiries"
              labelOf={(record) => firstText(record, ['name', 'full_name', 'customer_name', 'guest_name', 'email', 'phone'])}
              detailOf={(record) => firstText(record, ['subject', 'message', 'status', 'created_at'])}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card title="Pending Approvals" icon="ri-shield-star-line" actions={<Link to="/admin/properties/pending" className={btnSmall}>Review</Link>} bodyClassName="p-0">
              {realEstate.properties.error ? <p className="px-5 py-4 text-sm text-foreground-600">Data unavailable: {realEstate.properties.error}</p> : <PropertyList rows={realEstate.properties.data?.pending ?? null} emptyTitle="No property listings awaiting approval." />}
              <div className="border-t border-background-100">
                <div className="px-5 pt-4"><SectionLabel>STAYS AWAITING VERIFICATION</SectionLabel></div>
                <StayList rows={overview.pendingStays} />
              </div>
            </Card>
            <RecordList
              title="Valuation Requests"
              icon="ri-scales-3-line"
              source={realEstate.valuations.data ? { data: realEstate.valuations.data.recent, error: realEstate.valuations.error } : { data: null, error: realEstate.valuations.error }}
              to="/admin/valuations"
              labelOf={(record) => firstText(record, ['owner_name', 'name', 'full_name', 'email', 'phone'])}
              detailOf={(record) => firstText(record, ['property_type', 'location', 'status', 'created_at'])}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card title="Recent Bookings" icon="ri-history-line" actions={<Link to="/admin/bookings" className={btnSmall}>View all</Link>} bodyClassName="p-0">
              {overview.recentBookings.length ? (
                <ul className="divide-y divide-background-100">
                  {overview.recentBookings.slice(0, 5).map((booking) => (
                    <li key={booking.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="min-w-0 flex-1">
                        <Link to={`/admin/bookings/${booking.id}`} className="block truncate text-sm font-semibold text-foreground-950 hover:text-primary-700">{booking.guest_name}</Link>
                        <p className="truncate text-xs text-foreground-500">{booking.stay?.title ?? 'Stay'} · {booking.reference}</p>
                      </div>
                      <span className="whitespace-nowrap text-sm font-semibold text-primary-700">{formatPKR(booking.total, booking.currency)}</span>
                    </li>
                  ))}
                </ul>
              ) : <div className="p-5"><EmptyState compact icon="ri-calendar-line" title="No bookings yet." /></div>}
            </Card>
            <Card title="Operational Alerts" icon="ri-alert-line" actions={<Badge tone="muted">{overview.alerts.length + (propertyMetrics?.pending ? 1 : 0) + (enquiryMetrics?.newCount ? 1 : 0) + (valuationMetrics?.newCount ? 1 : 0)}</Badge>} bodyClassName="p-0">
              <ul className="divide-y divide-background-100">
                {propertyMetrics?.pending ? <li><Link to="/admin/properties/pending" className="flex items-center gap-3 px-5 py-4 hover:bg-background-100"><Badge tone="secondary">{propertyMetrics.pending}</Badge><span className="text-sm font-semibold text-foreground-950">Property listings awaiting review</span></Link></li> : null}
                {enquiryMetrics?.newCount ? <li><Link to="/admin/enquiries" className="flex items-center gap-3 px-5 py-4 hover:bg-background-100"><Badge tone="accent">{enquiryMetrics.newCount}</Badge><span className="text-sm font-semibold text-foreground-950">New enquiries need a response</span></Link></li> : null}
                {valuationMetrics?.newCount ? <li><Link to="/admin/valuations" className="flex items-center gap-3 px-5 py-4 hover:bg-background-100"><Badge tone="accent">{valuationMetrics.newCount}</Badge><span className="text-sm font-semibold text-foreground-950">Valuation requests need review</span></Link></li> : null}
                {overview.alerts.map((alert) => (
                  <li key={alert.id}><Link to={alert.to ?? '/admin/stays-dashboard'} className="flex items-start gap-3 px-5 py-4 hover:bg-background-100"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary-100 text-secondary-900"><i className={`${alert.icon} text-base`}></i></span><span><span className="block text-sm font-semibold text-foreground-950">{alert.title}</span><span className="block text-xs text-foreground-600">{alert.message}</span></span></Link></li>
                ))}
              </ul>
              {overview.alerts.length === 0 && !propertyMetrics?.pending && !enquiryMetrics?.newCount && !valuationMetrics?.newCount ? <div className="p-5"><EmptyState compact icon="ri-checkbox-circle-line" title="No current alerts." /></div> : null}
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card title="Upcoming Check-ins" icon="ri-login-circle-line" actions={<Link to="/admin/bookings" className={btnSmall}>Bookings</Link>} bodyClassName="p-0">
              <BookingList rows={overview.upcomingCheckInList} dateKey="check_in" />
            </Card>
            <Card title="Upcoming Check-outs" icon="ri-logout-circle-line" actions={<Link to="/admin/operations/cleaning" className={btnSmall}>Cleaning</Link>} bodyClassName="p-0">
              <BookingList rows={overview.upcomingCheckOutList} dateKey="check_out" />
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}