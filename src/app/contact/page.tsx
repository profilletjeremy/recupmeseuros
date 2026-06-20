import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactContent from './ContactContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Demandez un devis — KaribPrint',
  description: 'Contactez l\'équipe KaribPrint pour un devis d\'impression. Réponse garantie sous 24h ouvrées.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <Suspense fallback={<div className="py-20 text-center text-sm text-gray-400">Chargement…</div>}>
          <ContactContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
