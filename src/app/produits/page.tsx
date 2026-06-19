import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products, categories } from '@/data/products';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tous nos produits d\'impression',
  description:
    'Cartes de visite, flyers, affiches, banderoles, roll-up... Tous nos produits d\'impression livrés aux Antilles et La Réunion.',
};

export default function ProduitsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Header */}
        <div className="bg-sand border-b border-sand-dark py-10">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="text-sm text-text-light mb-4">
              <Link href="/" className="hover:text-ocean">Accueil</Link>
              <span className="mx-2">/</span>
              <span>Produits</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
              Tous nos produits d&apos;impression
            </h1>
            <p className="text-text-light max-w-xl">
              Imprimés en France et livrés directement en Guadeloupe, Martinique, Guyane,
              La Réunion, Saint-Martin et Saint-Barthélemy.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/produits"
              className="px-4 py-2 rounded-lg bg-ocean text-white text-sm font-semibold"
            >
              Tous
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/produits?categorie=${cat.id}`}
                className="px-4 py-2 rounded-lg bg-sand border border-sand-dark text-text text-sm font-medium hover:bg-sand-dark transition-colors"
              >
                {cat.emoji} {cat.label}
              </Link>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/produits/${product.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Placeholder image */}
                <div
                  className="h-44 flex items-center justify-center text-6xl"
                  style={{ background: 'linear-gradient(135deg, #FFF8F3 0%, #F5E8DC 100%)' }}
                >
                  {product.emoji}
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                    {product.categoryLabel}
                  </span>
                  <h2 className="font-bold mt-1 mb-1 group-hover:text-ocean transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-xs text-text-light line-clamp-2 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-lighter">À partir de</p>
                      <p className="font-bold text-ocean text-lg">
                        {product.priceFrom.toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-palm font-semibold bg-green-50 px-2.5 py-1 rounded-full">
                      ✓ DOM/COM
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
