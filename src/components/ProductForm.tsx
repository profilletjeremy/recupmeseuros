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
    <div className="space-y-5">
      {/* Format selector */}
      <div>
        <label className="block text-sm font-semibold text-text mb-2">Format</label>
        <div className="grid grid-cols-2 gap-2">
          {formats.map((fmt) => (
            <button
              key={fmt.label}
              type="button"
              onClick={() => setSelectedFormat(fmt.label)}
              className={`flex flex-col gap-0.5 border-2 rounded-xl p-3 text-left transition-all ${
                selectedFormat === fmt.label
                  ? 'border-ocean bg-ocean/5'
                  : 'border-gray-200 hover:border-ocean/50'
              }`}
            >
              <span className="font-semibold text-sm">{fmt.label}</span>
              {fmt.dimensions && (
                <span className="text-xs text-text-lighter">{fmt.dimensions}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity selector */}
      <div>
        <label className="block text-sm font-semibold text-text mb-2">Quantité</label>
        <div className="flex flex-wrap gap-2">
          {pricingTiers.map((tier) => (
            <button
              key={tier.quantity}
              type="button"
              onClick={() => setSelectedQty(tier.quantity)}
              className={`relative border-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                selectedQty === tier.quantity
                  ? 'border-ocean bg-ocean/5 text-ocean'
                  : 'border-gray-200 hover:border-ocean/50'
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

      {/* Price display */}
      <div className="bg-sand rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-text-light mb-0.5">Prix total TTC estimé</p>
          <p className="text-4xl font-bold text-ocean">
            {currentTier.price.toFixed(2).replace('.', ',')} €
          </p>
          <p className="text-xs text-text-lighter mt-1">
            soit {currentUnitPrice.toFixed(3).replace('.', ',')} €/exemplaire
          </p>
        </div>
        {savings > 0 && (
          <div className="bg-palm text-white rounded-2xl px-4 py-3 text-center flex-shrink-0">
            <p className="text-xs font-medium">Économie</p>
            <p className="text-2xl font-bold">-{savings}%</p>
            <p className="text-xs opacity-90">vs 1 ex.</p>
          </div>
        )}
      </div>

      {/* Paper type */}
      <div>
        <label className="block text-sm font-semibold text-text mb-2">Support / Papier</label>
        <select
          value={selectedPaper}
          onChange={(e) => setSelectedPaper(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
        >
          {paperTypes.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Finish */}
      {finishes.length > 1 && (
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Finition</label>
          <select
            value={selectedFinish}
            onChange={(e) => setSelectedFinish(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
          >
            {finishes.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      )}

      {/* File upload */}
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-ocean transition-colors cursor-pointer group">
        <span className="text-4xl block mb-2">📤</span>
        <p className="font-semibold text-sm mb-1 group-hover:text-ocean transition-colors">
          Téléversez votre fichier
        </p>
        <p className="text-xs text-text-light">PDF, AI, PSD, EPS — 300 dpi minimum — Fonds perdus 3mm</p>
        <p className="text-xs text-text-lighter mt-1">
          <Link href="/guide-fichiers" className="underline hover:text-ocean">
            Guide de préparation de fichiers →
          </Link>
        </p>
      </div>

      {/* CTA — Add to cart */}
      <button
        onClick={handleAddToCart}
        className={`block w-full text-center font-bold text-lg py-4 rounded-xl transition-all shadow-lg ${
          added
            ? 'bg-palm text-white shadow-palm/30'
            : 'bg-coral hover:bg-coral-dark text-white hover:shadow-xl'
        }`}
      >
        {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
      </button>
      <Link
        href={contactUrl}
        className="block w-full text-center border-2 border-gray-200 hover:border-ocean text-text font-semibold text-sm py-3 rounded-xl transition-colors hover:text-ocean"
      >
        Demander un devis gratuit
      </Link>
      <p className="text-center text-xs text-text-lighter">
        Réponse sous 24h • Devis sans engagement • Qualité garantie
      </p>
    </div>
  );
}
