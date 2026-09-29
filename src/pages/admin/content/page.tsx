import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { Card, SectionLabel, StatCard, btnGhost, btnPrimary } from '@/pages/admin/components/AdminUI';

const contentSections = [
  { title: 'Homepage', to: '/admin/content/homepage', icon: 'ri-layout-top-line', desc: 'Hero, featured listings, services and final CTA.' },
  { title: 'Buy Page', to: '/admin/content/buy', icon: 'ri-home-gear-line', desc: 'Buy flow and section copy.' },
  { title: 'Rent Page', to: '/admin/content/rent', icon: 'ri-home-smile-line', desc: 'Rental messaging and lead funnel.' },
  { title: 'Sell Page', to: '/admin/content/sell', icon: 'ri-money-dollar-circle-line', desc: 'Seller value proposition and CTAs.' },
  { title: 'About', to: '/admin/content/about', icon: 'ri-building-3-line', desc: 'Brand story and business overview.' },
  { title: 'Services', to: '/admin/content/services', icon: 'ri-tools-fill', desc: 'Commercial and residential service pages.' },
  { title: 'Contact', to: '/admin/content/contact', icon: 'ri-phone-line', desc: 'Business contact details and map details.' },
  { title: 'FAQs', to: '/admin/content/faqs', icon: 'ri-question-answer-line', desc: 'Customer support content and categories.' },
  { title: 'Locations', to: '/admin/content/locations', icon: 'ri-map-pin-2-line', desc: 'Region and destination pages.' },
  { title: 'Testimonials', to: '/admin/content/testimonials', icon: 'ri-chat-quote-line', desc: 'Customer trust and social proof.' },
  { title: 'Header', to: '/admin/content/header', icon: 'ri-header-line', desc: 'Global navigation and CTA links.' },
  { title: 'Footer', to: '/admin/content/footer', icon: 'ri-article-line', desc: 'Global contact, links and legal content.' },
  { title: 'CTAs', to: '/admin/content/ctas', icon: 'ri-links-line', desc: 'Reusable conversion blocks and follow-up prompts.' },
];

export default function AdminContentOverviewPage() {
  return (
    <AdminLayout
      title="Website Content"
      subtitle="Central CMS for the public ZAMIN website."
      actions={
        <>
          <Link to="/admin/content/stays-homepage" className={btnGhost}>
            <i className="ri-layout-top-line text-base"></i> Stays Homepage
          </Link>
          <Link to="/admin/content/destinations" className={btnPrimary}>
            <i className="ri-map-pin-2-line text-base"></i> Manage destinations
          </Link>
        </>
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Live Pages" value={contentSections.length} icon="ri-file-list-3-line" tone="primary" />
        <StatCard label="Menus" value={3} icon="ri-menu-3-line" />
        <StatCard label="Locations" value={8} icon="ri-map-pin-2-line" />
        <StatCard label="CTAs" value={6} icon="ri-links-line" tone="accent" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {contentSections.map((section) => (
          <Card
            key={section.to}
            title={section.title}
            icon={section.icon}
            bodyClassName="p-0"
            actions={
              <Link to={section.to} className={btnGhost}>
                Open
              </Link>
            }
          >
            <div className="px-5 py-4">
              <p className="text-sm text-foreground-600">{section.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <SectionLabel>Editable</SectionLabel>
                <i className="ri-arrow-right-line text-foreground-400"></i>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
