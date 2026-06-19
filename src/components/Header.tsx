'use client';

import Link from 'next/link';
import { useState } from 'react';
import { categories, products } from '@/data/products';
import { territories } from '@/data/territories';
import { useCart } from '@/contexts/CartContext';

const FEATURED_PRODUCTS = ['cartes-de-visite', 'flyers-tracts', 'affiches-posters', 'roll-up-kakemono'];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [territory, setTerritory] = useState('GP');
  const [productsOpen, setProductsOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  const currentTerritory = territories.find((t) => t.code === territory);
  const featuredNav = products.filter((p) => FEATURED_PRODUCTS.includes(p.slug));

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-ocean text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <span className="hidden sm:block text-xs">
            🚚 Livraison garantie en {currentTerritory?.deliveryDays ?? '5–7 jours ouvrés'} vers {currentTerritory?.name ?? 'votre île'}
          </span>
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <Link href="/guide-fichiers" className="hidden md:inline text-xs text-white/80 hover:text-white transition-colors">
              Guide fichiers
            </Link>
            <Link href="/faq" className="hidden md:inline text-xs text-white/80 hover:text-white transition-colors">
              FAQ
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="text-xs opacity-80">Île :</span>
              <select
                className="bg-ocean-dark text-white text-xs rounded px-2 py-0.5 border border-white/30 cursor-pointer"
                value={territory}
                onChange={(e) => setTerritory(e.target.value)}
              >
                {territories.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name} ({t.dept})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-ocean flex-shrink-0">
          <span className="text-2xl">🌊</span>
          <span>
            Karib<span className="text-coral">Print</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          {/* Products mega menu */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              className="flex items-center gap-1 hover:text-ocean transition-colors py-1"
              onClick={() => setProductsOpen(!productsOpen)}
            >
              Produits
              <svg className={`w-4 h-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {productsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                <div className="p-5 grid grid-cols-2 gap-5">
                  {/* Categories */}
                  <div>
                    <p className="text-xs font-bold text-text-lighter uppercase tracking-wider mb-3">Catégories</p>
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/produits?categorie=${cat.id}`}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sand transition-colors"
                          onClick={() => setProductsOpen(false)}
                        >
                          <span className="text-xl">{cat.emoji}</span>
                          <span className="text-sm font-medium">{cat.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* Popular products */}
                  <div>
                    <p className="text-xs font-bold text-text-lighter uppercase tracking-wider mb-3">Produits populaires</p>
                    <div className="space-y-1">
                      {featuredNav.map((p) => (
                        <Link
                          key={p.id}
                          href={`/produits/${p.slug}`}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-sand transition-colors"
                          onClick={() => setProductsOpen(false)}
                        >
                          <span className="text-xl">{p.emoji}</span>
                          <div>
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-ocean">À partir de {p.priceFrom.toFixed(2).replace('.', ',')} €</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link
                        href="/produits"
                        className="flex items-center gap-1 text-sm font-semibold text-ocean hover:underline px-3"
                        onClick={() => setProductsOpen(false)}
                      >
                        Voir tous les produits →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/livraison" className="hover:text-ocean transition-colors">
            Livraison
          </Link>
          <Link href="/guide-fichiers" className="hover:text-ocean transition-colors">
            Guide fichiers
          </Link>
          <Link href="/faq" className="hover:text-ocean transition-colors">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-ocean transition-colors">
            Contact
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          {/* Account icon */}
          <Link
            href="/compte"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-ocean"
            aria-label="Mon compte"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Cart icon */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-ocean"
            aria-label="Panier"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-coral text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none px-0.5">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-1.5 bg-coral text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-coral-dark transition-colors"
          >
            Devis gratuit
          </Link>
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-2">Catégories</p>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produits?categorie=${cat.id}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sand transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span>{cat.emoji}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
            {[
              { href: '/produits', label: 'Tous les produits' },
              { href: '/livraison', label: 'Livraison' },
              { href: '/guide-fichiers', label: 'Guide fichiers' },
              { href: '/faq', label: 'FAQ' },
              { href: '/contact', label: 'Contact' },
              { href: '/compte', label: 'Mon compte' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-sand text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-gray-100">
            <Link
              href="/contact"
              className="block w-full text-center bg-coral text-white font-semibold py-3 rounded-xl hover:bg-coral-dark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Devis gratuit →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
