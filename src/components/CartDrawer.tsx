'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-ocean" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="font-bold text-lg">Mon panier</h2>
            {items.length > 0 && (
              <span className="bg-ocean text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Fermer le panier"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-20 h-20 bg-sand rounded-full flex items-center justify-center text-4xl">
                🛒
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">Votre panier est vide</p>
                <p className="text-sm text-text-light">Ajoutez des produits pour commencer votre commande.</p>
              </div>
              <Link
                href="/produits"
                onClick={closeCart}
                className="bg-ocean text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-ocean-dark transition-colors"
              >
                Voir les produits →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.cartId} className="bg-sand rounded-2xl p-4 flex gap-3">
                  {/* Emoji icon */}
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                    {item.productEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.productName}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="text-xs bg-white text-text-light px-2 py-0.5 rounded-full border border-gray-200">
                        {item.format}
                      </span>
                      <span className="text-xs bg-white text-text-light px-2 py-0.5 rounded-full border border-gray-200">
                        {item.quantity.toLocaleString('fr-FR')} ex.
                      </span>
                      {item.paper && (
                        <span className="text-xs bg-white text-text-light px-2 py-0.5 rounded-full border border-gray-200">
                          {item.paper}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold text-ocean">
                        {item.totalPrice.toFixed(2).replace('.', ',')} €
                      </p>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="text-xs text-coral hover:text-coral-dark transition-colors font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-3">
            {/* Delivery note */}
            <div className="flex items-center gap-2 text-xs text-text-light bg-ocean/5 rounded-xl px-3 py-2">
              <span>✈️</span>
              <span>Livraison aérienne DOM-COM calculée à l&apos;étape suivante</span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between font-bold text-lg">
              <span>Total TTC</span>
              <span className="text-ocean text-2xl">{totalPrice.toFixed(2).replace('.', ',')} €</span>
            </div>

            {/* CTA buttons */}
            <Link
              href="/panier"
              onClick={closeCart}
              className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold py-4 rounded-xl transition-colors text-base shadow-lg"
            >
              Commander →
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-sm font-medium text-text-light hover:text-text py-1 transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
