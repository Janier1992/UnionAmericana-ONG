import type { Metadata } from 'next';
import UneteClient from './UneteClient';

export const metadata: Metadata = {
  title: 'Únete — La Unión Americana',
  robots: { index: false, follow: true },
};

export default function UnetePage() {
  return <UneteClient />;
}
