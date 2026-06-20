'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductVisual from '@/components/ProductVisual';
import { products as staticProducts, categories } from '@/data/products';
import { getCatalogProducts, hasCatalog, type CatalogProduct } from '@/lib/catalog';

// Unified shape used in the grid
interface GridProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  emoji: string;
  description: string;
  priceFrom?: number;
  deliveryDays?: string;
  popular?: boolean;
  featured?: boolean;
}

function toGridProducts(): GridProduct[] {
  if (hasCatalog()) {
    return getCatalogProducts().map((p: CatalogProduct) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      categoryLabel: p.categoryLabel,
      emoji: p.emoji,
      description: `Impression ${p.name.toLowerCase()} de qualité professionnelle, livrée par avion dans tous les DOM-COM.`,
    }));
  }
  return staticProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    categoryLabel: p.categoryLabel,
    emoji: p.emoji,
    description: p.description,
    priceFrom: p.priceFrom,
    deliveryDays: p.deliveryDays,
    popular: p.popular,
    featured: p.featured,
  }));
}

function ProduitsGrid() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<string>('all');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  useEffect(() => {
    const cat = searchParams.get('categorie');
    if (cat) setActive(cat);
  }, [searchParams]);

  const allProducts = toGridProducts();
  const useCatalog = hasCatalog();

  const filtered = allProducts
    .filter((p) => active === 'all' || p.category === active)
    .filter((p) => {
      const q = searchParams.get('q');
      if (!q) return true;
      return p.name.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase());
    })
    .slice()
    .sort((a, b) => {
      if (!useCatalog) {
        if (sort === 'price-asc') return (a.priceFrom ?? 0) - (b.priceFrom ?? 0);
        if (sort === 'price-desc') return (b.priceFrom ?? 0) - (a.priceFrom ?? 0);
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      return a.name.localeCompare(b.name, 'fr');
    });

  const activeCategoryIds = new Set(allProducts.map((p) => p.category));

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActive('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              active === 'all'
                ? 'bg-ocean text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-ocean hover:text-ocean'
            }`}
          >
            Tout ({allProducts.length})
          </button>
          {categories.filter((cat) => activeCategoryIds.has(cat.id)).map((cat) => {
            const count = allProducts.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active === cat.id
                    ? 'bg-ocean text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-ocean hover:text-ocean'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
        {!useCatalog && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-600 focus:outline-none focus:border-ocean transition-colors flex-shrink-0"
          >
            <option value="default">Popularité</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        )}
      </div>

      <p className="text-sm text-gray-400 mb-6">{filtered.length} produit{filtered.length > 1 ? 's' : ''}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-ocean/20 transition-all duration-300 hover:-translate-y-1 flex flex-col group"
          >
            <Link href={`/produits/${product.slug}`} className="block">
              <ProductVisual slug={product.slug} category={product.category} emoji={product.emoji} className="h-44 relative">
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
                <h2 className="font-black text-gray-900 mt-1 mb-1 group-hover:text-ocean transition-colors text-sm leading-snug">{product.name}</h2>
              </Link>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">{product.description}</p>
              <div className="flex items-end justify-between mb-3">
                <div>
                  {product.priceFrom ? (
                    <>
                      <p className="text-[10px] text-gray-400">À partir de</p>
                      <p className="font-black text-ocean text-xl leading-tight">{product.priceFrom.toFixed(2).replace('.', ',')} €</p>
                    </>
                  ) : (
                    <p className="text-xs font-semibold text-ocean">Prix selon configuration</p>
                  )}
                </div>
                {product.deliveryDays && (
                  <p className="text-[10px] text-gray-400">{product.deliveryDays}</p>
                )}
              </div>
              <Link
                href={`/produits/${product.slug}`}
                className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold text-sm py-2.5 rounded-xl transition-colors"
              >
                {useCatalog ? 'Configurer →' : 'Commander →'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function ProduitsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
              <Link href="/" className="hover:text-ocean transition-colors">Accueil</Link>
              <span>/</span>
              <span className="text-gray-700">Produits</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Nos produits d&apos;impression</h1>
            <p className="text-gray-500 text-sm">Impression professionnelle livrée par avion dans tous les DOM-COM</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Suspense fallback={<div className="text-sm text-gray-400 py-4">Chargement…</div>}>
            <ProduitsGrid />
          </Suspense>

          <div className="mt-14 bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
            <p className="text-2xl mb-3">🖨️</p>
            <h3 className="text-lg font-black text-gray-900 mb-2">Vous ne trouvez pas ce qu&apos;il vous faut ?</h3>
            <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
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
