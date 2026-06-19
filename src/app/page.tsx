import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import TrustBadges from '@/components/TrustBadges';
import ProductVisual from '@/components/ProductVisual';
import { getFeaturedProducts, getPopularProducts, categories } from '@/data/products';
import { territories } from '@/data/territories';

const STATS = [
  { value: '500+', label: 'Clients satisfaits', icon: '⭐' },
  { value: '48h', label: "Impression express", icon: '⚡' },
  { value: '5.0', label: 'Note moyenne', icon: '🏆' },
  { value: '6', label: 'Îles desservies', icon: '🌊' },
];

const COMPARISON = [
  { feature: 'Expédition aérienne DOM-COM', us: true, them: false },
  { feature: 'Spécialiste outre-mer', us: true, them: false },
  { feature: 'Emballage renforcé tropical', us: true, them: false },
  { feature: 'Devis sous 24h', us: true, them: '2-5 jours' },
  { feature: 'Qualité pro garantie', us: true, them: true },
  { feature: 'Prix compétitifs', us: true, them: true },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Choisissez votre produit',
    text: '12 supports d\'impression — cartes, flyers, affiches, banderoles, roll-ups et plus.',
  },
  {
    step: '02',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Envoyez votre fichier',
    text: 'Déposez votre PDF et configurez format, quantité, finition. Devis gratuit sous 24h.',
  },
  {
    step: '03',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: 'Recevez chez vous',
    text: 'Impression 48h, expédition aérienne vers votre île. Suivi en temps réel.',
  },
];

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const popularProducts = getPopularProducts();

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* Promo strip */}
        <div className="bg-palm text-white text-xs sm:text-sm py-2 text-center font-semibold tracking-wide">
          🎉 &nbsp;Devis gratuit sous 24h — Livraison express dans les 6 territoires d&apos;outre-mer &nbsp;•&nbsp; Qualité garantie ou réimpression offerte
        </div>

        {/* ─── HERO ──────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden text-white"
          style={{ background: 'linear-gradient(135deg, #003F5C 0%, #005F8E 40%, #0077B6 100%)' }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: '#F9C74F' }} />
            <div className="absolute top-1/2 -left-16 w-64 h-64 rounded-full opacity-8" style={{ background: '#43AA8B' }} />
            <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full opacity-10" style={{ background: '#E94B3C' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div>
              <span className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/20">
                <span className="w-2 h-2 rounded-full bg-palm animate-pulse inline-block" />
                Imprimerie spécialisée DOM-COM
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-6">
                Imprimez.
                <br />
                Livrez.
                <br />
                <span style={{ color: '#F9C74F' }}>Aux Antilles.</span>
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
                Cartes de visite, flyers, affiches, banderoles — impression professionnelle
                expédiée par avion en Guadeloupe, Martinique, Guyane, La Réunion, Saint-Martin et Saint-Barthélemy.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/produits"
                  className="inline-flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-white font-bold text-base px-7 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
                >
                  Voir nos produits →
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-base px-7 py-4 rounded-xl backdrop-blur-sm border border-white/20 transition-all"
                >
                  Devis gratuit 24h
                </Link>
              </div>

              {/* Social proof chips */}
              <div className="flex flex-wrap gap-3">
                {[
                  '✅ 500+ clients satisfaits',
                  '⭐ Note 5/5',
                  '🚚 Livraison aérienne',
                ].map((chip) => (
                  <span key={chip} className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-full text-blue-100 border border-white/15">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — product showcase */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {featuredProducts.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/produits/${p.slug}`}
                  className="group rounded-2xl overflow-hidden border border-white/15 backdrop-blur-sm hover:border-white/40 transition-all hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.07)', animationDelay: `${i * 80}ms` }}
                >
                  <ProductVisual slug={p.slug} category={p.category} className="h-28" />
                  <div className="p-3">
                    <p className="font-bold text-sm text-white group-hover:text-sun transition-colors">{p.name}</p>
                    <p className="text-blue-200 text-xs mt-0.5">À partir de {p.priceFrom.toFixed(2).replace('.', ',')} €</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STATS BAR ─────────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-4 py-3 md:py-0 px-4 first:pl-0 last:pr-0">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <p className="text-2xl font-bold text-ocean">{s.value}</p>
                    <p className="text-xs text-text-light font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TRUST BADGES ──────────────────────────────────────────── */}
        <section className="bg-sand border-b border-sand-dark">
          <div className="max-w-6xl mx-auto px-4">
            <TrustBadges variant="horizontal" />
          </div>
        </section>

        {/* ─── CATEGORIES ────────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-coral uppercase tracking-widest mb-3 block">Notre catalogue</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Tout ce qu&apos;il vous faut</h2>
              <p className="text-text-light max-w-md mx-auto">Des supports d&apos;impression professionnels pour tous vos besoins marketing, livrés sur votre île.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produits?categorie=${cat.id}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl p-5 border-2 border-transparent hover:border-ocean/20 bg-sand hover:bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
                  <span className="text-xs font-bold text-center text-text group-hover:text-ocean transition-colors">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ──────────────────────────────────────────── */}
        <section className="py-16 bg-sand">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-palm uppercase tracking-widest mb-3 block">Simple & rapide</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Commander en 3 étapes</h2>
              <p className="text-text-light max-w-md mx-auto">Livrés directement sur votre île, sans intermédiaire.</p>
            </div>
            <div className="relative grid md:grid-cols-3 gap-8">
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-ocean/30 via-ocean to-ocean/30" style={{ top: 40, left: '18%', right: '18%' }} />
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.step} className="relative">
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-5">
                      <div className="w-20 h-20 rounded-2xl bg-ocean text-white flex items-center justify-center shadow-lg shadow-ocean/30">
                        {step.icon}
                      </div>
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-base mb-2">{step.title}</h3>
                    <p className="text-text-light text-sm leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-ocean text-white font-bold px-8 py-4 rounded-xl hover:bg-ocean-dark transition-colors shadow-lg shadow-ocean/25 hover:shadow-xl"
              >
                Commencer ma commande →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FEATURED PRODUCTS ─────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold text-coral uppercase tracking-widest mb-2 block">Nos best-sellers</span>
                <h2 className="text-2xl md:text-3xl font-bold">Produits phares</h2>
                <p className="text-text-light mt-1">Les plus commandés par nos clients des Antilles et de La Réunion</p>
              </div>
              <Link href="/produits" className="hidden sm:inline-flex items-center gap-1 text-ocean font-bold text-sm hover:underline">
                Voir tout →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-ocean/20 transition-all duration-300 hover:-translate-y-1.5"
                >
                  <ProductVisual slug={product.slug} category={product.category} className="h-44 relative">
                    {product.popular && (
                      <div className="absolute top-3 right-3 bg-coral text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        ⭐ Populaire
                      </div>
                    )}
                  </ProductVisual>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-coral uppercase tracking-wider">{product.categoryLabel}</span>
                    <h3 className="font-bold mt-1 mb-1.5 group-hover:text-ocean transition-colors">{product.name}</h3>
                    <p className="text-xs text-text-light line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-text-lighter">À partir de</p>
                        <p className="font-bold text-ocean text-lg leading-tight">{product.priceFrom.toFixed(2).replace('.', ',')} €</p>
                      </div>
                      <span className="text-[10px] text-palm font-bold bg-green-50 border border-green-100 px-2 py-1 rounded-lg">✓ DOM-COM</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Popular strip */}
            {popularProducts.filter((p) => !p.featured).length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {popularProducts.filter((p) => !p.featured).map((product) => (
                  <Link
                    key={product.id}
                    href={`/produits/${product.slug}`}
                    className="flex items-center gap-2.5 bg-sand rounded-xl px-4 py-2.5 border border-sand-dark hover:border-ocean/30 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <span className="text-xl">{product.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm leading-tight">{product.name}</p>
                      <p className="text-xs text-ocean font-medium">À partir de {product.priceFrom.toFixed(2).replace('.', ',')} €</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── COMPARISON ────────────────────────────────────────────── */}
        <section className="py-16 bg-sand">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-ocean uppercase tracking-widest mb-2 block">Pourquoi nous choisir</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">KaribPrint vs. imprimeur continental</h2>
              <p className="text-text-light max-w-lg mx-auto">
                Commander à un imprimeur basé en métropole peut sembler pratique. Voici pourquoi KaribPrint est le meilleur choix pour les professionnels des DOM-COM.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="grid grid-cols-3 text-sm font-bold">
                <div className="p-4 text-text-lighter bg-gray-50 border-r border-gray-100">Critère</div>
                <div className="p-4 text-center text-white bg-ocean flex items-center justify-center gap-2">
                  🌊 KaribPrint
                </div>
                <div className="p-4 text-center text-text-lighter bg-gray-50 border-l border-gray-100">
                  Imprimeur continental
                </div>
              </div>

              {/* Rows */}
              {COMPARISON.map((row, i) => (
                <div key={row.feature} className={`grid grid-cols-3 border-t border-gray-100 text-sm ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <div className="p-4 text-text font-medium border-r border-gray-100">{row.feature}</div>
                  <div className="p-4 flex items-center justify-center">
                    {row.us === true ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-palm/15 text-palm text-base font-bold">✓</span>
                    ) : (
                      <span className="text-text-light text-xs">{row.us}</span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-center border-l border-gray-100">
                    {row.them === false ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-coral/10 text-coral text-base font-bold">✗</span>
                    ) : row.them === true ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-400 text-base font-bold">✓</span>
                    ) : (
                      <span className="text-text-lighter text-xs">{row.them}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* CTA row */}
              <div className="grid grid-cols-3 border-t border-gray-100 bg-ocean/5">
                <div className="p-4" />
                <div className="p-4 flex items-center justify-center">
                  <Link href="/contact" className="bg-coral text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-coral-dark transition-colors shadow-md">
                    Choisir KaribPrint →
                  </Link>
                </div>
                <div className="p-4" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ──────────────────────────────────────────── */}
        <Testimonials />

        {/* ─── TERRITORIES ───────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-coral uppercase tracking-widest mb-2 block">6 destinations</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Nous livrons dans tout l&apos;outre-mer</h2>
              <p className="text-text-light max-w-lg mx-auto">
                KaribPrint expédie par avion vers chaque territoire francophone d&apos;outre-mer.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {territories.map((t) => (
                <Link
                  key={t.code}
                  href={`/ile/${t.slug}`}
                  className="group flex gap-4 items-start bg-sand rounded-2xl p-5 border-2 border-transparent hover:border-ocean/20 hover:bg-white hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-ocean text-white font-bold flex items-center justify-center text-sm flex-shrink-0 group-hover:bg-ocean-dark transition-colors">
                    {t.dept}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold group-hover:text-ocean transition-colors">{t.name}</h3>
                    <p className="text-xs text-palm font-semibold mt-0.5">🚚 {t.deliveryDays}</p>
                    <p className="text-xs text-text-lighter mt-1 truncate">{t.cities.slice(0, 3).join(' · ')}</p>
                  </div>
                  <span className="text-ocean opacity-0 group-hover:opacity-100 transition-opacity self-center flex-shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─────────────────────────────────────────────── */}
        <section className="py-20 text-white text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E94B3C 0%, #C43A2D 50%, #A52D22 100%)' }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background: '#F9C74F' }} />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-10" style={{ background: 'white' }} />
          <div className="relative max-w-2xl mx-auto px-4">
            <span className="inline-block text-4xl mb-4">🚀</span>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              Prêt à booster votre<br />communication ?
            </h2>
            <p className="text-red-100 mb-8 text-lg">
              Devis gratuit sous 24h. Qualité professionnelle. Livré sur votre île.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-coral font-bold text-lg px-10 py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-0.5 hover:bg-sand"
            >
              Demander un devis gratuit →
            </Link>
            <div className="flex items-center justify-center gap-6 mt-6 text-red-200 text-sm">
              <span>✓ Sans engagement</span>
              <span>✓ Réponse 24h</span>
              <span>✓ Qualité garantie</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
