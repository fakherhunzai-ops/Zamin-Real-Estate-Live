import { useState } from 'react';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { useAdminToast } from '@/pages/admin/components/AdminToast';
import {
  Badge,
  btnGhost,
  btnPrimary,
  inputClass,
  labelClass,
} from '@/pages/admin/components/AdminUI';

type Section = {
  id: string;
  title: string;
  icon: string;
  enabled: boolean;
  description: string;
  heading: string;
};

const INITIAL: Section[] = [
  { id: 'hero', title: 'Hero', icon: 'ri-layout-top-line', enabled: true, description: 'Headline, subtext and search bar.', heading: 'Stay Somewhere Worth Remembering' },
  { id: 'featured', title: 'Featured Stays', icon: 'ri-star-line', enabled: true, description: 'Hand-picked published stays.', heading: 'Featured stays' },
  { id: 'destinations', title: 'Destinations', icon: 'ri-map-pin-2-line', enabled: true, description: 'Explore by destination cards.', heading: 'Explore by destination' },
  { id: 'categories', title: 'Stay Categories', icon: 'ri-apps-2-line', enabled: true, description: 'Browse by stay type.', heading: 'Browse by stay type' },
  { id: 'why', title: 'Why ZAMIN Stays', icon: 'ri-shield-check-line', enabled: true, description: 'Trust and value points.', heading: 'Why book with ZAMIN' },
  { id: 'managed', title: 'Managed Hosting', icon: 'ri-vip-diamond-line', enabled: true, description: 'Managed hosting explainer + CTA.', heading: 'Let ZAMIN manage your property' },
  { id: 'host', title: 'Become a Host', icon: 'ri-user-heart-line', enabled: true, description: 'Host onboarding banner.', heading: 'Turn your property into a managed stay' },
  { id: 'testimonials', title: 'Testimonials', icon: 'ri-chat-quote-line', enabled: true, description: 'Guest and host quotes.', heading: 'Loved by guests and hosts' },
  { id: 'faq', title: 'FAQ', icon: 'ri-question-answer-line', enabled: true, description: 'Common questions.', heading: 'Frequently asked questions' },
  { id: 'cta', title: 'Final CTA', icon: 'ri-flag-2-line', enabled: true, description: 'Closing call to action.', heading: 'Find your stay in Gilgit-Baltistan' },
];

export default function AdminStaysHomepagePage() {
  const { notify } = useAdminToast();
  const [sections, setSections] = useState<Section[]>(INITIAL);
  const [editing, setEditing] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, enabled: !section.enabled } : section)));

  const move = (id: string, direction: -1 | 1) =>
    setSections((prev) => {
      const index = prev.findIndex((section) => section.id === id);
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const updateHeading = (id: string, heading: string) =>
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, heading } : section)));

  return (
    <AdminLayout
      title="Stay Homepage"
      subtitle="Section structure of the ZAMIN Stays landing page."
      actions={
        <button type="button" onClick={() => notify({ title: 'Homepage layout saved', message: 'Enable, reorder and headings applied.', tone: 'success' })} className={btnPrimary}>
          <i className="ri-save-3-line text-base"></i> Save layout
        </button>
      }
    >
      <div className="mb-4 rounded-card border border-background-200 bg-background-100 p-4">
        <p className="flex items-start gap-2 text-sm text-foreground-700">
          <i className="ri-information-line mt-0.5 text-accent-600"></i>
          Enable, disable and reorder the sections shown on <strong className="mx-1">/stays</strong>. Use Preview to see the live page.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {sections.map((section, index) => (
          <div key={section.id} className="rounded-card border border-background-200 bg-background-50">
            <div className="flex flex-wrap items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-background-100 text-accent-700">
                <i className={`${section.icon} text-lg`}></i>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base font-semibold text-foreground-950">{section.title}</h3>
                  <Badge tone={section.enabled ? 'primary' : 'muted'}>{section.enabled ? 'Visible' : 'Hidden'}</Badge>
                </div>
                <p className="text-xs text-foreground-500">{section.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button type="button" disabled={index === 0} onClick={() => move(section.id, -1)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-600 hover:bg-background-100 disabled:opacity-40"><i className="ri-arrow-up-s-line"></i></button>
                <button type="button" disabled={index === sections.length - 1} onClick={() => move(section.id, 1)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-600 hover:bg-background-100 disabled:opacity-40"><i className="ri-arrow-down-s-line"></i></button>
                <button type="button" onClick={() => setEditing(editing === section.id ? null : section.id)} className={`${btnGhost} px-3 py-1.5 text-xs`}>
                  <i className="ri-edit-line text-sm"></i> Edit
                </button>
                <a href="/stays" target="_blank" rel="noopener noreferrer" className={`${btnGhost} px-3 py-1.5 text-xs`}>
                  <i className="ri-eye-line text-sm"></i> Preview
                </a>
                <button type="button" onClick={() => toggle(section.id)} className={`${btnGhost} px-3 py-1.5 text-xs`}>
                  <i className={section.enabled ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'}></i> {section.enabled ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {editing === section.id && (
              <div className="border-t border-background-100 p-4">
                <label className="flex flex-col gap-1.5 md:max-w-lg">
                  <span className={labelClass}>Section heading</span>
                  <input className={inputClass} value={section.heading} onChange={(event) => updateHeading(section.id, event.target.value)} />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}