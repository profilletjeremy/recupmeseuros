import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon panier — KaribPrint',
  description: 'Récapitulatif de votre commande d\'impression. Livraison par avion dans tous les DOM-COM.',
};

export default function PanierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
