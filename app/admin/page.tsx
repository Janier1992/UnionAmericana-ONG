import type { Metadata } from 'next';
import AdminPortalClient from './AdminPortalClient';

export const metadata: Metadata = {
  title: 'Portal Administrativo — La Unión Americana',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPortalClient />;
}
