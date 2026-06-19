import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Demandez un devis',
  description:
    'Contactez l\'équipe KaribPrint pour un devis d\'impression. Réponse garantie sous 24h.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
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
              Demandez un devis, posez vos questions ou envoyez-nous votre fichier. Notre équipe
              vous répond sous 24h ouvrées.
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
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-palm" />
                    <span>Devis : sous 24h ouvrées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-palm" />
                    <span>Vérification fichier : 4h max</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-palm" />
                    <span>Support technique : immédiat</span>
                  </div>
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
                  Résolution minimum 300 dpi — Mode couleur CMJN recommandé — Fonds perdus 3mm
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
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
                    <label className="block text-sm font-semibold mb-1.5">Votre message / détails du projet *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Décrivez votre projet : quantité souhaitée, format, délai, format de fichier disponible..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors resize-y"
                    />
                  </div>

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
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
