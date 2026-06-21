'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PricingTier } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

interface Props {
  pricingTiers: PricingTier[];
  formats: Array<{ label: string; dimensions: string }>;
  paperTypes: string[];
  finishes: string[];
  productName: string;
  productId: string;
  productSlug: string;
  productEmoji: string;
}

export default function ProductForm({ pricingTiers, formats, paperTypes, finishes, productName, productId, productSlug, productEmoji }: Props) {
  const { addItem } = useCart();
  const defaultTier = pricingTiers.find((t) => t.isPopular) ?? pricingTiers[1] ?? pricingTiers[0];
  const [selectedFormat, setSelectedFormat] = useState(formats[0]?.label ?? '');
  const [selectedQty, setSelectedQty] = useState(defaultTier?.quantity ?? pricingTiers[0]?.quantity);
  const [selectedPaper, setSelectedPaper] = useState(paperTypes[0] ?? '');
  const [selectedFinish, setSelectedFinish] = useState(finishes[0] ?? '');
  const [added, setAdded] = useState(false);

  const currentTier = pricingTiers.find((t) => t.quantity === selectedQty) ?? pricingTiers[0];
  const baseTier = pricingTiers[0];
  const baseUnitPrice = baseTier.price / baseTier.quantity;
  const currentUnitPrice = currentTier.price / currentTier.quantity;
  const savings = Math.round((1 - currentUnitPrice / baseUnitPrice) * 100);

  const contactUrl = `/contact?produit=${encodeURIComponent(productName)}&format=${encodeURIComponent(selectedFormat)}&qty=${selectedQty}&papier=${encodeURIComponent(selectedPaper)}&finition=${encodeURIComponent(selectedFinish)}`;

  const handleAddToCart = () => {
    addItem({
      productId,
      productSlug,
      productName,
      productEmoji,
      format: selectedFormat,
      quantity: selectedQty,
      paper: selectedPaper,
      finish: selectedFinish,
      unitPrice: currentUnitPrice,
      totalPrice: currentTier.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="space-y-0 border border-gray-200 rounded-2xl overflow-hidden">

      {/* Format */}
      <div className="border-b border-gray-100">
        <div className="px-5 py-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Format</p>
          <div className="grid grid-cols-2 gap-2">
            {formats.map((fmt) => (
              <button
                key={fmt.label}
                type="button"
                onClick={() => setSelectedFormat(fmt.label)}
                className={`flex items-center justify-between border-2 rounded-xl px-4 py-3 text-left transition-all ${
                  selectedFormat === fmt.label
                    ? 'border-coral bg-coral/5 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div>
                  <span className="block font-semibold text-sm">{fmt.label}</span>
                  {fmt.dimensions && (
                    <span className="block text-xs text-gray-400 mt-0.5">{fmt.dimensions}</span>
                  )}
                </div>
                {selectedFormat === fmt.label && (
                  <span className="w-5 h-5 rounded-full bg-coral flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Support / papier */}
      <div className="border-b border-gray-100">
        <div className="px-5 py-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Support / Papier</p>
          <div className="relative">
            <select
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              className="w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-3.5 pr-10 text-sm font-medium focus:outline-none focus:border-coral transition-colors bg-white cursor-pointer"
            >
              {paperTypes.map((p) => <option key={p}>{p}</option>)}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Finition */}
      {finishes.length > 1 && (
        <div className="border-b border-gray-100">
          <div className="px-5 py-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pelliculage / Finition</p>
            <div className="relative">
              <select
                value={selectedFinish}
                onChange={(e) => setSelectedFinish(e.target.value)}
                className="w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-3.5 pr-10 text-sm font-medium focus:outline-none focus:border-coral transition-colors bg-white cursor-pointer"
              >
                {finishes.map((f) => <option key={f}>{f}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Quantité */}
      <div className="border-b border-gray-100">
        <div className="px-5 py-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quantité</p>
          <div className="flex flex-wrap gap-2">
            {pricingTiers.map((tier) => (
              <button
                key={tier.quantity}
                type="button"
                onClick={() => setSelectedQty(tier.quantity)}
                className={`relative border-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  selectedQty === tier.quantity
                    ? 'border-coral bg-coral/5 text-coral shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                {tier.isPopular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-palm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    Populaire
                  </span>
                )}
                {tier.isBestValue && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-coral text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    Meilleure valeur
                  </span>
                )}
                {tier.quantity.toLocaleString('fr-FR')} ex.
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prix + économie */}
      <div className="bg-gray-50 px-5 py-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Prix total TTC estimé</p>
          <p className="text-4xl font-black text-gray-900 tracking-tight">
            {currentTier.price.toFixed(2).replace('.', ',')} <span className="text-2xl">€</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            soit {currentUnitPrice.toFixed(3).replace('.', ',')} €/ex. · hors livraison
          </p>
        </div>
        {savings > 0 && (
          <div className="flex-shrink-0 bg-palm text-white rounded-2xl px-4 py-3 text-center">
            <p className="text-[10px] font-semibold opacity-80">ÉCONOMIE</p>
            <p className="text-2xl font-black leading-none">-{savings}%</p>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="px-5 pb-5 space-y-2.5 bg-gray-50">
        <button
          onClick={handleAddToCart}
          className={`block w-full text-center font-bold text-base py-4 rounded-xl transition-all ${
            added
              ? 'bg-palm text-white'
              : 'bg-coral hover:bg-coral-dark text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {added ? '✓ Ajouté au panier !' : '🛒 Ajouter au panier'}
        </button>
        <Link
          href={contactUrl}
          className="block w-full text-center border-2 border-gray-300 hover:border-ocean hover:text-ocean text-gray-700 font-semibold text-sm py-3 rounded-xl transition-colors bg-white"
        >
          Demander un devis gratuit
        </Link>
        <p className="text-center text-[11px] text-gray-400 pt-1">
          Réponse sous 24h · Devis sans engagement · Qualité garantie
        </p>
      </div>
    </div>
  );
}
