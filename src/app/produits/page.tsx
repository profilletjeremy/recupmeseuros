'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductVisual from '@/components/ProductVisual';
import { products as staticProducts, categories } from '@/data/products';
import { getCatalogProducts, hasCatalog, type CatalogProduct } from '@/lib/catalog';

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

const BADGE_LABELS = ['NOUVEAU !', 'BEST-SELLER !', 'EN TENDANCE !', 'PRIX FOU !'];
const BADGE_COLORS = ['#43AA8B', '#F47920', '#0077B6', '#E94B3C'];

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
      {/* Filter bar — Realisaprint style */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActive('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                active === 'all'
                  ? 'text-white border-coral'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-coral hover:text-coral'
              }`}
              style={active === 'all' ? { background: '#E94B3C' } : {}}
            >
              Tous ({allProducts.length})
            </button>
            {categories.filter((cat) => activeCategoryIds.has(cat.id)).map((cat) => {
              const count = allProducts.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                    active === cat.id
                      ? 'text-white border-coral'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-coral hover:text-coral'
                  }`}
                  style={active === cat.id ? { background: '#E94B3C' } : {}}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
          {!useCatalog && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 focus:outline-none focus:border-coral transition-colors flex-shrink-0"
            >
              <option value="default">Popularité</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-400 my-4">{filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}</p>

      {/* Product grid — Realisaprint style */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product, i) => {
          const badgeLabel = product.popular ? 'BEST-SELLER !' : BADGE_LABELS[i % BADGE_LABELS.length];
          const badgeColor = product.popular ? '#F47920' : BADGE_COLORS[i % BADGE_COLORS.length];
          return (
            <Link
              key={product.id}
              href={`/produits/${product.slug}`}
              className="group bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              {/* Visual */}
              <div className="relative">
                <ProductVisual slug={product.slug} category={product.category} emoji={product.emoji} className="h-44 w-full" />
                <span
                  className="absolute top-3 left-3 text-white text-[10px] font-black px-2 py-0.5 rounded"
                  style={{ background: badgeColor }}
                >
                  {badgeLabel}
                </span>
              </div>
              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#999' }}>{product.categoryLabel}</p>
                <h2 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-coral transition-colors">{product.name}</h2>
                {product.priceFrom ? (
                  <p className="text-sm text-gray-600 mb-3">
                    dès <span className="font-black text-gray-900 text-lg">{product.priceFrom.toFixed(2).replace('.', ',')}€</span>{' '}
                    <span className="text-gray-400 text-xs">l&apos;unité</span>
                  </p>
                ) : (
                  <p className="text-xs font-bold mb-3" style={{ color: '#0077B6' }}>Prix selon configuration</p>
                )}
                <div className="flex items-center gap-1.5 mb-3 mt-auto">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#43AA8B' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-gray-500">Livraison DOM-COM incluse</span>
                </div>
                <button
                  className="block w-full text-center text-white font-bold text-sm py-2.5 rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: '#E94B3C' }}
                >
                  {useCatalog ? 'Configurer →' : 'Commander →'}
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default function ProduitsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Page header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
              <Link href="/" className="hover:text-coral transition-colors">Accueil</Link>
              <span>/</span>
              <span className="text-gray-600">Produits</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">Nos produits d&apos;impression</h1>
            <p className="text-gray-500 text-sm">Impression professionnelle livrée par avion dans tous les DOM-COM</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <Suspense fallback={<div className="text-sm text-gray-400 py-4">Chargement…</div>}>
            <ProduitsGrid />
          </Suspense>

          {/* Custom quote CTA */}
          <div className="mt-12 bg-white rounded-xl p-8 text-center border border-gray-100" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p className="text-2xl mb-3">🖨️</p>
            <h3 className="text-lg font-black text-gray-900 mb-2">Vous ne trouvez pas ce qu&apos;il vous faut ?</h3>
            <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
              Nous pouvons imprimer presque tout. Contactez-nous pour un devis sur mesure.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-lg transition-opacity hover:opacity-90 shadow-md"
              style={{ background: '#E94B3C' }}
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
