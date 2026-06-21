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
      if (typeof event.data === 'string' && event.data.startsWith('code_liaison:')) {
        const code = event.data.replace('code_liaison:', '').trim();
        if (code) setConfigCode(code);
        return;
      }
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
    <div>
      {/* Préscript iframe — handles gallery, options, and live pricing */}
      <iframe
        ref={iframeRef}
        src={prescriptIframeUrl}
        className="w-full"
        style={{ minHeight: 680, border: 'none', display: 'block' }}
        title={`Configurateur ${productName}`}
        allow="same-origin"
      />

      {/* CTA */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-2.5">
        {configCode && (
          <div className="flex items-center gap-2 bg-palm/10 border border-palm/20 rounded-xl px-4 py-2.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-palm flex-shrink-0" />
            <p className="text-palm font-semibold text-xs">
              Configuration enregistrée — code : <span className="font-black">{configCode}</span>
            </p>
          </div>
        )}
        <Link
          href={contactHref}
          className="block w-full text-center bg-coral hover:bg-coral-dark text-white font-bold text-base py-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          {configCode ? '✓ Commander / Demander un devis' : 'Demander un devis gratuit →'}
        </Link>
        <p className="text-center text-[11px] text-gray-400">
          Configurez vos options ci-dessus · Prix affiché en direct · Réponse sous 24h
        </p>
      </div>
    </div>
  );
}
