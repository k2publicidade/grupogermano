import type { Metadata } from 'next';
import { isAdmin } from '@/lib/cms/auth';
import { AdminDashboard } from './admin-dashboard';
import { AdminLogin } from './admin-login';

export const metadata: Metadata = { title: 'CMS Mundo Encantado', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  return await isAdmin() ? <AdminDashboard /> : <AdminLogin />;
}
