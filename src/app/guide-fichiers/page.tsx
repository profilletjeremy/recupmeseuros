import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guide de préparation de fichiers — KaribPrint',
  description: 'Comment préparer vos fichiers pour l\'impression : résolution, fond perdu, mode couleur CMJN, formats acceptés. Guide complet KaribPrint.',
};

const CHECKLIST = [
  { ok: true, label: 'Résolution 300 dpi minimum à la taille finale' },
  { ok: true, label: 'Mode couleur CMJN (pas RVB)' },
  { ok: true, label: 'Fonds perdus de 3 mm de chaque côté' },
  { ok: true, label: 'Zone de sécurité : textes et éléments importants à 3 mm du bord' },
  { ok: true, label: 'Textes convertis en courbes (ou polices incorporées)' },
  { ok: true, label: 'Fichier enregistré en PDF haute résolution (PDF/X-4 ou PDF/X-1a)' },
  { ok: true, label: 'Vérification orthographique effectuée' },
];

export default function GuideFichiersPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Header */}
        <div className="bg-sand border-b border-sand-dark py-10">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="text-sm text-text-light mb-4">
              <Link href="/" className="hover:text-ocean">Accueil</Link>
              <span className="mx-2">/</span>
              <span>Guide fichiers</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Guide de préparation de fichiers
            </h1>
            <p className="text-text-light max-w-xl">
              Préparez correctement vos fichiers pour obtenir une impression parfaite.
              Suivez ce guide étape par étape.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

          {/* Formats acceptés */}
          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Formats de fichier acceptés</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { ext: 'PDF', desc: 'Recommandé — PDF/X-4 ou PDF/X-1a', star: true },
                { ext: 'AI', desc: 'Adobe Illustrator CS3+', star: false },
                { ext: 'EPS', desc: 'Encapsulated PostScript', star: false },
                { ext: 'PSD', desc: 'Adobe Photoshop (calques aplatis)', star: false },
                { ext: 'TIFF', desc: 'Image non compressée', star: false },
                { ext: 'INDD', desc: 'Adobe InDesign (avec liens)', star: false },
              ].map((f) => (
                <div
                  key={f.ext}
                  className={`rounded-2xl p-4 border-2 ${f.star ? 'border-ocean bg-ocean/5' : 'border-gray-100 bg-sand'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold text-sm px-2 py-0.5 rounded-lg ${f.star ? 'bg-ocean text-white' : 'bg-white text-ocean border border-ocean/30'}`}>
                      .{f.ext.toLowerCase()}
                    </span>
                    {f.star && <span className="text-xs text-ocean font-semibold">★ Idéal</span>}
                  </div>
                  <p className="text-xs text-text-light">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Résolution */}
          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Résolution</h2>
            <div className="bg-sand rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-xl bg-palm/20 text-palm font-bold flex items-center justify-center text-sm flex-shrink-0">300</span>
                <div>
                  <p className="font-semibold text-sm">300 dpi — Standard (recommandé)</p>
                  <p className="text-sm text-text-light mt-1">Pour tous les petits et moyens formats : cartes de visite, flyers, affiches jusqu&apos;à A2. La résolution doit être de 300 dpi à la taille d&apos;impression finale.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-xl bg-sun/30 text-dark font-bold flex items-center justify-center text-sm flex-shrink-0">150</span>
                <div>
                  <p className="font-semibold text-sm">150 dpi — Grand format</p>
                  <p className="text-sm text-text-light mt-1">Pour les très grands formats (A1, A0, banderoles) vus de loin. Une résolution de 150 dpi à la taille finale est généralement suffisante.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-xl bg-coral/20 text-coral font-bold flex items-center justify-center text-sm flex-shrink-0">72</span>
                <div>
                  <p className="font-semibold text-sm">72 dpi — À éviter</p>
                  <p className="text-sm text-text-light mt-1">La résolution des images issues du web (72 dpi) est insuffisante pour l&apos;impression. Résultat : image floue ou pixelisée.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Fond perdu */}
          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Fond perdu (Bleed)</h2>
            <div className="bg-sand rounded-2xl p-6">
              <p className="text-sm text-text-light mb-4">
                Le fond perdu est une extension de 3mm de chaque côté du document. Il compense les légères imprécisions de découpe et évite les liserés blancs sur les bords.
              </p>
              <div className="bg-white rounded-xl p-5 font-mono text-xs text-center border-2 border-dashed border-coral mb-4">
                <div className="text-coral text-[10px] mb-1">← Fond perdu 3mm →</div>
                <div className="border-2 border-ocean mx-6 p-4 rounded">
                  <div className="text-ocean text-[10px] mb-1">Zone sécurité 3mm</div>
                  <div className="border border-dashed border-gray-300 p-3 text-center text-gray-400 text-[10px]">
                    Zone utile<br />(votre contenu)
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Exemple pour un flyer A5 (148×210 mm) :</strong></p>
                <ul className="text-text-light space-y-1 text-xs">
                  <li>• Taille du document : <strong>154×216 mm</strong> (+ 3mm de chaque côté)</li>
                  <li>• Le fond (couleur ou image) doit s&apos;étendre jusqu&apos;aux bords du document</li>
                  <li>• Textes et éléments importants : au moins 3mm du bord final (zone de sécurité)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mode couleur */}
          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Mode couleur</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-palm/10 border-2 border-palm rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">✅</span>
                  <span className="font-bold text-palm">CMJN (CMYK)</span>
                </div>
                <p className="text-sm text-text-light">
                  Mode couleur de l&apos;impression professionnelle. Cyan, Magenta, Jaune, Noir.
                  <strong> Utilisez toujours ce mode pour vos fichiers.</strong>
                </p>
              </div>
              <div className="bg-coral/10 border-2 border-coral rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-bold text-coral">RVB (RGB)</span>
                </div>
                <p className="text-sm text-text-light">
                  Mode couleur des écrans. Utilisé pour le web et les photos numériques.
                  La conversion RVB→CMJN peut entraîner un décalage des couleurs.
                </p>
              </div>
            </div>
            <div className="mt-4 bg-sand rounded-xl p-4 text-sm text-text-light">
              <strong>Noir 100% :</strong> utilisez K=100 (noir d&apos;impression), pas de noir RVB ou de noir composé (CMJN 100/80/80/100) sauf pour de très grandes surfaces noires.
            </div>
          </section>

          {/* Textes en courbes */}
          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Textes en courbes</h2>
            <div className="bg-sand rounded-2xl p-6 text-sm text-text-light space-y-3">
              <p>
                Si les polices de caractères utilisées dans votre document ne sont pas disponibles sur notre système, elles seront remplacées par des polices par défaut. Pour éviter ce problème :
              </p>
              <div className="space-y-2">
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-text mb-1">Adobe Illustrator</p>
                  <p className="font-mono text-xs bg-gray-50 rounded p-2">Sélectionner tout (Ctrl+A) → Texte → Vectoriser</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-text mb-1">Adobe InDesign</p>
                  <p className="text-xs">Exporter en PDF &rarr; Options &gt; Avancées &gt; Incorporer toutes les polices</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-text mb-1">Canva / Figma</p>
                  <p className="text-xs">Exporter en PDF Print — les polices sont automatiquement incorporées</p>
                </div>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section>
            <h2 className="text-xl font-bold text-ocean mb-4">Checklist avant envoi</h2>
            <div className="bg-sand rounded-2xl p-6 space-y-3">
              {CHECKLIST.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-palm/20 text-palm flex items-center justify-center flex-shrink-0 text-sm">
                    ✓
                  </div>
                  <span className="text-sm text-text-light">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/contact"
              className="bg-coral text-white rounded-2xl p-6 text-center hover:bg-coral-dark transition-colors"
            >
              <span className="text-3xl block mb-2">📤</span>
              <p className="font-bold mb-1">Envoyer mon fichier</p>
              <p className="text-sm text-red-200">Demandez un devis et envoyez votre fichier</p>
            </Link>
            <Link
              href="/faq"
              className="bg-ocean text-white rounded-2xl p-6 text-center hover:bg-ocean-dark transition-colors"
            >
              <span className="text-3xl block mb-2">❓</span>
              <p className="font-bold mb-1">Questions fréquentes</p>
              <p className="text-sm text-blue-200">Toutes les réponses à vos questions</p>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
