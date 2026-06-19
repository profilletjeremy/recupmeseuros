'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PanierPage() {
  const { items, removeItem, clearCart, totalPrice } = useCart();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <Header />
      <main className="flex-1 bg-sand min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-2">Mon panier</h1>
          <p className="text-text-light text-sm mb-8">
            {items.length === 0 ? 'Votre panier est vide.' : `${items.length} article${items.length > 1 ? 's' : ''} — ${totalItems.toLocaleString('fr-FR')} exemplaires`}
          </p>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-xl font-bold mb-3">Votre panier est vide</h2>
              <p className="text-text-light mb-8">Découvrez nos produits d&apos;impression professionnels livrés dans tous les DOM-COM.</p>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-ocean text-white font-bold px-8 py-3.5 rounded-xl hover:bg-ocean-dark transition-colors"
              >
                Voir les produits →
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.cartId} className="bg-white rounded-2xl p-5 shadow-sm flex gap-4">
                    <div className="w-16 h-16 bg-sand rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                      {item.productEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold">{item.productName}</p>
                          <Link
                            href={`/produits/${item.productSlug}`}
                            className="text-xs text-ocean hover:underline"
                          >
                            Modifier la configuration
                          </Link>
                        </div>
                        <button
                          onClick={() => removeItem(item.cartId)}
                          className="text-gray-400 hover:text-coral transition-colors flex-shrink-0 mt-0.5"
                          aria-label="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-sand text-text-light px-2.5 py-1 rounded-full">
                          Format : {item.format}
                        </span>
                        <span className="text-xs bg-sand text-text-light px-2.5 py-1 rounded-full">
                          Qté : {item.quantity.toLocaleString('fr-FR')} ex.
                        </span>
                        {item.paper && (
                          <span className="text-xs bg-sand text-text-light px-2.5 py-1 rounded-full">
                            {item.paper}
                          </span>
                        )}
                        {item.finish && item.finish !== item.paper && (
                          <span className="text-xs bg-sand text-text-light px-2.5 py-1 rounded-full">
                            {item.finish}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-text-lighter">
                          {(item.unitPrice).toFixed(3).replace('.', ',')} €/ex.
                        </p>
                        <p className="font-bold text-ocean text-lg">
                          {item.totalPrice.toFixed(2).replace('.', ',')} €
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={clearCart}
                    className="text-sm text-text-light hover:text-coral transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Vider le panier
                  </button>
                  <Link href="/produits" className="text-sm text-ocean font-medium hover:underline">
                    ← Continuer mes achats
                  </Link>
                </div>
              </div>

              {/* Order summary */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-lg mb-5">Récapitulatif</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-light">Sous-total ({items.length} article{items.length > 1 ? 's' : ''})</span>
                      <span className="font-medium">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-light">Livraison aérienne</span>
                      <span className="text-palm font-medium">Calculée à l&apos;étape suivante</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 font-bold text-base">
                      <span>Total TTC</span>
                      <span className="text-ocean text-2xl">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="mt-6 block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold py-4 rounded-xl transition-colors shadow-md text-base"
                  >
                    Finaliser la commande →
                  </Link>

                  <p className="text-center text-xs text-text-lighter mt-3">
                    Paiement sécurisé • Devis confirmé sous 24h
                  </p>
                </div>

                {/* Trust block */}
                <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                  {[
                    { icon: '✓', text: 'Vérification de fichier offerte' },
                    { icon: '✈️', text: 'Livraison aérienne sécurisée' },
                    { icon: '🔒', text: 'Paiement sécurisé' },
                    { icon: '↩️', text: 'Garantie qualité — réimpression si défaut' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 text-sm text-text-light">
                      <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
