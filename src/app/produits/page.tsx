'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductVisual from '@/components/ProductVisual';
import { products, categories } from '@/data/products';

export default function ProduitsPage() {
  const [active, setActive] = useState<string>('all');
  const [sort, setSort] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  const filtered = products
    .filter((p) => active === 'all' || p.category === active)
    .slice()
    .sort((a, b) => {
      if (sort === 'price-asc') return a.priceFrom - b.priceFrom;
      if (sort === 'price-desc') return b.priceFrom - a.priceFrom;
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Nos produits d&apos;impression
            </h1>
            <p className="text-text-light max-w-xl">
              Imprimés en haute qualité et livrés par avion en Guadeloupe, Martinique,
              Guyane, La Réunion, Saint-Martin et Saint-Barthélemy.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Filters + Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActive('all')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active === 'all'
                    ? 'bg-ocean text-white shadow-md shadow-ocean/25'
                    : 'bg-sand border border-sand-dark text-text hover:bg-sand-dark'
                }`}
              >
                Tous ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActive(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active === cat.id
                        ? 'bg-ocean text-white shadow-md shadow-ocean/25'
                        : 'bg-sand border border-sand-dark text-text hover:bg-sand-dark'
                    }`}
                  >
                    {cat.emoji} {cat.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-text focus:outline-none focus:border-ocean transition-colors"
            >
              <option value="popular">Les plus populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          {/* Results count */}
          <p className="text-sm text-text-lighter mb-6">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            {active !== 'all' ? ` dans « ${categories.find((c) => c.id === active)?.label} »` : ''}
          </p>

          {/* Product grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/produits/${product.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-ocean/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              >
                <ProductVisual slug={product.slug} category={product.category} className="h-44 relative flex-shrink-0">
                  {product.popular && (
                    <div className="absolute top-3 right-3 bg-coral text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      ⭐ Populaire
                    </div>
                  )}
                </ProductVisual>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-coral uppercase tracking-wider">{product.categoryLabel}</span>
                  <h2 className="font-bold mt-1 mb-1.5 group-hover:text-ocean transition-colors text-sm">{product.name}</h2>
                  <p className="text-xs text-text-light line-clamp-2 mb-4 leading-relaxed flex-1">{product.description}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-text-lighter">À partir de</p>
                      <p className="font-bold text-ocean text-xl leading-tight">
                        {product.priceFrom.toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-palm font-bold bg-green-50 border border-green-100 px-2 py-1 rounded-lg block">
                        🚚 DOM-COM
                      </span>
                      <p className="text-[10px] text-text-lighter mt-1">{product.deliveryDays}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 bg-sand rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Vous ne trouvez pas ce qu&apos;il vous faut ?</h3>
            <p className="text-text-light mb-6 max-w-md mx-auto">
              Nous pouvons imprimer presque tout. Contactez-nous pour un devis sur mesure.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-coral text-white font-bold px-7 py-3.5 rounded-xl hover:bg-coral-dark transition-colors shadow-md"
            >
              Demander un devis personnalisé →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
