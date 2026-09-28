import { useState } from 'react';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import StayForm from '@/pages/admin/stays/components/StayForm';

const STEPS = [
  { id: 'basics', label: 'Basic Info', icon: 'ri-file-text-line' },
  { id: 'location', label: 'Location', icon: 'ri-map-pin-2-line' },
  { id: 'capacity', label: 'Property Details', icon: 'ri-group-line' },
  { id: 'images', label: 'Photos', icon: 'ri-image-2-line' },
  { id: 'pricing', label: 'Pricing', icon: 'ri-money-dollar-circle-line' },
  { id: 'policies', label: 'Rules & Policies', icon: 'ri-shield-check-line' },
  { id: 'publishing', label: 'Review & Publish', icon: 'ri-upload-cloud-2-line' },
];

export default function AdminStayNewPage() {
  const [active, setActive] = useState('basics');

  const goTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AdminLayout
      title="Add a stay"
      subtitle="Create a new ZAMIN Stays listing. Nothing is public until you publish it."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 flex flex-col gap-1 rounded-card border border-background-200 bg-background-50 p-3">
            {STEPS.map((step, index) => {
              const isActive = active === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goTo(step.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-800 text-background-50 dark:text-foreground-950' : 'text-foreground-700 hover:bg-background-100'
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${isActive ? 'bg-accent-500 text-primary-950' : 'bg-background-200 text-foreground-600'}`}>
                    {index + 1}
                  </span>
                  <span className="flex-1 truncate">{step.label}</span>
                  <i className={`${step.icon} text-base`}></i>
                </button>
              );
            })}
            <p className="mt-2 px-3 text-xs text-foreground-500">
              Fill each section, then set the status to <strong>PUBLISHED</strong> to go live.
            </p>
          </nav>
        </aside>

        <div className="min-w-0">
          <StayForm />
        </div>
      </div>
    </AdminLayout>
  );
}