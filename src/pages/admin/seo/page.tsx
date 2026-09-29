import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { Card, SectionLabel, StatCard, btnPrimary } from '@/pages/admin/components/AdminUI';

const seoBlocks = [
  { title: 'Site SEO', desc: 'Default title, meta description and social sharing defaults.', icon: 'ri-global-line' },
  { title: 'Page Metadata', desc: 'Custom page titles and descriptions for important public pages.', icon: 'ri-file-text-line' },
  { title: 'Redirects', desc: '301/302 redirects for moved or retired pages.', icon: 'ri-route-line' },
  { title: 'Sitemap', desc: 'Indexing and sitemap settings for search visibility.', icon: 'ri-map-2-line' },
];

export default function AdminSeoOverviewPage() {
  return (
    <AdminLayout
      title="SEO & Indexing"
      subtitle="Manage the search, metadata and public visibility settings for ZAMIN."
      actions={
        <Link to="/admin/seo/redirects" className={btnPrimary}>
          <i className="ri-route-line text-base"></i> Redirects
        </Link>
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pages with SEO" value="24" icon="ri-file-search-line" tone="primary" />
        <StatCard label="Redirects" value="8" icon="ri-route-line" />
        <StatCard label="Canonical URLs" value="12" icon="ri-link" />
        <StatCard label="Indexed" value="92%" icon="ri-search-eye-line" tone="accent" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {seoBlocks.map((item) => (
          <Card key={item.title} title={item.title} icon={item.icon} bodyClassName="p-0">
            <div className="px-5 py-4">
              <p className="text-sm text-foreground-600">{item.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <SectionLabel>Manage</SectionLabel>
                <i className="ri-arrow-right-line text-foreground-400"></i>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
