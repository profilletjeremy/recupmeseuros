'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ContactContent() {
  const searchParams = useSearchParams();

  const selectedTerritory = searchParams.get('territoire') ?? '';
  const selectedProduct = searchParams.get('produit') ?? '';
  const configCode = searchParams.get('code') ?? '';
  const selectedQty = searchParams.get('qty') ?? '';
  const selectedFormat = searchParams.get('format') ?? '';
  const selectedPaper = searchParams.get('papier') ?? '';
  const selectedFinish = searchParams.get('finition') ?? '';

  const hasConfig = Boolean(selectedProduct || configCode);

  const defaultMessage = selectedProduct
    ? `Bonjour,\n\nJe souhaite commander : ${selectedProduct}${selectedFormat ? ` — Format : ${selectedFormat}` : ''}${selectedQty ? ` — Quantité : ${selectedQty} exemplaires` : ''}${selectedPaper ? ` — Support : ${selectedPaper}` : ''}${selectedFinish ? ` — Finition : ${selectedFinish}` : ''}.${configCode ? `\n\nCode de configuration : ${configCode}` : ''}\n\nMerci de me contacter.`
    : '';

  return (
    <>
      {/* Header */}
      <div className="bg-sand border-b border-sand-dark py-10">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="text-sm text-text-light mb-4">
            <Link href="/" className="hover:text-ocean">Accueil</Link>
            <span className="mx-2">/</span>
            <span>Contact</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contactez-nous</h1>
          <p className="text-text-light max-w-xl">
            {hasConfig
              ? `Votre configuration est prête ! Complétez vos coordonnées et nous vous revenons sous 24h.`
              : 'Demandez un devis, posez vos questions ou envoyez-nous votre fichier. Notre équipe vous répond sous 24h ouvrées.'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Nos coordonnées</h2>
              <div className="space-y-4">
                {[
                  { emoji: '📧', label: 'Email', value: 'contact@karibprint.fr', href: 'mailto:contact@karibprint.fr' },
                  { emoji: '📞', label: 'Téléphone', value: '+590 000 000', href: 'tel:+590000000' },
                  { emoji: '🕐', label: 'Horaires', value: 'Lun–Ven, 8h–18h (heure locale)', href: null },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <p className="text-xs text-text-lighter font-semibold uppercase tracking-wide">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium text-ocean hover:underline">{item.value}</a>
                      ) : (
                        <p className="font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-sand rounded-2xl p-5">
              <h3 className="font-bold mb-3">Délai de réponse</h3>
              <div className="space-y-2 text-sm">
                {[
                  'Devis : sous 24h ouvrées',
                  'Vérification fichier : 4h max',
                  'Support technique : immédiat',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-palm flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ocean/5 border border-ocean/20 rounded-2xl p-5">
              <h3 className="font-bold text-ocean mb-2">Formats de fichier acceptés</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {['PDF', 'AI', 'EPS', 'PSD', 'TIFF', 'INDD'].map((fmt) => (
                  <span key={fmt} className="bg-ocean text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                    .{fmt.toLowerCase()}
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-light mt-3">
                Résolution minimum 300 dpi — Mode couleur CMJN — Fonds perdus 3mm
              </p>
              <Link href="/guide-fichiers" className="text-xs text-ocean font-semibold hover:underline mt-2 block">
                Guide de préparation →
              </Link>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {hasConfig && (
              <div className="bg-palm/10 border border-palm/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-palm text-sm">Votre configuration a été pré-remplie</p>
                  <p className="text-xs text-text-light mt-0.5">
                    Produit : {selectedProduct}{selectedQty && ` — Quantité : ${selectedQty} ex.`}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Envoyer un message / Demander un devis</h2>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jean"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Nom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Dupont"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="jean.dupont@exemple.fr"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Entreprise (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Mon Entreprise SAS"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Territoire de livraison *</label>
                  <select
                    required
                    defaultValue={selectedTerritory}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                  >
                    <option value="">-- Sélectionnez votre île --</option>
                    <option value="GP">Guadeloupe (971)</option>
                    <option value="MQ">Martinique (972)</option>
                    <option value="GF">Guyane (973)</option>
                    <option value="RE">La Réunion (974)</option>
                    <option value="MF">Saint-Martin (978)</option>
                    <option value="BL">Saint-Barthélemy (977)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Produit souhaité *</label>
                  <select
                    required
                    defaultValue={selectedProduct}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                  >
                    <option value="">-- Sélectionnez un produit --</option>
                    <option>Cartes de visite</option>
                    <option>Flyers & Tracts</option>
                    <option>Affiches & Posters</option>
                    <option>Banderoles</option>
                    <option>Roll-up / Kakémono</option>
                    <option>Brochures & Dépliants</option>
                    <option>Papeterie d&apos;entreprise</option>
                    <option>Autocollants & Stickers</option>
                    <option>T-shirts personnalisés</option>
                    <option>Mugs personnalisés</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Votre message / détails du projet *
                  </label>
                  <textarea
                    required
                    rows={5}
                    defaultValue={defaultMessage}
                    placeholder="Décrivez votre projet : quantité souhaitée, format, délai, fichier disponible..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors resize-y"
                  />
                </div>

                {configCode && (
                  <input type="hidden" name="code_realisaprint" value={configCode} />
                )}

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="rgpd" required className="mt-0.5 w-4 h-4 accent-ocean" />
                  <label htmlFor="rgpd" className="text-xs text-text-light leading-relaxed">
                    J&apos;accepte que mes données soient utilisées pour traiter ma demande. Conformément au RGPD,
                    vous pouvez exercer vos droits en nous contactant.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-coral hover:bg-coral-dark text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-base"
                >
                  Envoyer ma demande de devis
                </button>
                <p className="text-center text-xs text-text-lighter">
                  Réponse garantie sous 24h ouvrées • Devis sans engagement
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
