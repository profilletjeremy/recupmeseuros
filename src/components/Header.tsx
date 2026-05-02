"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isPremium } from "@/lib/premium";

export default function Header() {
  const [premium, setPremium] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setPremium(isPremium());
  }, []);

  const navLinks = (
    <>
      <Link
        href="/questionnaire"
        className="hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        Commencer
      </Link>
      <Link
        href="/verification"
        className="hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        Vérifier ma déclaration
      </Link>
      <Link
        href="/guides/emploi-a-domicile"
        className="hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        Guides
      </Link>
      <Link
        href="/simulateurs"
        className="hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        Simulateurs
      </Link>
      {premium && (
        <Link
          href="/dashboard"
          className="text-primary font-semibold hover:text-primary-dark transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          Mon espace
        </Link>
      )}
      <Link
        href="/mentions-legales"
        className="hover:text-primary transition-colors"
        onClick={() => setMenuOpen(false)}
      >
        Mentions légales
      </Link>
    </>
  );

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold text-primary">
            Récup<span className="text-secondary">Mes€uros</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-text-light">
          {navLinks}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-text transition-all duration-200 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-text transition-all duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-text transition-all duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm text-text-light animate-fadeIn">
          {navLinks}
        </nav>
      )}
    </header>
  );
}
