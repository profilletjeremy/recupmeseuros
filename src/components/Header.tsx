'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

const NAV_ITEMS = [
  { label: 'Carte de visite', href: '/produits/carte-de-visite' },
  { label: 'Flyer', href: '/produits?categorie=communication' },
  { label: 'Brochure', href: '/produits/brochure' },
  { label: 'Affiche', href: '/produits/affiche' },
  { label: 'Banderole', href: '/produits/bache', badge: 'NEW' },
  { label: 'Roll-up', href: '/produits?categorie=evenementiel' },
  { label: 'Panneau rigide', href: '/produits?categorie=affichage' },
  { label: 'Signalétique', href: '/produits?categorie=evenementiel' },
  { label: 'PLV Stand', href: '/produits?categorie=evenementiel' },
  { label: 'Objet Pub', href: '/produits?categorie=goodies', badge: 'NEW' },
  { label: 'Packaging', href: '/produits?categorie=packaging', badge: 'NEW' },
  { label: 'Papeterie', href: '/produits?categorie=papeterie' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = query.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/produits?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      {/* ── Promo bar ── */}
      <div className="bg-sun text-gray-900 text-xs py-2 px-4 flex items-center justify-between">
        <span className="hidden sm:flex items-center gap-1.5 font-medium text-gray-700">
          <span>🌴</span> L&apos;imprimeur en ligne 100% dédié aux DOM-COM
        </span>
        <span className="flex-1 sm:flex-none text-center font-bold">
          🎁 <strong>-50%</strong> sur votre première commande (jusqu&apos;à 40€) avec le code{' '}
          <span className="font-black tracking-wide">BIENVENUE50</span>
          <button
            onClick={() => navigator.clipboard?.writeText('BIENVENUE50')}
            className="inline-flex items-center ml-1.5 bg-gray-800/10 hover:bg-gray-800/20 rounded px-1 py-0.5 transition-colors"
            title="Copier le code"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </span>
        <span className="hidden sm:block text-gray-600 font-medium">
          Prix revendeur — livrés dans tout le DOM-COM
        </span>
      </div>

      {/* ── Main header row ── */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 mr-2">
            <span className="text-2xl font-black" style={{ color: '#E94B3C', fontStyle: 'italic', letterSpacing: '-1px' }}>
              K<span style={{ color: '#1A2332' }}>arib</span>
              <span style={{ color: '#E94B3C' }}>print</span>
            </span>
            <span className="text-[10px] font-bold text-gray-400 leading-none">.com</span>
          </Link>

          {/* Search bar */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Rechercher un produit"
                className="flex-1 px-4 py-3 text-sm border-2 border-gray-200 border-r-0 rounded-l-lg outline-none focus:border-coral transition-colors bg-gray-50 focus:bg-white"
              />
              <button
                type="submit"
                className="px-5 py-3 text-white rounded-r-lg font-bold text-sm flex items-center gap-2 flex-shrink-0 transition-opacity hover:opacity-90"
                style={{ background: '#E94B3C' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </form>
            {/* Suggestions dropdown */}
            {searchOpen && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-0.5 bg-white rounded-b-lg border border-gray-200 shadow-xl z-50 overflow-hidden">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produits/${p.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setSearchOpen(false); setQuery(''); }}
                  >
                    <span className="text-xl">{p.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                      <p className="text-xs text-coral font-medium">dès {p.priceFrom.toFixed(2).replace('.', ',')} € l&apos;unité</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <Link
            href="/contact"
            className="hidden md:flex items-center gap-2 text-white font-bold text-sm px-5 py-3 rounded-lg flex-shrink-0 transition-opacity hover:opacity-90"
            style={{ background: '#E94B3C' }}
          >
            Contactez-nous
          </Link>

          {/* Utility links */}
          <div className="hidden lg:flex items-center gap-0 text-sm text-gray-500 flex-shrink-0">
            <Link href="/contact" className="px-3 py-1 hover:text-coral transition-colors">Société</Link>
            <span className="text-gray-300">|</span>
            <Link href="/guide-fichiers" className="px-3 py-1 hover:text-coral transition-colors">Nos services</Link>
            <span className="text-gray-300">|</span>
            <Link href="/faq" className="px-3 py-1 hover:text-coral transition-colors">FAQ</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* User */}
            <Link href="/compte" className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Mon compte">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            {/* Cart */}
            <button onClick={openCart} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Mon panier">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-coral text-white text-[9px] font-black min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5">
                  {totalItems}
                </span>
              )}
            </button>
            {/* Mobile burger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Category nav ── */}
      <div className="hidden md:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <Link
              href="/produits"
              className="flex-shrink-0 px-1 mr-2 py-3 text-sm font-bold text-gray-700 hover:text-coral transition-colors border-b-2 border-transparent hover:border-coral whitespace-nowrap"
            >
              ☰ Tous
            </Link>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-3 text-sm font-medium text-gray-600 hover:text-coral transition-colors border-b-2 border-transparent hover:border-coral whitespace-nowrap"
              >
                {item.label}
                {item.badge && (
                  <span className="text-[9px] font-black text-white px-1 py-0.5 rounded leading-none" style={{ background: '#43AA8B' }}>
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto shadow-lg">
          <div className="px-4 py-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Produits</p>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-black text-white px-1.5 py-0.5 rounded" style={{ background: '#43AA8B' }}>NEW</span>
                )}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
              {[
                { href: '/guide-fichiers', label: 'Guide fichiers' },
                { href: '/faq', label: 'FAQ' },
                { href: '/livraison', label: 'Livraison' },
                { href: '/contact', label: 'Contactez-nous' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
