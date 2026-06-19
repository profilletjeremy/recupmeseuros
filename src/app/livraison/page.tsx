import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { territories } from '@/data/territories';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Livraison aux Antilles et La Réunion',
  description:
    'Informations de livraison par territoire : délais, zones desservies et suivi de commande pour la Guadeloupe, Martinique, Guyane, La Réunion, Saint-Martin et Saint-Barthélemy.',
};

const DELIVERY_STEPS = [
  { step: '1', label: 'Commande validée', desc: 'Vous recevez un email de confirmation avec votre numéro de commande.' },
  { step: '2', label: 'Vérification du fichier', desc: 'Notre équipe contrôle votre fichier (résolution, fond perdu, colorimétrie) sous 4h.' },
  { step: '3', label: 'Impression', desc: 'Votre commande est imprimée en 24 à 48h ouvrés selon le produit.' },
  { step: '4', label: 'Expédition', desc: 'Votre colis est expédié vers votre île par voie aérienne avec un transporteur partenaire.' },
  { step: '5', label: 'Livraison', desc: 'Réception à votre adresse dans les délais indiqués par territoire.' },
];

export default function LivraisonPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Header */}
        <div className="bg-sand border-b border-sand-dark py-10">
          <div className="max-w-6xl mx-auto px-4">
            <nav className="text-sm text-text-light mb-4">
              <Link href="/" className="hover:text-ocean">Accueil</Link>
              <span className="mx-2">/</span>
              <span>Livraison</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Livraison dans les DOM-COM
            </h1>
            <p className="text-text-light max-w-xl">
              KaribPrint livre dans 6 territoires d&apos;outre-mer. Découvrez les délais et conditions
              pour votre île.
            </p>
          </div>
        </div>

        {/* Territories grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Délais par territoire</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {territories.map((t) => (
                <div
                  key={t.code}
                  id={t.code.toLowerCase()}
                  className="border border-gray-100 rounded-2xl p-6 hover:border-ocean/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{t.name}</h3>
                      <p className="text-text-light text-sm">Département / Territoire {t.dept}</p>
                    </div>
                    <span className="bg-ocean text-white font-bold text-sm px-3 py-1 rounded-lg">
                      {t.dept}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-sand rounded-xl p-3">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <p className="text-xs text-text-light">Délai de livraison</p>
                        <p className="font-bold text-sm">{t.deliveryDays}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-sand rounded-xl p-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-text-light">Zone</p>
                        <p className="font-bold text-sm">Zone {t.deliveryZone}</p>
                      </div>
                    </div>
                    <div className="rounded-xl p-3 bg-sand">
                      <p className="text-xs text-text-light mb-1">Principales villes desservies</p>
                      <p className="text-sm font-medium">{t.cities.join(' • ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-12 bg-sand">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Comment se déroule votre livraison ?
            </h2>
            <div className="relative">
              {DELIVERY_STEPS.map((step, i) => (
                <div key={step.step} className="flex gap-5 mb-6 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-ocean text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                      {step.step}
                    </div>
                    {i < DELIVERY_STEPS.length - 1 && (
                      <div className="w-0.5 flex-1 bg-ocean/20 mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-bold mb-1">{step.label}</h3>
                    <p className="text-sm text-text-light">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info boxes */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  emoji: '✈️',
                  title: 'Expédition aérienne',
                  text: 'Tous nos colis sont expédiés par voie aérienne pour garantir des délais maîtrisés vers les territoires d\'outre-mer.',
                },
                {
                  emoji: '📦',
                  title: 'Emballage protecteur',
                  text: 'Vos impressions sont soigneusement emballées dans des tubes carton ou cartons plats renforcés pour arriver intactes.',
                },
                {
                  emoji: '🔍',
                  title: 'Suivi de commande',
                  text: 'Un numéro de suivi vous est communiqué par email dès l\'expédition pour suivre votre colis en temps réel.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
                  <span className="text-5xl block mb-4">{item.emoji}</span>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-text-light">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-sand">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Questions fréquentes</h2>
            <div className="space-y-3">
              {[
                {
                  q: 'Les prix affichés incluent-ils la livraison ?',
                  a: 'Non, les prix affichés sont pour l\'impression uniquement. Les frais de livraison sont calculés au moment du devis selon le territoire et le poids du colis.',
                },
                {
                  q: 'Puis-je livrer à une adresse différente ?',
                  a: 'Oui, vous pouvez indiquer n\'importe quelle adresse de livraison dans les territoires desservis au moment de votre commande.',
                },
                {
                  q: 'Que se passe-t-il si mon fichier est non conforme ?',
                  a: 'Notre équipe vous contacte dans les 4 heures suivant la commande pour vous informer et vous aider à corriger le fichier.',
                },
                {
                  q: 'Les délais incluent-ils l\'impression ?',
                  a: 'Non. Les délais indiqués sont les délais de livraison après expédition. Ajoutez 2 à 3 jours ouvrés pour l\'impression.',
                },
              ].map((item) => (
                <details key={item.q} className="bg-white rounded-xl border border-gray-100 group">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-sm">
                    {item.q}
                    <span className="text-text-lighter group-open:rotate-180 transition-transform ml-2">▾</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-text-light">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 text-center">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="text-xl font-bold mb-3">Une question sur la livraison ?</h2>
            <p className="text-text-light mb-6 text-sm">Notre équipe répond sous 24h du lundi au vendredi.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-ocean text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-ocean-dark transition-colors"
            >
              Nous contacter →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
