import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductConfigurator from '@/components/ProductConfigurator';
import ProductForm from '@/components/ProductForm';
import PricingTable from '@/components/PricingTable';
import TrustBadges from '@/components/TrustBadges';
import ProductVisual from '@/components/ProductVisual';
import { getProductBySlug, products as staticProducts } from '@/data/products';
import { getCatalogProducts, getCatalogProductBySlug, type CatalogProduct } from '@/lib/catalog';
import { getPrescriptIframeUrl } from '@/lib/realisaprint';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const catalogSlugs = getCatalogProducts().map((p) => ({ slug: p.slug }));
  const catalogSlugSet = new Set(catalogSlugs.map((s) => s.slug));
  const staticSlugs = staticProducts
    .filter((p) => !catalogSlugSet.has(p.slug))
    .map((p) => ({ slug: p.slug }));
  return [...catalogSlugs, ...staticSlugs];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const catalog = getCatalogProductBySlug(slug);
  if (catalog) {
    return {
      title: `${catalog.name} — Livraison Antilles & Réunion — KaribPrint`,
      description: `Configurez et commandez vos ${catalog.name.toLowerCase()} en ligne. Livraison par avion en Guadeloupe, Martinique, Guyane, La Réunion, Saint-Martin et Saint-Barthélemy.`,
    };
  }
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Livraison Antilles & Réunion — KaribPrint`,
    description: `${product.description}. À partir de ${product.priceFrom.toFixed(2).replace('.', ',')}€. Livraison en Guadeloupe, Martinique, Guyane, La Réunion, Saint-Martin et Saint-Barthélemy.`,
  };
}

const INCLUDED = [
  { icon: '🔍', text: 'Vérification du fichier sous 4h' },
  { icon: '🖨️', text: 'Impression quadrichromie haute résolution' },
  { icon: '📦', text: 'Emballage protecteur pour le transport aérien' },
  { icon: '📧', text: 'Suivi de commande par email' },
  { icon: '🔄', text: 'Garantie qualité — réimpression si nécessaire' },
];

function Breadcrumb({ categorySlug, categoryLabel, productName }: { categorySlug: string; categoryLabel: string; productName: string }) {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-coral transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/produits" className="hover:text-coral transition-colors">Produits</Link>
          <span>/</span>
          <Link href={`/produits?categorie=${categorySlug}`} className="hover:text-coral transition-colors">{categoryLabel}</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">{productName}</span>
        </nav>
      </div>
    </div>
  );
}

function CatalogProductPage({ product }: { product: CatalogProduct }) {
  let prescriptUrl: string | null = null;
  const configId = product.configurations[0]?.id;
  if (configId) {
    try {
      prescriptUrl = getPrescriptIframeUrl(product.id, configId);
    } catch {
      // credentials not set in this environment
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <Breadcrumb categorySlug={product.category} categoryLabel={product.categoryLabel} productName={product.name} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Product header */}
          <div className="mb-6">
            <span className="inline-block text-xs font-bold text-coral uppercase tracking-widest mb-2">
              {product.categoryLabel}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">{product.name}</h1>
          </div>

          {/* Main 2-col grid */}
          <div className="grid lg:grid-cols-[1fr_480px] gap-8 items-start">

            {/* ── LEFT: Image + meta ── */}
            <div className="space-y-4">
              {/* Product image */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <ProductVisual
                  slug={product.slug}
                  category={product.category}
                  emoji={product.emoji}
                  image={product.image}
                  className="h-[400px] md:h-[500px] w-full"
                />
              </div>

              {/* Delivery + stock badges */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-palm/8 border border-palm/20 rounded-xl px-4 py-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-palm flex-shrink-0 animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-palm">En stock</p>
                    <p className="text-xs text-gray-500">Impression sous 48h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-ocean/5 border border-ocean/15 rounded-xl px-4 py-3">
                  <span className="text-xl flex-shrink-0">✈️</span>
                  <div>
                    <p className="text-xs font-bold text-ocean">Livraison DOM-COM</p>
                    <p className="text-xs text-gray-500">5–10 jours après impression</p>
                  </div>
                </div>
              </div>

              {/* Territories */}
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 font-semibold mb-1.5">Zones livrées</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Saint-Martin', 'Saint-Barthélemy'].map((t) => (
                    <span key={t} className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1 text-gray-600 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Inclus */}
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Inclus dans votre commande</p>
                <ul className="space-y-2.5">
                  {INCLUDED.map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-base w-5 flex-shrink-0">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* File guide */}
              <Link
                href="/guide-fichiers"
                className="flex items-center gap-4 bg-ocean/5 border border-ocean/20 rounded-xl px-4 py-3.5 hover:bg-ocean/10 transition-colors group"
              >
                <span className="text-2xl flex-shrink-0">📋</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ocean">Préparez votre fichier</p>
                  <p className="text-xs text-gray-500 mt-0.5">PDF 300 dpi, mode CMJN, fonds perdus 3mm</p>
                </div>
                <svg className="w-4 h-4 text-ocean flex-shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* ── RIGHT: Configurator ── */}
            <div className="lg:sticky lg:top-4 space-y-4">
              {prescriptUrl ? (
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  {/* Section label */}
                  <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Configurez vos options</p>
                    <span className="text-xs text-palm font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-palm" />
                      Prix en direct
                    </span>
                  </div>
                  {/* Iframe */}
                  <div className="bg-white">
                    <ProductConfigurator
                      prescriptIframeUrl={prescriptUrl}
                      defaultQuantity={250}
                      productName={product.name}
                    />
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-2xl p-8 text-center space-y-4">
                  <span className="text-5xl block">{product.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-800">Configurateur disponible sur devis</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Contactez-nous pour configurer vos {product.name.toLowerCase()} et recevoir un devis personnalisé.
                    </p>
                  </div>
                  <Link
                    href={`/contact?produit=${encodeURIComponent(product.name)}`}
                    className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold text-base py-4 rounded-xl transition-colors shadow-md"
                  >
                    Demander un devis gratuit →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-14 border-t border-gray-100 pt-10">
            <h2 className="text-lg font-bold text-center mb-6">Nos engagements</h2>
            <TrustBadges />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const catalogProduct = getCatalogProductBySlug(slug);
  if (catalogProduct) return <CatalogProductPage product={catalogProduct} />;

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = staticProducts
    .filter((p) => p.category === product.category && p.slug !== slug)
    .slice(0, 3);

  let prescriptUrl: string | null = null;
  if (product.realisaprintProductId && product.realisaprintStock) {
    try {
      prescriptUrl = getPrescriptIframeUrl(product.realisaprintProductId, product.realisaprintStock);
    } catch {
      // credentials not set in this environment
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <Breadcrumb categorySlug={product.category} categoryLabel={product.categoryLabel} productName={product.name} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Product header */}
          <div className="mb-6">
            <span className="inline-block text-xs font-bold text-coral uppercase tracking-widest mb-2">
              {product.categoryLabel}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">{product.name}</h1>
            <p className="text-gray-500 mt-2 text-sm max-w-2xl">{product.description}</p>
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-[1fr_480px] gap-8 items-start">

            {/* ── LEFT ── */}
            <div className="space-y-4">
              {/* Product image */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <ProductVisual
                  slug={product.slug}
                  category={product.category}
                  emoji={product.emoji}
                  className="h-[400px] md:h-[500px] w-full"
                />
              </div>

              {/* Delivery + stock */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-palm/8 border border-palm/20 rounded-xl px-4 py-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-palm flex-shrink-0 animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-palm">En stock</p>
                    <p className="text-xs text-gray-500">Impression sous 48h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-ocean/5 border border-ocean/15 rounded-xl px-4 py-3">
                  <span className="text-xl flex-shrink-0">✈️</span>
                  <div>
                    <p className="text-xs font-bold text-ocean">Livraison aérienne</p>
                    <p className="text-xs text-gray-500">{product.deliveryDays}</p>
                  </div>
                </div>
              </div>

              {/* Territories */}
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 font-semibold mb-1.5">Zones livrées</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Saint-Martin', 'Saint-Barthélemy'].map((t) => (
                    <span key={t} className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1 text-gray-600 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Formats', value: product.formats.map((f) => f.label).join(', ') },
                  { label: 'Supports', value: product.paperTypes.join(', ') },
                  { label: 'Finitions', value: product.finishes.join(', ') },
                  { label: 'Délai livraison', value: product.deliveryDays },
                ].map((spec) => (
                  <div key={spec.label} className="bg-white border border-gray-100 rounded-xl p-3.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{spec.label}</p>
                    <p className="text-sm font-medium text-gray-700 line-clamp-2">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Inclus */}
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Inclus dans votre commande</p>
                <ul className="space-y-2.5">
                  {INCLUDED.map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-base w-5 flex-shrink-0">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* File guide */}
              <Link
                href="/guide-fichiers"
                className="flex items-center gap-4 bg-ocean/5 border border-ocean/20 rounded-xl px-4 py-3.5 hover:bg-ocean/10 transition-colors group"
              >
                <span className="text-2xl flex-shrink-0">📋</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-ocean">Préparez votre fichier</p>
                  <p className="text-xs text-gray-500 mt-0.5">PDF 300 dpi, mode CMJN, fonds perdus 3mm</p>
                </div>
                <svg className="w-4 h-4 text-ocean flex-shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* ── RIGHT: Configurator / Form ── */}
            <div className="lg:sticky lg:top-4 space-y-4">
              {/* Price from */}
              <div className="border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">À partir de</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tight">
                    {product.priceFrom.toFixed(2).replace('.', ',')} <span className="text-xl">€</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">TTC · hors frais de livraison</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Dégressif</p>
                  <p className="text-sm font-bold text-palm">↓ plus c&apos;est rentable</p>
                </div>
              </div>

              {prescriptUrl ? (
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Configurez vos options</p>
                    <span className="text-xs text-palm font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-palm" />
                      Prix en direct
                    </span>
                  </div>
                  <ProductConfigurator
                    prescriptIframeUrl={prescriptUrl}
                    defaultQuantity={product.quantities[1] ?? product.quantities[0]}
                    productName={product.name}
                  />
                </div>
              ) : (
                <ProductForm
                  pricingTiers={product.pricingTiers}
                  formats={product.formats}
                  paperTypes={product.paperTypes}
                  finishes={product.finishes}
                  productName={product.name}
                  productId={product.id}
                  productSlug={product.slug}
                  productEmoji={product.emoji}
                />
              )}
            </div>
          </div>

          {/* Pricing table */}
          <div className="mt-14 border-t border-gray-100 pt-10">
            <PricingTable tiers={product.pricingTiers} productName={product.name} />
          </div>

          {/* Trust badges */}
          <div className="mt-10 border-t border-gray-100 pt-10">
            <h2 className="text-lg font-bold text-center mb-6">Nos engagements</h2>
            <TrustBadges />
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-10 border-t border-gray-100 pt-10">
              <h2 className="text-xl font-bold mb-6">Vous pourriez aussi aimer</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produits/${p.slug}`}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-coral/20 transition-all hover:-translate-y-1"
                  >
                    <ProductVisual slug={p.slug} category={p.category} className="h-32" />
                    <div className="p-4">
                      <h3 className="font-bold text-sm group-hover:text-coral transition-colors">{p.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                      <p className="text-coral font-bold text-sm mt-2">
                        À partir de {p.priceFrom.toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
