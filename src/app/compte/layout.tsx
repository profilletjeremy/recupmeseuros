import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon compte — KaribPrint',
  description: 'Gérez votre compte KaribPrint, consultez vos commandes et vos informations personnelles.',
};

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
