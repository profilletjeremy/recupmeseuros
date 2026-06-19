'use client';

import Link from 'next/link';
import { useState } from 'react';
import { categories } from '@/data/products';
import { territories } from '@/data/territories';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [territory, setTerritory] = useState('GP');

  const currentTerritory = territories.find((t) => t.code === territory);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-ocean text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="hidden sm:block">
            Livraison garantie en {currentTerritory?.deliveryDays ?? '5-7 jours ouvrés'}
          </span>
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <span className="opacity-80">Territoire :</span>
            <select
              className="bg-ocean-dark text-white text-sm rounded px-2 py-0.5 border border-white/30 cursor-pointer"
              value={territory}
              onChange={(e) => setTerritory(e.target.value)}
            >
              {territories.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-ocean">
          <span className="text-2xl">🌊</span>
          <span>
            Karib<span className="text-coral">Print</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <div className="group relative">
            <button className="flex items-center gap-1 hover:text-ocean transition-colors py-1">
              Produits
              <svg className="w-4 h-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/produits?categorie=${cat.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sand transition-colors text-sm"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <Link
                    href="/produits"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sand transition-colors text-sm font-semibold text-ocean"
                  >
                    Voir tous les produits →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Link href="/livraison" className="hover:text-ocean transition-colors">
            Livraison
          </Link>
          <Link href="/contact" className="hover:text-ocean transition-colors">
            Contact
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/produits"
            className="hidden md:inline-flex bg-coral text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-coral-dark transition-colors"
          >
            Commander
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
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
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
            <Link
              href="/livraison"
              className="flex items-center px-3 py-2.5 rounded-lg hover:bg-sand text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Livraison
            </Link>
            <Link
              href="/contact"
              className="flex items-center px-3 py-2.5 rounded-lg hover:bg-sand text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="pt-3">
            <Link
              href="/produits"
              className="block w-full text-center bg-coral text-white font-semibold py-3 rounded-xl hover:bg-coral-dark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Commander maintenant
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
