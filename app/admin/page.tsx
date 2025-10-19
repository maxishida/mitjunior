'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <AdminDashboard />
    </AdminLayout>
  );
}