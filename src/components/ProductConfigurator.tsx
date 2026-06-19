'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Props {
  prescriptIframeUrl: string;
  defaultQuantity: number;
  productName: string;
}

interface PriceResult {
  price?: number;
  price_ttc?: number;
  currency?: string;
  error?: string;
}

export default function ProductConfigurator({ prescriptIframeUrl, defaultQuantity, productName }: Props) {
  const [configCode, setConfigCode] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(String(defaultQuantity));
  const [priceData, setPriceData] = useState<PriceResult | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Realisaprint Préscript sends the liaison code via postMessage
      if (typeof event.data === 'string' && event.data.startsWith('code_liaison:')) {
        const code = event.data.replace('code_liaison:', '').trim();
        if (code) setConfigCode(code);
        return;
      }
      // Also handle object-format messages
      if (event.data && typeof event.data === 'object' && event.data.code_liaison) {
        setConfigCode(String(event.data.code_liaison));
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!configCode) return;
    setLoadingPrice(true);
    fetch(`/api/realisaprint/price?code=${encodeURIComponent(configCode)}&quantity=${encodeURIComponent(quantity)}`)
      .then((r) => r.json())
      .then((data: PriceResult) => setPriceData(data))
      .catch(() => setPriceData({ error: 'Erreur lors du calcul du prix' }))
      .finally(() => setLoadingPrice(false));
  }, [configCode, quantity]);

  const contactHref = configCode
    ? `/contact?produit=${encodeURIComponent(productName)}&code=${encodeURIComponent(configCode)}&qty=${encodeURIComponent(quantity)}`
    : '/contact';

  return (
    <div className="space-y-4">
      {/* Préscript iFrame configurator */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <iframe
          ref={iframeRef}
          src={prescriptIframeUrl}
          className="w-full"
          style={{ minHeight: 520, border: 'none' }}
          title={`Configurateur ${productName}`}
          allow="same-origin"
        />
      </div>

      {/* Quantity selector shown after configuration */}
      {configCode && (
        <div>
          <label className="block text-sm font-semibold text-text mb-2">Quantité</label>
          <div className="flex flex-wrap gap-2">
            {['100', '250', '500', '1000', '2500'].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantity(q)}
                className={`border-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  quantity === q ? 'border-ocean bg-ocean/5 text-ocean' : 'border-gray-200 hover:border-ocean/50'
                }`}
              >
                {parseInt(q).toLocaleString('fr-FR')} ex.
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price display */}
      {configCode && (
        <div className="bg-sand rounded-2xl p-5">
          {loadingPrice ? (
            <p className="text-sm text-text-light">Calcul du prix en cours…</p>
          ) : priceData?.error ? (
            <p className="text-sm text-coral">{priceData.error}</p>
          ) : priceData?.price_ttc ? (
            <>
              <p className="text-sm text-text-light mb-1">Prix total TTC</p>
              <p className="text-4xl font-bold text-ocean">
                {Number(priceData.price_ttc).toFixed(2).replace('.', ',')} €
              </p>
              <p className="text-xs text-text-lighter mt-1">Hors frais de livraison</p>
            </>
          ) : (
            <p className="text-sm text-text-light">
              Configuration enregistrée — demandez votre devis pour obtenir le prix.
            </p>
          )}
        </div>
      )}

      {/* CTA */}
      <Link
        href={contactHref}
        className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
      >
        {configCode ? 'Commander / Demander un devis' : 'Demander un devis gratuit'}
      </Link>
      <p className="text-center text-xs text-text-lighter">
        Notre équipe vous répond sous 24h
      </p>
    </div>
  );
}
