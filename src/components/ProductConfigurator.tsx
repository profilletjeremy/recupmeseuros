'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Props {
  prescriptIframeUrl: string;
  defaultQuantity: number;
  productName: string;
}

export default function ProductConfigurator({ prescriptIframeUrl, productName }: Props) {
  const [configCode, setConfigCode] = useState<string | null>(null);
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

  const contactHref = configCode
    ? `/contact?produit=${encodeURIComponent(productName)}&code=${encodeURIComponent(configCode)}`
    : `/contact?produit=${encodeURIComponent(productName)}`;

  return (
    <div className="space-y-4">
      {/* Préscript iFrame configurator — handles options, visual preview and live pricing */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <iframe
          ref={iframeRef}
          src={prescriptIframeUrl}
          className="w-full"
          style={{ minHeight: 720, border: 'none' }}
          title={`Configurateur ${productName}`}
          allow="same-origin"
        />
      </div>

      {/* CTA */}
      <Link
        href={contactHref}
        className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl"
      >
        {configCode ? 'Commander / Demander un devis' : 'Demander un devis gratuit'}
      </Link>
      <p className="text-center text-xs text-text-lighter">
        Configurez vos options ci-dessus — le prix s&apos;affiche en direct. Notre équipe vous répond sous 24h.
      </p>
    </div>
  );
}
