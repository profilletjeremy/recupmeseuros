import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import ProductVisual from '@/components/ProductVisual';
import { getFeaturedProducts, getPopularProducts, categories, products as staticProducts } from '@/data/products';
import { getCatalogProducts, hasCatalog } from '@/lib/catalog';

const TRUST_BADGES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: '100% revendeur',
    sub: 'Prix professionnels exclusifs',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Prix les plus bas',
    sub: 'Tarifs revendeurs Realisaprint',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    title: 'Livraison DOM-COM',
    sub: 'Expédition aérienne garantie',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: '4,8/5 Avis clients',
    sub: 'Clients vérifiés satisfaits',
  },
];

const PRODUCT_BADGES = ['NOUVEAU !', 'PRIX FOU !', 'EN TENDANCE !', 'BEST-SELLER !', 'NOUVEAU !', 'EN TENDANCE !', 'PRIX FOU !', 'BEST-SELLER !'];
const BADGE_COLORS = ['#43AA8B', '#E94B3C', '#0077B6', '#F47920', '#43AA8B', '#0077B6', '#E94B3C', '#F47920'];
const PRODUCT_FEATURES = [
  'Impression haute définition',
  'Livraison rapide DOM-COM',
  'Nombreux formats disponibles',
  'Qualité professionnelle garantie',
  'Fichier vérifié gratuitement',
  'Expédition aérienne express',
  'Plus de 10 finitions disponibles',
  'Service client dédié',
];

export default function Home() {
  const useCatalog = hasCatalog();
  const catalogProducts = useCatalog ? getCatalogProducts() : [];

  const topProducts = useCatalog
    ? catalogProducts.slice(0, 8).map((p, i) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        categoryLabel: p.categoryLabel,
        emoji: p.emoji,
        image: p.image,
        priceFrom: undefined as number | undefined,
        badge: PRODUCT_BADGES[i % PRODUCT_BADGES.length],
        badgeColor: BADGE_COLORS[i % BADGE_COLORS.length],
        feature: PRODUCT_FEATURES[i % PRODUCT_FEATURES.length],
      }))
    : getFeaturedProducts().slice(0, 8).map((p, i) => ({
        id: p.id, slug: p.slug, name: p.name, category: p.category,
        categoryLabel: p.categoryLabel, emoji: p.emoji, image: undefined as string | undefined, priceFrom: p.priceFrom,
        badge: PRODUCT_BADGES[i % PRODUCT_BADGES.length],
        badgeColor: BADGE_COLORS[i % BADGE_COLORS.length],
        feature: PRODUCT_FEATURES[i % PRODUCT_FEATURES.length],
      }));

  const moreProducts = useCatalog
    ? catalogProducts.slice(8, 16).map((p, i) => ({
        id: p.id, slug: p.slug, name: p.name, category: p.category,
        categoryLabel: p.categoryLabel, emoji: p.emoji, image: p.image, priceFrom: undefined as number | undefined,
        badge: PRODUCT_BADGES[(i + 8) % PRODUCT_BADGES.length],
        badgeColor: BADGE_COLORS[(i + 8) % BADGE_COLORS.length],
        feature: PRODUCT_FEATURES[(i + 8) % PRODUCT_FEATURES.length],
      }))
    : getPopularProducts().slice(0, 8).map((p, i) => ({
        id: p.id, slug: p.slug, name: p.name, category: p.category,
        categoryLabel: p.categoryLabel, emoji: p.emoji, image: undefined as string | undefined, priceFrom: p.priceFrom,
        badge: PRODUCT_BADGES[(i + 8) % PRODUCT_BADGES.length],
        badgeColor: BADGE_COLORS[(i + 8) % BADGE_COLORS.length],
        feature: PRODUCT_FEATURES[(i + 8) % PRODUCT_FEATURES.length],
      }));

  const allProducts = useCatalog ? catalogProducts : staticProducts;
  const categoryCount = (catId: string) => allProducts.filter((p) => p.category === catId).length;

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">

        {/* ── HERO BANNER ── */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A2332 0%, #0077B6 60%, #43AA8B 100%)', minHeight: 340 }}>
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
            {/* Left text */}
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-white/20">
                🌴 Imprimeur officiel pour les DOM-COM
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
                Impression professionnelle<br />
                <span style={{ color: '#F9C74F' }}>livrée aux Antilles</span>
              </h1>
              <p className="text-blue-100 text-base leading-relaxed mb-6 max-w-lg">
                Flyers, cartes de visite, affiches, banderoles — plus de 40 produits disponibles, expédiés par avion en Guadeloupe, Martinique, Guyane, La Réunion et plus.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/produits"
                  className="inline-flex items-center justify-center gap-2 text-white font-bold text-base px-8 py-3.5 rounded-lg shadow-lg transition-opacity hover:opacity-90"
                  style={{ background: '#43AA8B' }}
                >
                  Commander maintenant
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-base px-8 py-3.5 rounded-lg border border-white/25 transition-colors"
                >
                  Devis gratuit 24h
                </Link>
              </div>
            </div>
            {/* Right — price highlight */}
            <div className="hidden md:flex flex-col items-center gap-4">
              <div className="bg-white rounded-2xl p-6 text-center shadow-2xl min-w-[200px]">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Configurez en ligne</p>
                <p className="text-3xl font-black text-coral leading-none">Prix en direct</p>
                <p className="text-sm text-gray-500 mt-1">tarifs usine, sans intermédiaire</p>
                <Link
                  href="/produits/carte-de-visite"
                  className="mt-4 block w-full text-center text-white font-bold py-2.5 rounded-lg text-sm transition-opacity hover:opacity-90"
                  style={{ background: '#43AA8B' }}
                >
                  Commander →
                </Link>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-xs">
                <svg className="w-4 h-4 text-sun" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <svg className="w-4 h-4 text-sun" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <svg className="w-4 h-4 text-sun" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <svg className="w-4 h-4 text-sun" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <svg className="w-4 h-4 text-sun" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <span className="ml-1">4,8/5 clients satisfaits</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {TRUST_BADGES.map((b, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-3 px-4 py-2 first:pl-0 last:pr-0">
                  <div className="text-gray-400 flex-shrink-0">{b.icon}</div>
                  <div className="text-center sm:text-left">
                    <p className="font-bold text-sm text-gray-800">{b.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOP PRODUITS ── */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section title — Realisaprint style */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-xl md:text-2xl font-black text-gray-800 px-4 whitespace-nowrap">Top produits</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  className="group bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  {/* Product visual */}
                  <div className="relative">
                    <ProductVisual slug={product.slug} category={product.category} emoji={product.emoji} image={product.image} className="h-48 w-full" />
                    <span
                      className="absolute top-3 left-3 text-white text-[10px] font-black px-2.5 py-1 rounded"
                      style={{ background: product.badgeColor }}
                    >
                      {product.badge}
                    </span>
                  </div>
                  {/* Card content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-coral transition-colors">{product.name}</h3>
                    {product.priceFrom ? (
                      <p className="text-sm text-gray-600 mb-2">
                        dès <span className="font-black text-gray-900 text-lg">{product.priceFrom.toFixed(2).replace('.', ',')}€</span>{' '}
                        <span className="text-gray-400">l&apos;unité</span>
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-bold text-coral">Prix selon configuration</span>
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-auto">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#43AA8B' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs text-gray-500">{product.feature}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-coral transition-colors border border-gray-200 hover:border-coral px-6 py-2.5 rounded-lg"
              >
                Voir tous les produits →
              </Link>
            </div>
          </div>
        </section>

        {/* ── MORE PRODUCTS ── */}
        {moreProducts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gray-200" />
                <h2 className="text-xl md:text-2xl font-black text-gray-800 px-4 whitespace-nowrap">Nos bestsellers</h2>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {moreProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produits/${product.slug}`}
                    className="group bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                  >
                    <div className="relative">
                      <ProductVisual slug={product.slug} category={product.category} emoji={product.emoji} image={product.image} className="h-48 w-full" />
                      <span
                        className="absolute top-3 left-3 text-white text-[10px] font-black px-2.5 py-1 rounded"
                        style={{ background: product.badgeColor }}
                      >
                        {product.badge}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-coral transition-colors">{product.name}</h3>
                      {product.priceFrom ? (
                        <p className="text-sm text-gray-600 mb-2">
                          dès <span className="font-black text-gray-900 text-lg">{product.priceFrom.toFixed(2).replace('.', ',')}€</span>{' '}
                          <span className="text-gray-400">l&apos;unité</span>
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-coral mb-2">Prix selon configuration</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-auto">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#43AA8B' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-gray-500">{product.feature}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CATEGORIES ── */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-xl md:text-2xl font-black text-gray-800 px-4 whitespace-nowrap">Nos catégories</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => {
                const count = categoryCount(cat.id);
                return (
                  <Link
                    key={cat.id}
                    href={`/produits?categorie=${cat.id}`}
                    className="group flex flex-col items-center gap-2.5 rounded-xl p-4 border border-gray-100 hover:border-coral hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <span className="text-3xl">{cat.emoji}</span>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-800 group-hover:text-coral transition-colors">{cat.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{count} produits</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-12 bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-xl md:text-2xl font-black text-gray-800 px-4 whitespace-nowrap">Commander en 3 étapes</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { n: '1', icon: '🎨', title: 'Choisissez & configurez', text: 'Sélectionnez votre produit, format, quantité et finition.' },
                { n: '2', icon: '📤', title: 'Envoyez votre fichier', text: 'Déposez votre PDF. Vérification offerte sous 4h.' },
                { n: '3', icon: '✈️', title: 'Recevez sur votre île', text: 'Expédition aérienne, livraison directe dans vos DOM-COM.' },
              ].map((step) => (
                <div key={step.n} className="bg-white rounded-xl p-6 border border-gray-100 text-center" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center text-3xl border border-gray-100">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center" style={{ background: '#E94B3C' }}>
                      {step.n}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-lg transition-opacity hover:opacity-90 shadow-md"
                style={{ background: '#E94B3C' }}
              >
                Commencer ma commande →
              </Link>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <Testimonials />

        {/* ── FINAL CTA ── */}
        <section className="py-14 text-white text-center" style={{ background: 'linear-gradient(135deg, #1A2332 0%, #0077B6 100%)' }}>
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight">
              Votre prochaine impression,<br />livrée aux Antilles
            </h2>
            <p className="text-blue-200 mb-6 text-sm">Devis gratuit sous 24h. Qualité professionnelle garantie.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/produits"
                className="inline-flex items-center justify-center gap-2 text-white font-bold text-base px-8 py-3.5 rounded-lg shadow-lg transition-opacity hover:opacity-90"
                style={{ background: '#E94B3C' }}
              >
                Voir nos produits →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-base px-8 py-3.5 rounded-lg border border-white/20 transition-colors"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
