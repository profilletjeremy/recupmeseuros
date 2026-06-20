import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import ProductVisual from '@/components/ProductVisual';
import { getFeaturedProducts, getPopularProducts, categories, products as staticProducts } from '@/data/products';
import { getCatalogProducts, hasCatalog } from '@/lib/catalog';

const BENEFITS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    title: 'Livraison aérienne express',
    text: 'Expédié par avion vers les 6 territoires DOM-COM en 5 à 10 jours ouvrés.',
    color: '#0077B6',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Qualité professionnelle',
    text: 'Impression quadrichromie haute résolution, vérification du fichier offerte sous 4h.',
    color: '#43AA8B',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Devis gratuit sous 24h',
    text: 'Configurez votre produit en ligne et recevez votre devis personnalisé rapidement.',
    color: '#E94B3C',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Garantie satisfaction',
    text: 'Un problème avec votre commande ? Nous la réimprimons gratuitement.',
    color: '#D4A017',
  },
];

const CATEGORY_IMAGES: Record<string, string> = {
  communication: '#0077B6',
  affichage: '#E94B3C',
  evenementiel: '#43AA8B',
  papeterie: '#D4A017',
  packaging: '#7B5EA7',
  goodies: '#E8740C',
};

export default function Home() {
  const useCatalog = hasCatalog();
  const catalogProducts = useCatalog ? getCatalogProducts() : [];

  const displayProducts = useCatalog
    ? catalogProducts.slice(0, 8).map((p) => ({
        id: p.id, slug: p.slug, name: p.name, category: p.category,
        categoryLabel: p.categoryLabel, emoji: p.emoji,
        description: `Impression ${p.name.toLowerCase()} de qualité professionnelle.`,
        priceFrom: undefined as number | undefined,
        popular: false, featured: false,
      }))
    : getFeaturedProducts();

  const heroProducts = useCatalog ? displayProducts.slice(0, 4) : getFeaturedProducts().slice(0, 4);
  const popularProducts = useCatalog ? [] : getPopularProducts();
  const allProducts = useCatalog ? catalogProducts : staticProducts;

  const categoryCount = (catId: string) => allProducts.filter((p) => p.category === catId).length;

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* ─── HERO ──────────────────────────────────────────────────── */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-14 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-ocean/8 text-ocean text-xs font-bold px-4 py-2 rounded-full mb-6 border border-ocean/20">
                <span className="w-2 h-2 rounded-full bg-palm animate-pulse inline-block" />
                Imprimerie spécialisée DOM-COM
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-5 text-gray-900">
                Donnez vie à<br />
                <span className="text-ocean">vos idées</span>{' '}
                <span className="text-coral">aux Antilles</span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
                Cartes de visite, flyers, affiches, banderoles — impression professionnelle livrée par avion en Guadeloupe, Martinique, Guyane, La Réunion, Saint-Martin et Saint-Barthélemy.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/produits"
                  className="inline-flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-coral/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Voir nos produits
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold text-base px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-ocean hover:text-ocean transition-all"
                >
                  Devis gratuit 24h
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><span className="text-palm font-bold">✓</span> 500+ clients satisfaits</span>
                <span className="flex items-center gap-1.5"><span className="text-palm font-bold">✓</span> Note 5/5</span>
                <span className="flex items-center gap-1.5"><span className="text-palm font-bold">✓</span> 6 îles desservies</span>
              </div>
            </div>

            {/* Right — product mosaic */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {heroProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/produits/${p.slug}`}
                  className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-ocean/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <ProductVisual slug={p.slug} category={p.category} emoji={'emoji' in p ? (p as {emoji?: string}).emoji : undefined} className="h-36" />
                  <div className="p-3 bg-white">
                    <p className="font-bold text-sm text-gray-800 group-hover:text-ocean transition-colors truncate">{p.name}</p>
                    {p.priceFrom ? (
                      <p className="text-xs text-gray-400 mt-0.5">À partir de <span className="text-ocean font-bold">{p.priceFrom.toFixed(2).replace('.', ',')} €</span></p>
                    ) : (
                      <p className="text-xs text-ocean font-semibold mt-0.5">Configurer →</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BENEFITS BAR ──────────────────────────────────────────── */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-3 py-2">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${b.color}15`, color: b.color }}>
                    {b.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 leading-tight">{b.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed hidden md:block">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CATEGORIES ────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-10">
              <p className="text-xs font-bold text-coral uppercase tracking-widest mb-2">Parcourir par catégorie</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Tout pour votre communication</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => {
                const count = categoryCount(cat.id);
                const color = CATEGORY_IMAGES[cat.id] ?? '#0077B6';
                return (
                  <Link
                    key={cat.id}
                    href={`/produits?categorie=${cat.id}`}
                    className="group flex flex-col items-center gap-3 rounded-2xl p-5 bg-white border-2 border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `${color}12` }}
                    >
                      {cat.emoji}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-800 group-hover:text-ocean transition-colors">{cat.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{count} produits</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── BESTSELLERS ───────────────────────────────────────────── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold text-coral uppercase tracking-widest mb-2">Best-sellers</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">Les plus commandés</h2>
                <p className="text-gray-500 mt-1 text-sm">Par les professionnels des Antilles et de La Réunion</p>
              </div>
              <Link href="/produits" className="hidden sm:flex items-center gap-1.5 text-ocean font-bold text-sm hover:underline">
                Tout voir →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-ocean/20 transition-all duration-300 hover:-translate-y-1 flex flex-col group">
                  <Link href={`/produits/${product.slug}`}>
                    <ProductVisual slug={product.slug} category={product.category} emoji={'emoji' in product ? (product as {emoji?: string}).emoji : undefined} className="h-48 relative">
                      {product.popular && (
                        <div className="absolute top-3 left-3 bg-coral text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                          Best-seller
                        </div>
                      )}
                    </ProductVisual>
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.categoryLabel}</p>
                    <Link href={`/produits/${product.slug}`}>
                      <h3 className="font-bold text-gray-900 mt-1 mb-1 group-hover:text-ocean transition-colors text-sm leading-snug">{product.name}</h3>
                    </Link>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      {product.priceFrom ? (
                        <div>
                          <p className="text-[10px] text-gray-400">À partir de</p>
                          <p className="font-black text-ocean text-xl leading-tight">{product.priceFrom.toFixed(2).replace('.', ',')} €</p>
                        </div>
                      ) : (
                        <p className="text-xs font-semibold text-ocean">Prix selon configuration</p>
                      )}
                      <span className="text-[10px] text-palm font-bold bg-green-50 border border-green-100 px-2 py-1 rounded-lg">✈️ DOM-COM</span>
                    </div>
                    <Link
                      href={`/produits/${product.slug}`}
                      className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold text-sm py-2.5 rounded-xl transition-colors"
                    >
                      {product.priceFrom ? 'Commander →' : 'Configurer →'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Other products strip — static only */}
            {!useCatalog && popularProducts.filter((p) => !p.featured).length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {popularProducts.filter((p) => !p.featured).map((product) => (
                  <Link
                    key={product.id}
                    href={`/produits/${product.slug}`}
                    className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100 hover:border-ocean/30 hover:shadow-md transition-all text-sm"
                  >
                    <span className="text-xl">{product.emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-800 leading-tight text-xs">{product.name}</p>
                      <p className="text-xs text-ocean font-bold">À partir de {product.priceFrom.toFixed(2).replace('.', ',')} €</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── PROMO BANNER ──────────────────────────────────────────── */}
        <section className="py-14 bg-ocean text-white">
          <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-ocean-light text-sm font-bold uppercase tracking-widest mb-3">Pourquoi KaribPrint ?</p>
              <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4">
                Le seul imprimeur spécialisé dans la livraison outre-mer
              </h2>
              <p className="text-blue-200 leading-relaxed text-sm">
                Contrairement aux imprimeurs continentaux, nous maîtrisons toute la chaîne logistique aérienne DOM-COM. Emballage renforcé, dédouanement simplifié, livraison express.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: '✈️', text: 'Expédition aérienne dédiée DOM-COM', sub: 'Guadeloupe, Martinique, Guyane, La Réunion, Saint-Martin, Saint-Barthélemy' },
                { icon: '📦', text: 'Emballage renforcé anti-choc & tropical', sub: 'Protège vos impressions des conditions climatiques' },
                { icon: '⚡', text: 'Impression en 48h ouvrées', sub: 'Vérification de fichier offerte sous 4h' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{item.text}</p>
                    <p className="text-xs text-blue-200 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
              <Link
                href="/contact"
                className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg"
              >
                Demander un devis gratuit →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ──────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-palm uppercase tracking-widest mb-2">Simple comme bonjour</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">Commander en 3 étapes</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { n: '1', icon: '🎨', title: 'Choisissez & configurez', text: 'Sélectionnez votre produit, format, quantité et finition. Obtenez le prix instantanément.' },
                { n: '2', icon: '📤', title: 'Envoyez votre fichier', text: 'Déposez votre PDF prêt à imprimer. Notre équipe vérifie votre fichier sous 4h gratuitement.' },
                { n: '3', icon: '✈️', title: 'Recevez sur votre île', text: 'Impression en 48h, expédition aérienne, livraison directe à votre adresse aux Antilles.' },
              ].map((step) => (
                <div key={step.n} className="text-center">
                  <div className="relative inline-block mb-5">
                    <div className="w-20 h-20 rounded-2xl bg-ocean/8 flex items-center justify-center text-4xl">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-coral text-white text-xs font-black flex items-center justify-center shadow-md">
                      {step.n}
                    </span>
                  </div>
                  <h3 className="font-black text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-ocean/25"
              >
                Commencer ma commande →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ──────────────────────────────────────────── */}
        <Testimonials />

        {/* ─── FINAL CTA ─────────────────────────────────────────────── */}
        <section
          className="py-20 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #1A2332 0%, #0077B6 100%)' }}
        >
          <div className="max-w-2xl mx-auto px-4">
            <p className="text-blue-300 text-sm font-bold uppercase tracking-widest mb-4">Prêt à commencer ?</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Votre prochaine impression,<br />livrée aux Antilles
            </h2>
            <p className="text-blue-200 mb-8 text-base">
              Devis gratuit sous 24h. Sans engagement. Qualité professionnelle garantie.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/produits"
                className="inline-flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-white font-bold text-base px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all"
              >
                Voir nos produits →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-base px-8 py-4 rounded-xl border border-white/20 transition-all"
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
