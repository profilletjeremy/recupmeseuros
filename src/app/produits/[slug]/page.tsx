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
  'Vérification du fichier sous 4h',
  'Impression quadrichromie haute résolution',
  'Emballage protecteur pour le transport aérien',
  'Suivi de commande par email',
  'Garantie qualité — réimpression si nécessaire',
];

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
        {/* Breadcrumb */}
        <div className="bg-sand border-b border-sand-dark py-3">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="text-sm text-text-light">
              <Link href="/" className="hover:text-ocean">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/produits" className="hover:text-ocean">Produits</Link>
              <span className="mx-2">/</span>
              <Link href={`/produits?categorie=${product.category}`} className="hover:text-ocean">
                {product.categoryLabel}
              </Link>
              <span className="mx-2">/</span>
              <span>{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: visual + badges */}
            <div className="space-y-4">
              <ProductVisual slug={product.slug} category={product.category} emoji={product.emoji} image={product.image} className="rounded-3xl h-80 shadow-inner" />

              <div className="flex items-center gap-3 bg-palm/10 border border-palm/20 rounded-xl px-4 py-3">
                <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-palm animate-pulse" />
                <p className="text-sm font-semibold text-palm">
                  Stock disponible — impression sous 48h
                </p>
              </div>

              <div className="bg-ocean/5 border border-ocean/15 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">✈️</span>
                <div>
                  <p className="font-semibold text-ocean text-sm">Livraison aérienne DOM-COM</p>
                  <p className="text-text-light text-xs mt-0.5">Guadeloupe • Martinique • Guyane • La Réunion • Saint-Martin • Saint-Barthélemy</p>
                  <p className="text-xs font-medium text-palm mt-1">🕐 5 à 10 jours ouvrés après impression</p>
                </div>
              </div>

              <div className="bg-sand rounded-2xl p-5">
                <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
                  <span className="text-palm">✓</span> Inclus dans votre commande
                </h3>
                <ul className="space-y-2">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text-light">
                      <span className="text-palm mt-0.5 flex-shrink-0 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Configuration selector if multiple configs */}
              {product.configurations.length > 1 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Configurations disponibles</p>
                  <div className="flex flex-wrap gap-2">
                    {product.configurations.slice(0, 8).map((c) => (
                      <span key={c.id} className="text-xs bg-ocean/8 text-ocean px-2.5 py-1 rounded-lg font-medium border border-ocean/20">
                        {c.name || c.id}
                      </span>
                    ))}
                    {product.configurations.length > 8 && (
                      <span className="text-xs text-gray-400 px-2.5 py-1">+{product.configurations.length - 8} autres</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: info + configurator */}
            <div>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                {product.categoryLabel}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{product.name}</h1>
              <p className="text-text-light leading-relaxed mb-6">
                Configurez vos {product.name.toLowerCase()} directement en ligne. Choisissez vos options, validez votre visuel et demandez votre devis. Livraison par avion dans toute les DOM-COM.
              </p>

              {prescriptUrl ? (
                <ProductConfigurator
                  prescriptIframeUrl={prescriptUrl}
                  defaultQuantity={250}
                  productName={product.name}
                />
              ) : (
                <div className="bg-sand rounded-2xl p-6 text-center space-y-4">
                  <p className="text-2xl">{product.emoji}</p>
                  <p className="font-semibold text-gray-700">Configurateur disponible sur devis</p>
                  <p className="text-sm text-text-light">
                    Contactez-nous pour configurer vos {product.name.toLowerCase()} et recevoir un devis personnalisé.
                  </p>
                  <Link
                    href={`/contact?produit=${encodeURIComponent(product.name)}`}
                    className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold text-base py-4 rounded-xl transition-colors shadow-lg"
                  >
                    Demander un devis gratuit →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-16 border-t border-gray-100 pt-10">
            <h2 className="text-xl font-bold mb-6 text-center">Nos engagements</h2>
            <TrustBadges />
          </div>

          {/* File guide CTA */}
          <div className="mt-8 bg-ocean/5 border border-ocean/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-3xl">📋</span>
            <div className="flex-1">
              <p className="font-bold text-sm">Comment préparer votre fichier ?</p>
              <p className="text-sm text-text-light mt-0.5">
                Format PDF, résolution 300 dpi, mode CMJN, fonds perdus 3mm.
              </p>
            </div>
            <Link
              href="/guide-fichiers"
              className="flex-shrink-0 bg-ocean text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-ocean-dark transition-colors"
            >
              Guide complet →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  // Catalog product takes priority over static
  const catalogProduct = getCatalogProductBySlug(slug);
  if (catalogProduct) return <CatalogProductPage product={catalogProduct} />;

  // Fall back to static product
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
        <div className="bg-sand border-b border-sand-dark py-3">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="text-sm text-text-light">
              <Link href="/" className="hover:text-ocean">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/produits" className="hover:text-ocean">Produits</Link>
              <span className="mx-2">/</span>
              <Link href={`/produits?categorie=${product.category}`} className="hover:text-ocean">
                {product.categoryLabel}
              </Link>
              <span className="mx-2">/</span>
              <span>{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <ProductVisual slug={product.slug} category={product.category} className="rounded-3xl h-80 shadow-inner" />

              <div className="flex items-center gap-3 bg-palm/10 border border-palm/20 rounded-xl px-4 py-3">
                <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-palm animate-pulse" />
                <p className="text-sm font-semibold text-palm">Stock disponible — impression sous 48h</p>
              </div>

              <div className="bg-ocean/5 border border-ocean/15 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">✈️</span>
                <div>
                  <p className="font-semibold text-ocean text-sm">Livraison aérienne DOM-COM</p>
                  <p className="text-text-light text-xs mt-0.5">Guadeloupe • Martinique • Guyane • La Réunion • Saint-Martin • Saint-Barthélemy</p>
                  <p className="text-xs font-medium text-palm mt-1">🕐 {product.deliveryDays} après impression</p>
                </div>
              </div>

              <div className="bg-sand rounded-2xl p-5">
                <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
                  <span className="text-palm">✓</span> Inclus dans votre commande
                </h3>
                <ul className="space-y-2">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text-light">
                      <span className="text-palm mt-0.5 flex-shrink-0 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">{product.categoryLabel}</span>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{product.name}</h1>
              <p className="text-text-light leading-relaxed mb-6">{product.longDescription}</p>

              <div className="bg-sand rounded-2xl p-5 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-light mb-1">À partir de</p>
                  <p className="text-4xl font-bold text-ocean">{product.priceFrom.toFixed(2).replace('.', ',')} €</p>
                  <p className="text-xs text-text-lighter mt-1">TTC — hors frais de livraison</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-lighter mb-1">Plus de commandes =</p>
                  <p className="text-sm font-bold text-palm">Plus d&apos;économies ↓</p>
                </div>
              </div>

              {prescriptUrl ? (
                <ProductConfigurator
                  prescriptIframeUrl={prescriptUrl}
                  defaultQuantity={product.quantities[1] ?? product.quantities[0]}
                  productName={product.name}
                />
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

          <div className="mt-16 border-t border-gray-100 pt-10">
            <PricingTable tiers={product.pricingTiers} productName={product.name} />
          </div>

          <div className="mt-10 border-t border-gray-100 pt-10">
            <h2 className="text-2xl font-bold mb-6">Caractéristiques techniques</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Formats disponibles', value: product.formats.map((f) => f.label).join(', ') },
                { label: 'Supports', value: product.paperTypes.join(', ') },
                { label: 'Finitions', value: product.finishes.join(', ') },
                { label: 'Délai de livraison', value: product.deliveryDays },
              ].map((spec) => (
                <div key={spec.label} className="bg-sand rounded-xl p-4">
                  <p className="text-xs font-semibold text-text-light uppercase tracking-wide mb-1">{spec.label}</p>
                  <p className="text-sm font-medium">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-ocean/5 border border-ocean/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-3xl">📋</span>
            <div className="flex-1">
              <p className="font-bold text-sm">Comment préparer votre fichier ?</p>
              <p className="text-sm text-text-light mt-0.5">Format PDF, résolution 300 dpi, mode CMJN, fonds perdus 3mm.</p>
            </div>
            <Link
              href="/guide-fichiers"
              className="flex-shrink-0 bg-ocean text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-ocean-dark transition-colors"
            >
              Guide complet →
            </Link>
          </div>

          <div className="mt-10 border-t border-gray-100 pt-10">
            <h2 className="text-xl font-bold mb-6 text-center">Nos engagements</h2>
            <TrustBadges />
          </div>

          {related.length > 0 && (
            <div className="mt-10 border-t border-gray-100 pt-10">
              <h2 className="text-xl font-bold mb-6">Vous pourriez aussi aimer</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produits/${p.slug}`}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-ocean/20 transition-all hover:-translate-y-1"
                  >
                    <ProductVisual slug={p.slug} category={p.category} className="h-32" />
                    <div className="p-4">
                      <h3 className="font-bold text-sm group-hover:text-ocean transition-colors">{p.name}</h3>
                      <p className="text-xs text-text-light mt-1 line-clamp-2">{p.description}</p>
                      <p className="text-ocean font-bold text-sm mt-2">
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
