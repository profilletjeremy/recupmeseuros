import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductConfigurator from '@/components/ProductConfigurator';
import { getProductBySlug, products } from '@/data/products';
import { getPrescriptIframeUrl } from '@/lib/realisaprint';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Livraison Antilles & Réunion`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  // Build Préscript iFrame URL server-side so credentials never reach the client
  let prescriptUrl: string | null = null;
  if (product.realisaprintProductId && product.realisaprintStock) {
    try {
      prescriptUrl = getPrescriptIframeUrl(product.realisaprintProductId, product.realisaprintStock);
    } catch {
      // credentials not set in this environment — fall back to static configurator
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
              <span>{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product visual */}
            <div>
              <div
                className="rounded-3xl h-80 flex items-center justify-center text-9xl shadow-inner"
                style={{ background: 'linear-gradient(135deg, #FFF8F3 0%, #F5E8DC 100%)' }}
              >
                {product.emoji}
              </div>
              {/* Delivery badge */}
              <div className="mt-4 bg-palm/10 border border-palm/20 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-semibold text-palm text-sm">Livraison en Guadeloupe, Martinique, Guyane, La Réunion, Saint-Martin et Saint-Barthélemy</p>
                  <p className="text-text-light text-xs mt-0.5">{product.deliveryDays} après impression</p>
                </div>
              </div>
            </div>

            {/* Product info + configurator */}
            <div>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                {product.categoryLabel}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{product.name}</h1>
              <p className="text-text-light leading-relaxed mb-6">{product.longDescription}</p>

              {/* Price */}
              <div className="bg-sand rounded-2xl p-5 mb-6">
                <p className="text-sm text-text-light mb-1">À partir de</p>
                <p className="text-4xl font-bold text-ocean">
                  {product.priceFrom.toFixed(2).replace('.', ',')} €
                </p>
                <p className="text-xs text-text-lighter mt-1">TTC — hors frais de livraison</p>
              </div>

              {/* Configurator: Préscript iFrame if available, otherwise static form */}
              {prescriptUrl ? (
                <ProductConfigurator
                  prescriptIframeUrl={prescriptUrl}
                  defaultQuantity={product.quantities[1] ?? product.quantities[0]}
                  productName={product.name}
                />
              ) : (
                <StaticConfigurator product={product} />
              )}
            </div>
          </div>

          {/* Product specs */}
          <div className="mt-16 border-t border-gray-100 pt-10">
            <h2 className="text-2xl font-bold mb-6">Caractéristiques</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Formats disponibles', value: product.formats.map((f) => f.label).join(', ') },
                { label: 'Supports', value: product.paperTypes.join(', ') },
                { label: 'Finitions', value: product.finishes.join(', ') },
                { label: 'Délai de livraison', value: product.deliveryDays },
              ].map((spec) => (
                <div key={spec.label} className="bg-sand rounded-xl p-4">
                  <p className="text-xs font-semibold text-text-light uppercase tracking-wide mb-1">
                    {spec.label}
                  </p>
                  <p className="text-sm font-medium">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StaticConfigurator({ product }: { product: ReturnType<typeof getProductBySlug> & object }) {
  return (
    <div className="space-y-5">
      {/* Format selector */}
      <div>
        <label className="block text-sm font-semibold text-text mb-2">Format</label>
        <div className="grid grid-cols-2 gap-2">
          {product.formats.map((fmt, i) => (
            <label
              key={fmt.label}
              className={`flex flex-col gap-0.5 border-2 rounded-xl p-3 cursor-pointer transition-all ${
                i === 0 ? 'border-ocean bg-ocean/5' : 'border-gray-200 hover:border-ocean/50'
              }`}
            >
              <input type="radio" name="format" className="sr-only" defaultChecked={i === 0} />
              <span className="font-semibold text-sm">{fmt.label}</span>
              {fmt.dimensions && (
                <span className="text-xs text-text-lighter">{fmt.dimensions}</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Quantity selector */}
      <div>
        <label className="block text-sm font-semibold text-text mb-2">Quantité</label>
        <div className="flex flex-wrap gap-2">
          {product.quantities.map((qty, i) => (
            <label
              key={qty}
              className={`border-2 rounded-xl px-4 py-2 cursor-pointer text-sm font-semibold transition-all ${
                i === 1 ? 'border-ocean bg-ocean/5 text-ocean' : 'border-gray-200 hover:border-ocean/50'
              }`}
            >
              <input type="radio" name="quantity" className="sr-only" defaultChecked={i === 1} />
              {qty.toLocaleString('fr-FR')} ex.
            </label>
          ))}
        </div>
      </div>

      {/* Paper type */}
      <div>
        <label className="block text-sm font-semibold text-text mb-2">Support / Papier</label>
        <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors">
          {product.paperTypes.map((paper) => (
            <option key={paper}>{paper}</option>
          ))}
        </select>
      </div>

      {/* Finish */}
      {product.finishes.length > 1 && (
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Finition</label>
          <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors">
            {product.finishes.map((finish) => (
              <option key={finish}>{finish}</option>
            ))}
          </select>
        </div>
      )}

      {/* File upload */}
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-ocean transition-colors cursor-pointer">
        <span className="text-4xl block mb-2">📤</span>
        <p className="font-semibold text-sm mb-1">Téléversez votre fichier</p>
        <p className="text-xs text-text-light">PDF, AI, PSD, EPS — 300 dpi minimum</p>
        <p className="text-xs text-text-lighter mt-1">Ou choisissez parmi nos modèles</p>
      </div>

      {/* CTA */}
      <Link
        href="/contact"
        className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
      >
        Demander un devis gratuit
      </Link>
      <p className="text-center text-xs text-text-lighter">Notre équipe vous répond sous 24h</p>
    </div>
  );
}
