import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'KaribPrint — Imprimerie en ligne pour les Antilles et La Réunion',
    template: '%s | KaribPrint',
  },
  description:
    'Commandez vos impressions en ligne : cartes de visite, flyers, affiches, banderoles, roll-up. Livraison en Guadeloupe, Martinique, Guyane, La Réunion, Saint-Martin et Saint-Barthélemy.',
  keywords: [
    'imprimerie antilles',
    'imprimerie guadeloupe',
    'imprimerie martinique',
    'imprimerie réunion',
    'web to print',
    'cartes de visite antilles',
    'flyers guadeloupe',
    'impression en ligne dom',
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'KaribPrint — Imprimerie en ligne pour les Antilles et La Réunion',
    description:
      'Cartes de visite, flyers, affiches et plus — impression professionnelle livrée dans tous les DOM-COM.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white">{children}</body>
    </html>
  );
}
