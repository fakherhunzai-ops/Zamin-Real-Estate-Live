import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import StayForm from '@/pages/admin/stays/components/StayForm';
import StayRateRulesEditor from '@/pages/admin/stays/components/StayRateRulesEditor';
import StayBlockedDates from '@/pages/admin/stays/components/StayBlockedDates';
import { useAdminStay } from '@/hooks/useAdminStay';

function Section({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-background-200 bg-background-50 p-5 md:p-6">
      <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-foreground-950">
        <span className="flex h-5 w-5 items-center justify-center text-accent-600">
          <i className={`${icon} text-lg`}></i>
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function AdminStayEditPage() {
  const { id } = useParams<{ id: string }>();
  const { stay, loading, error, refetch } = useAdminStay(id);

  if (loading) {
    return (
      <AdminLayout title="Edit stay">
        <div className="flex items-center justify-center py-16 text-foreground-500">
          <i className="ri-loader-4-line animate-spin text-2xl"></i>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stay) {
    return (
      <AdminLayout title="Edit stay">
        <div className="flex flex-col items-center gap-3 rounded-card border border-background-200 bg-background-50 py-16 text-center">
          <p className="text-foreground-700">{error || 'This stay could not be found.'}</p>
          <div className="flex gap-3">
            <button type="button" onClick={refetch} className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary-800 px-4 py-2.5 text-sm font-semibold text-background-50">
              <i className="ri-refresh-line text-base"></i> Retry
            </button>
            <Link to="/admin/stays" className="inline-flex cursor-pointer items-center whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-700">
              Back to stays
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={stay.title}
      subtitle={`Editing /${stay.slug}`}
      actions={
        <Link
          to={`/stays/${stay.slug}`}
          className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100"
        >
          <i className="ri-external-link-line text-base"></i>
          View public page
        </Link>
      }
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <StayForm stay={stay} onSaved={refetch} />

        <Section title="Pricing rules" icon="ri-price-tag-3-line">
          <StayRateRulesEditor stayId={stay.id} baseRate={stay.base_nightly_rate} />
        </Section>

        <Section title="Availability & blocked dates" icon="ri-calendar-2-line">
          <StayBlockedDates stayId={stay.id} />
        </Section>
      </div>
    </AdminLayout>
  );
}