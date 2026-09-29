import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import {
  Badge,
  Card,
  ErrorState,
  LoadingBlock,
  SectionLabel,
  StatCard,
  btnGhost,
  btnPrimary,
  btnSmall,
} from '@/pages/admin/components/AdminUI';
import { formatPKR } from '@/utils/stays';

const defaultSummary = {
  totalProperties: 0,
  publishedProperties: 0,
  pendingListings: 0,
  soldProperties: 0,
  rentedProperties: 0,
  saleProperties: 0,
  rentProperties: 0,
  newEnquiries: 0,
  valuationRequests: 0,
  totalStays: 0,
  publishedStays: 0,
  pendingStays: 0,
  activeBookings: 0,
  upcomingCheckIns: 0,
  upcomingCheckOuts: 0,
  occupancyRate: 0,
  bookingRevenue: 0,
  pendingPayouts: 0,
  users: 0,
  agents: 0,
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [propertiesResult, staysResult, bookingsResult, usersResult, agentsResult, enquiriesResult, valuationsResult] =
          await Promise.allSettled([
            supabase.from('properties').select('id, listing_type, status'),
            supabase.from('stays').select('id, status'),
            supabase.from('bookings').select('id, status, total, currency'),
            supabase.from('profiles').select('id'),
            supabase.from('agents').select('id'),
            supabase.from('enquiries').select('id, status'),
            supabase.from('valuations').select('id, status'),
          ]);

        const propertyRows = propertiesResult.status === 'fulfilled' ? (propertiesResult.value.data ?? []) : [];
        const stayRows = staysResult.status === 'fulfilled' ? (staysResult.value.data ?? []) : [];
        const bookingRows = bookingsResult.status === 'fulfilled' ? (bookingsResult.value.data ?? []) : [];
        const userRows = usersResult.status === 'fulfilled' ? (usersResult.value.data ?? []) : [];
        const agentRows = agentsResult.status === 'fulfilled' ? (agentsResult.value.data ?? []) : [];
        const enquiryRows = enquiriesResult.status === 'fulfilled' ? (enquiriesResult.value.data ?? []) : [];
        const valuationRows = valuationsResult.status === 'fulfilled' ? (valuationsResult.value.data ?? []) : [];

        const nextSummary = {
          totalProperties: propertyRows.length,
          publishedProperties: propertyRows.filter((item: any) => ['published', 'PUBLISHED'].includes(item.status)).length,
          pendingListings: propertyRows.filter((item: any) => ['pending', 'PENDING'].includes(item.status)).length,
          soldProperties: propertyRows.filter((item: any) => ['sold', 'SOLD'].includes(item.status)).length,
          rentedProperties: propertyRows.filter((item: any) => ['rented', 'RENTED'].includes(item.status)).length,
          saleProperties: propertyRows.filter((item: any) => item.listing_type === 'sale' || item.listing_type === 'SALE').length,
          rentProperties: propertyRows.filter((item: any) => item.listing_type === 'rent' || item.listing_type === 'RENT').length,
          newEnquiries: enquiryRows.filter((item: any) => ['new', 'NEW'].includes(item.status)).length,
          valuationRequests: valuationRows.filter((item: any) => ['new', 'NEW'].includes(item.status)).length,
          totalStays: stayRows.length,
          publishedStays: stayRows.filter((item: any) => ['published', 'PUBLISHED'].includes(item.status)).length,
          pendingStays: stayRows.filter((item: any) => ['pending', 'PENDING'].includes(item.status)).length,
          activeBookings: bookingRows.filter((item: any) => ['confirmed', 'CONFIRMED', 'checked_in', 'CHECKED_IN'].includes(item.status)).length,
          upcomingCheckIns: bookingRows.filter((item: any) => item.status === 'confirmed' || item.status === 'CONFIRMED').length,
          upcomingCheckOuts: bookingRows.filter((item: any) => item.status === 'checked_in' || item.status === 'CHECKED_IN').length,
          occupancyRate: stayRows.length ? Math.min(100, Math.round((bookingRows.length / stayRows.length) * 100)) : 0,
          bookingRevenue: bookingRows.reduce((sum, item: any) => sum + Number(item.total || 0), 0),
          pendingPayouts: 0,
          users: userRows.length,
          agents: agentRows.length,
        };

        if (!active) return;
        setSummary(nextSummary);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Could not load the current dashboard metrics.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const realEstateStats = useMemo(
    () => [
      { label: 'Total Properties', value: summary.totalProperties, icon: 'ri-home-office-line', tone: 'primary' },
      { label: 'Published', value: summary.publishedProperties, icon: 'ri-upload-cloud-2-line' },
      { label: 'For Sale', value: summary.saleProperties, icon: 'ri-price-tag-3-line' },
      { label: 'For Rent', value: summary.rentProperties, icon: 'ri-key-2-line' },
      { label: 'Pending Listings', value: summary.pendingListings, icon: 'ri-time-line', tone: 'accent' },
      { label: 'Sold', value: summary.soldProperties, icon: 'ri-checkbox-circle-line' },
      { label: 'Rented', value: summary.rentedProperties, icon: 'ri-home-2-line' },
      { label: 'New Enquiries', value: summary.newEnquiries, icon: 'ri-mail-line' },
      { label: 'Valuation Requests', value: summary.valuationRequests, icon: 'ri-scales-3-line' },
    ],
    [summary],
  );

  const staysStats = useMemo(
    () => [
      { label: 'Total Stays', value: summary.totalStays, icon: 'ri-hotel-line', tone: 'primary' },
      { label: 'Published Stays', value: summary.publishedStays, icon: 'ri-check-double-line' },
      { label: 'Active Bookings', value: summary.activeBookings, icon: 'ri-calendar-check-line' },
      { label: 'Upcoming Check-ins', value: summary.upcomingCheckIns, icon: 'ri-login-circle-line' },
      { label: 'Upcoming Check-outs', value: summary.upcomingCheckOuts, icon: 'ri-logout-circle-line' },
      { label: 'Pending Verification', value: summary.pendingStays, icon: 'ri-shield-star-line', tone: 'accent' },
      { label: 'Occupancy', value: `${summary.occupancyRate}%`, icon: 'ri-pie-chart-2-line' },
      { label: 'Booking Revenue', value: formatPKR(summary.bookingRevenue), icon: 'ri-money-dollar-circle-line' },
      { label: 'Pending Payouts', value: formatPKR(summary.pendingPayouts), icon: 'ri-wallet-3-line' },
    ],
    [summary],
  );

  const quickLinks = [
    { to: '/admin/properties', label: 'All Properties', icon: 'ri-home-office-line', tone: 'primary' },
    { to: '/admin/enquiries', label: 'Enquiries', icon: 'ri-mail-line', tone: 'secondary' },
    { to: '/admin/valuations', label: 'Valuations', icon: 'ri-scales-3-line', tone: 'accent' },
    { to: '/admin/stays', label: 'All Stays', icon: 'ri-hotel-line', tone: 'primary' },
    { to: '/admin/bookings', label: 'Bookings', icon: 'ri-calendar-check-line', tone: 'secondary' },
    { to: '/admin/content/homepage', label: 'Website Content', icon: 'ri-layout-grid-line', tone: 'accent' },
  ];

  return (
    <AdminLayout
      title="ZAMIN Business Overview"
      subtitle="Central overview for the ZAMIN property business and ZAMIN Stays operations."
      actions={
        <>
          <Link to="/admin/properties" className={btnGhost}>
            <i className="ri-home-office-line text-base"></i> Real Estate
          </Link>
          <Link to="/admin/stays/new" className={btnPrimary}>
            <i className="ri-add-line text-base"></i> Add Stay
          </Link>
        </>
      }
    >
      {loading ? (
        <LoadingBlock label="Loading business overview…" rows={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : (
        <div className="flex flex-col gap-8">
          <section>
            <SectionLabel className="mb-3">REAL ESTATE</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {realEstateStats.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} tone={item.tone as any} />
              ))}
            </div>
          </section>

          <section>
            <SectionLabel className="mb-3">ZAMIN STAYS</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {staysStats.map((item) => (
                <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} tone={item.tone as any} />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card title="Quick actions" icon="ri-dashboard-line" bodyClassName="p-0">
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 rounded-md border border-background-200 bg-background-50 px-3 py-3 text-sm font-medium text-foreground-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-md ${link.tone === 'primary' ? 'bg-primary-100 text-primary-800' : link.tone === 'secondary' ? 'bg-secondary-100 text-secondary-900' : 'bg-accent-100 text-accent-800'}`}>
                      <i className={`${link.icon} text-base`}></i>
                    </span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </Card>

            <Card title="Priority focus" icon="ri-alert-line" bodyClassName="p-0">
              <div className="divide-y divide-background-100">
                <div className="flex items-start gap-3 px-5 py-4">
                  <Badge tone="secondary" icon="ri-shield-star-line">Urgent</Badge>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground-950">Pending listings and stays</p>
                    <p className="text-xs text-foreground-600">Review live pipeline items to keep the platform fresh and compliant.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 px-5 py-4">
                  <Badge tone="muted" icon="ri-mail-line">Leads</Badge>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground-950">Buyer and tenant enquiries</p>
                    <p className="text-xs text-foreground-600">Respond to new property and valuation leads in the queue.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 px-5 py-4">
                  <Badge tone="primary" icon="ri-layout-grid-line">Content</Badge>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground-950">Website updates</p>
                    <p className="text-xs text-foreground-600">Refresh homepage, listing pages and conversion content across the brand.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card
              title="Real Estate pipeline"
              icon="ri-building-2-line"
              actions={<Link to="/admin/properties" className={btnSmall}>Open</Link>}
              bodyClassName="p-0"
            >
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-600">Total listings</span>
                  <span className="font-semibold text-foreground-950">{summary.totalProperties}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-600">Pending</span>
                  <span className="font-semibold text-foreground-950">{summary.pendingListings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-600">Sold</span>
                  <span className="font-semibold text-foreground-950">{summary.soldProperties}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-600">Rented</span>
                  <span className="font-semibold text-foreground-950">{summary.rentedProperties}</span>
                </div>
              </div>
            </Card>

            <Card
              title="Stays operations"
              icon="ri-hotel-line"
              actions={<Link to="/admin/stays-dashboard" className={btnSmall}>Overview</Link>}
              bodyClassName="p-0"
            >
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-600">Active bookings</span>
                  <span className="font-semibold text-foreground-950">{summary.activeBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-600">Upcoming check-ins</span>
                  <span className="font-semibold text-foreground-950">{summary.upcomingCheckIns}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-600">Pending verification</span>
                  <span className="font-semibold text-foreground-950">{summary.pendingStays}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-600">Booking revenue</span>
                  <span className="font-semibold text-primary-700">{formatPKR(summary.bookingRevenue)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

