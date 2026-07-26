import type { Metadata } from 'next';
import DonacionesClient from './DonacionesClient';

export const metadata: Metadata = {
  title: 'Donaciones y Contribuciones — La Unión Americana',
  robots: { index: false, follow: true },
};

export default function DonacionesPage() {
  return <DonacionesClient />;
}
