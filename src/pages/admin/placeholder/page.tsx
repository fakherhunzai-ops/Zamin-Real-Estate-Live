import { Link } from 'react-router-dom';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { Card, EmptyState, btnPrimary } from '@/pages/admin/components/AdminUI';

export default function AdminPlaceholderPage({
  title,
  subtitle,
  icon,
  message,
}: {
  title: string;
  subtitle: string;
  icon: string;
  message: string;
}) {
  return (
    <AdminLayout title={title} subtitle={subtitle}>
      <Card>
        <EmptyState
          icon={icon}
          title={`${title} will appear here`}
          message={message}
          action={
            <Link to="/admin/dashboard" className={btnPrimary}>
              <i className="ri-dashboard-3-line text-base"></i> Back to dashboard
            </Link>
          }
        />
      </Card>
    </AdminLayout>
  );
}