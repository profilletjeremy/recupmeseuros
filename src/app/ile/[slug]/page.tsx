import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrustBadges from '@/components/TrustBadges';
import { territories, getTerritoryBySlug } from '@/data/territories';
import { getFeaturedProducts } from '@/data/products';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return territories.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const territory = getTerritoryBySlug(slug);
  if (!territory) return {};
  return {
    title: `Imprimerie en ligne ${territory.name} — KaribPrint`,
    description: territory.seoDescription,
  };
}

const LOCAL_REASONS = {
  guadeloupe: [
    { icon: '🌊', title: 'Livraison en 5 à 7 jours', desc: 'Expédition aérienne directe en Guadeloupe, sur Grande-Terre, Basse-Terre et les îles.' },
    { icon: '🌴', title: 'Spécialiste DOM', desc: 'Nous maîtrisons les contraintes logistiques de la Guadeloupe pour une livraison sans surprise.' },
    { icon: '📦', title: 'Emballage renforcé', desc: 'Vos impressions arrivent protégées dans des emballages adaptés au transport aérien tropical.' },
  ],
  martinique: [
    { icon: '🌺', title: 'Livraison en 5 à 7 jours', desc: 'Livraison à Fort-de-France, Le Lamentin, Schoelcher et partout en Martinique.' },
    { icon: '🏖️', title: 'Partenaire local', desc: 'KaribPrint connaît les besoins des professionnels martiniquais en supports de communication.' },
    { icon: '📦', title: 'Suivi en temps réel', desc: 'Suivez votre colis par email depuis l\'expédition jusqu\'à la livraison à domicile.' },
  ],
  guyane: [
    { icon: '🌿', title: 'Livraison en 7 à 10 jours', desc: 'Livraison à Cayenne, Kourou, Saint-Laurent-du-Maroni et partout en Guyane.' },
    { icon: '🚀', title: 'Expédition aérienne', desc: 'Vos impressions sont acheminées par voie aérienne pour des délais maîtrisés vers la Guyane.' },
    { icon: '✅', title: 'Qualité garantie', desc: 'Chaque commande est vérifiée avant expédition. Non satisfait ? Nous réimprimons.' },
  ],
  'la-reunion': [
    { icon: '🌋', title: 'Livraison en 7 à 10 jours', desc: 'Livraison à Saint-Denis, Saint-Paul, Saint-Pierre et partout à La Réunion.' },
    { icon: '☀️', title: 'Impression résistante', desc: 'Nos supports sont adaptés aux conditions climatiques tropicales de La Réunion.' },
    { icon: '💼', title: 'Spécialiste entreprises', desc: 'Tarifs dégressifs et service personnalisé pour les PME et commerçants réunionnais.' },
  ],
  'saint-martin': [
    { icon: '🏝️', title: 'Livraison en 7 à 10 jours', desc: 'Livraison à Marigot, Grand-Case et partout dans la partie française de Saint-Martin.' },
    { icon: '🌅', title: 'Qualité premium', desc: 'Cartes de visite luxe, menus de restaurant et supports haut de gamme pour Saint-Martin.' },
    { icon: '📋', title: 'Devis rapide', desc: 'Réponse garantie sous 24h ouvrées pour tous vos projets d\'impression à Saint-Martin.' },
  ],
  'saint-barthelemy': [
    { icon: '⚓', title: 'Livraison en 7 à 10 jours', desc: 'Livraison à Gustavia, Saint-Jean et partout à Saint-Barthélemy.' },
    { icon: '🥂', title: 'Impression haut de gamme', desc: 'Supports luxueux pour hôtels, restaurants et boutiques de Saint-Barth.' },
    { icon: '🎨', title: 'Finitions premium', desc: 'Soft-touch, vernis sélectif, pelliculage — les finitions qui font la différence.' },
  ],
};

export default async function TerritoirePage({ params }: Props) {
  const { slug } = await params;
  const territory = getTerritoryBySlug(slug);
  if (!territory) notFound();

  const featuredProducts = getFeaturedProducts();
  const reasons = LOCAL_REASONS[slug as keyof typeof LOCAL_REASONS] ?? LOCAL_REASONS.guadeloupe;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section
          className="py-16 md:py-24 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0077B6 0%, #005F8E 50%, #003F5C 100%)' }}
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: '#F9C74F' }} />
          <div className="relative max-w-5xl mx-auto px-4">
            <nav className="text-sm text-blue-300 mb-6">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <span className="mx-2">/</span>
              <span>{territory.name}</span>
            </nav>
            <div className="flex items-start gap-4 mb-4">
              <span className="bg-white/15 text-sm font-bold px-3 py-1.5 rounded-full">
                Département {territory.dept}
              </span>
              <span className="bg-palm/80 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                Livraison {territory.deliveryDays}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Votre imprimerie en ligne<br />
              <span style={{ color: '#F9C74F' }}>en {territory.name}</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mb-8 leading-relaxed">
              {territory.intro}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-coral hover:bg-coral-dark text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg"
              >
                Voir nos produits →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors backdrop-blur-sm"
              >
                Devis gratuit sous 24h
              </Link>
            </div>
          </div>
        </section>

        {/* Why KaribPrint for this territory */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Pourquoi KaribPrint pour la {territory.name} ?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {reasons.map((r) => (
                <div key={r.title} className="bg-sand rounded-2xl p-6 text-center">
                  <span className="text-4xl block mb-3">{r.icon}</span>
                  <h3 className="font-bold mb-2">{r.title}</h3>
                  <p className="text-sm text-text-light leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery details */}
        <section className="py-12 bg-sand">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Livraison en {territory.name}
                </h2>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-full bg-ocean text-white text-sm flex items-center justify-center flex-shrink-0">1</span>
                    <div>
                      <p className="font-semibold text-sm">Commande et vérification</p>
                      <p className="text-sm text-text-light">Votre fichier est contrôlé sous 4h ouvrées</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-full bg-ocean text-white text-sm flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <p className="font-semibold text-sm">Impression (2–3 jours ouvrés)</p>
                      <p className="text-sm text-text-light">Production en atelier avec contrôle qualité</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-full bg-ocean text-white text-sm flex items-center justify-center flex-shrink-0">3</span>
                    <div>
                      <p className="font-semibold text-sm">Expédition aérienne</p>
                      <p className="text-sm text-text-light">Départ France métropole vers {territory.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="w-8 h-8 rounded-full bg-palm text-white text-sm flex items-center justify-center flex-shrink-0">✓</span>
                    <div>
                      <p className="font-semibold text-sm text-palm">Livraison en {territory.deliveryDays}</p>
                      <p className="text-sm text-text-light">À votre adresse en {territory.name}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold mb-4">Principales zones livrées</h3>
                <div className="flex flex-wrap gap-2">
                  {territory.cities.map((city) => (
                    <span key={city} className="bg-sand text-text-light text-sm px-3 py-1.5 rounded-lg font-medium">
                      {city}
                    </span>
                  ))}
                  <span className="bg-ocean/10 text-ocean text-sm px-3 py-1.5 rounded-lg font-semibold">
                    Et toute la {territory.name}
                  </span>
                </div>
                <p className="text-xs text-text-lighter mt-4">
                  {territory.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-14 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-3">
              Nos produits livrés en {territory.name}
            </h2>
            <p className="text-text-light mb-8">
              Tous nos produits sont livrables en {territory.name} en {territory.deliveryDays} après impression.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div
                    className="h-36 flex items-center justify-center text-5xl"
                    style={{ background: 'linear-gradient(135deg, #FFF8F3 0%, #F5E8DC 100%)' }}
                  >
                    {product.emoji}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1 group-hover:text-ocean transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-text-light line-clamp-2 mb-2">{product.description}</p>
                    <span className="font-bold text-ocean text-sm">
                      À partir de {product.priceFrom.toFixed(2).replace('.', ',')} €
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-ocean text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-ocean-dark transition-colors"
              >
                Voir tous nos produits →
              </Link>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="py-12 bg-sand">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl font-bold text-center mb-8">Nos engagements</h2>
            <TrustBadges />
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-16 text-center text-white"
          style={{ background: 'linear-gradient(135deg, #E94B3C 0%, #C43A2D 100%)' }}
        >
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-3">
              Prêt à commander en {territory.name} ?
            </h2>
            <p className="text-red-100 mb-6">
              Devis gratuit sous 24h. Impression professionnelle livrée chez vous.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-coral font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-sand transition-colors"
            >
              Demander un devis gratuit →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
