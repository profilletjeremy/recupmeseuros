'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { categories, products } from '@/data/products';
import { territories } from '@/data/territories';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [territory, setTerritory] = useState('GP');
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const router = useRouter();

  const currentTerritory = territories.find((t) => t.code === territory);

  const suggestions = query.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/produits?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Promo bar */}
      <div className="bg-ocean text-white text-xs py-2 text-center font-medium tracking-wide">
        ✈️ Livraison aérienne garantie en {currentTerritory?.deliveryDays ?? '5–7 jours'} — Qualité pro ou réimpression offerte
        <span className="hidden sm:inline"> &nbsp;|&nbsp; </span>
        <select
          className="hidden sm:inline bg-transparent border-none text-white text-xs cursor-pointer underline underline-offset-2 ml-1"
          value={territory}
          onChange={(e) => setTerritory(e.target.value)}
        >
          {territories.map((t) => (
            <option key={t.code} value={t.code} className="text-black bg-white">
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main header row */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-ocean flex-shrink-0 mr-4">
            <span className="text-2xl">🌊</span>
            <span className="hidden sm:block">
              Karib<span className="text-coral">Print</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl">
            <div className="flex items-center border-2 border-gray-200 focus-within:border-ocean rounded-xl overflow-hidden transition-colors bg-gray-50 focus-within:bg-white">
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                placeholder="Rechercher un produit (flyers, cartes de visite…)"
                className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-coral hover:bg-coral-dark text-white px-4 py-2.5 transition-colors flex-shrink-0"
                aria-label="Rechercher"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            {/* Suggestions */}
            {searchOpen && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produits/${p.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-sand transition-colors"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-ocean">À partir de {p.priceFrom.toFixed(2).replace('.', ',')} €</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            {/* Account */}
            <Link
              href="/compte"
              className="flex flex-col items-center gap-0.5 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-ocean" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden md:block text-[10px] text-gray-500 font-medium group-hover:text-ocean">Compte</span>
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="flex flex-col items-center gap-0.5 p-2 rounded-lg hover:bg-gray-100 transition-colors relative group"
            >
              <div className="relative">
                <svg className="w-5 h-5 text-gray-600 group-hover:text-ocean" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-coral text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5 leading-none">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:block text-[10px] text-gray-500 font-medium group-hover:text-ocean">Panier</span>
            </button>

            {/* Devis CTA — desktop */}
            <Link
              href="/contact"
              className="hidden lg:flex items-center gap-1.5 bg-coral hover:bg-coral-dark text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors ml-2 shadow-md"
            >
              Devis gratuit
            </Link>

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors ml-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category nav bar — desktop */}
      <div className="hidden md:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            <Link
              href="/produits"
              className="flex-shrink-0 px-4 py-3 text-sm font-semibold text-gray-700 hover:text-ocean hover:bg-gray-50 border-b-2 border-transparent hover:border-ocean transition-all whitespace-nowrap"
            >
              Tous les produits
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/produits?categorie=${cat.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-gray-600 hover:text-ocean hover:bg-gray-50 border-b-2 border-transparent hover:border-ocean transition-all whitespace-nowrap"
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
            <Link
              href="/guide-fichiers"
              className="flex-shrink-0 px-4 py-3 text-sm font-medium text-gray-500 hover:text-ocean hover:bg-gray-50 border-b-2 border-transparent hover:border-ocean transition-all whitespace-nowrap ml-auto"
            >
              Guide fichiers
            </Link>
            <Link
              href="/faq"
              className="flex-shrink-0 px-4 py-3 text-sm font-medium text-gray-500 hover:text-ocean hover:bg-gray-50 border-b-2 border-transparent hover:border-ocean transition-all whitespace-nowrap"
            >
              FAQ
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto shadow-lg">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2">Catégories</p>
          <Link href="/produits" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sand text-sm font-semibold" onClick={() => setMenuOpen(false)}>
            🛍️ Tous les produits
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produits?categorie=${cat.id}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sand transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
            {[
              { href: '/guide-fichiers', label: 'Guide fichiers' },
              { href: '/faq', label: 'FAQ' },
              { href: '/livraison', label: 'Livraison' },
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
              className="block w-full text-center bg-coral text-white font-bold py-3 rounded-xl hover:bg-coral-dark transition-colors"
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
