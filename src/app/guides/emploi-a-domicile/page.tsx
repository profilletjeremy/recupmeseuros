import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Cr\u00e9dit d\u2019imp\u00f4t emploi \u00e0 domicile 2026 : guide pratique | R\u00e9cupMesEuros",
  description:
    "Guide complet sur le cr\u00e9dit d\u2019imp\u00f4t de 50\u00a0% pour l\u2019emploi \u00e0 domicile : services \u00e9ligibles, plafonds, cases 7DB/7DL/7DQ du formulaire 2042-RICI, CESU et justificatifs.",
};

export default function GuideEmploiADomicile() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Emploi \u00e0 domicile : r\u00e9cup\u00e9rez 50% en cr\u00e9dit d&apos;imp\u00f4t
          </h1>

          <p className="text-text-light text-lg mb-8">
            Femme de m\u00e9nage, jardinier, soutien scolaire, aide \u00e0 domicile... L&apos;\u00c9tat
            vous rembourse <strong>la moiti\u00e9 de ce que vous d\u00e9pensez</strong>, m\u00eame si vous
            ne payez pas d&apos;imp\u00f4t.
          </p>

          {/* ─── R\u00e9sum\u00e9 en 30 secondes ─── */}
          <div className="bg-white rounded-2xl border-2 border-primary/20 p-6 mb-10">
            <h2 className="text-lg font-bold text-primary mb-4">En 30 secondes</h2>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-primary/5 rounded-xl p-4">
                <p className="text-3xl font-bold text-primary">50%</p>
                <p className="text-sm text-text-light mt-1">de cr\u00e9dit d&apos;imp\u00f4t</p>
              </div>
              <div className="bg-primary/5 rounded-xl p-4">
                <p className="text-3xl font-bold text-primary">12 000 \u20ac</p>
                <p className="text-sm text-text-light mt-1">plafond de d\u00e9penses/an</p>
              </div>
              <div className="bg-primary/5 rounded-xl p-4">
                <p className="text-3xl font-bold text-primary">6 000 \u20ac</p>
                <p className="text-sm text-text-light mt-1">cr\u00e9dit maximum</p>
              </div>
            </div>
            <p className="text-sm text-text-lighter mt-4 text-center">
              Cr\u00e9dit d&apos;imp\u00f4t = rembours\u00e9 m\u00eame si vous ne payez pas d&apos;imp\u00f4t (contrairement \u00e0 une r\u00e9duction).
            </p>
          </div>

          {/* ─── Comment \u00e7a marche ─── */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Comment \u00e7a marche concr\u00e8tement ?</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold">1</span>
                <div>
                  <h3 className="font-bold">Vous payez un service \u00e0 domicile</h3>
                  <p className="text-text-light text-sm">Directement (CESU) ou via un organisme agr\u00e9\u00e9.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold">2</span>
                <div>
                  <h3 className="font-bold">Vous d\u00e9clarez le montant en case 7DB</h3>
                  <p className="text-text-light text-sm">Sur le formulaire 2042-RICI, lors de votre d\u00e9claration de revenus.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-bold">3</span>
                <div>
                  <h3 className="font-bold">L&apos;\u00c9tat vous rembourse 50%</h3>
                  <p className="text-text-light text-sm">Vers\u00e9 sur votre compte en septembre, ou d\u00e9duit de votre imp\u00f4t.</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
              <p className="text-sm text-green-800">
                <strong>Exemple :</strong> Vous payez 200 \u20ac/mois de m\u00e9nage = 2 400 \u20ac/an.
                Cr\u00e9dit d&apos;imp\u00f4t = <strong>1 200 \u20ac rembours\u00e9s</strong>.
              </p>
            </div>
          </section>

          {/* ─── Services \u00e9ligibles ─── */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Quels services sont \u00e9ligibles ?</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { icon: "🧹", title: "M\u00e9nage et repassage", plafond: "12 000 \u20ac" },
                { icon: "🌿", title: "Jardinage", plafond: "5 000 \u20ac" },
                { icon: "👶", title: "Garde d'enfant \u00e0 domicile", plafond: "12 000 \u20ac" },
                { icon: "📚", title: "Soutien scolaire", plafond: "12 000 \u20ac" },
                { icon: "💻", title: "Assistance informatique", plafond: "3 000 \u20ac" },
                { icon: "🔧", title: "Petit bricolage", plafond: "500 \u20ac" },
                { icon: "🧑\u200d🦳", title: "Aide personne \u00e2g\u00e9e/handicap\u00e9e", plafond: "12 000 \u20ac" },
                { icon: "🍳", title: "Pr\u00e9paration de repas", plafond: "12 000 \u20ac" },
              ].map((s) => (
                <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="text-xs text-text-lighter">Plafond : {s.plafond}/an</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Cases \u00e0 remplir ─── */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Quelle case remplir sur votre d\u00e9claration ?</h2>
            <div className="bg-white rounded-xl border-2 border-primary/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-primary/5">
                  <tr>
                    <th className="text-left p-4 font-bold text-primary">Case</th>
                    <th className="text-left p-4 font-bold text-primary">Quand l&apos;utiliser</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-4">
                      <span className="font-mono text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">7DB</span>
                    </td>
                    <td className="p-4 text-text-light">
                      <strong>La case principale.</strong> Indiquez le total des sommes vers\u00e9es pour l&apos;emploi d&apos;un salari\u00e9 \u00e0 domicile.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">
                      <span className="font-mono text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">7DL</span>
                    </td>
                    <td className="p-4 text-text-light">
                      Nombre d&apos;ascendants b\u00e9n\u00e9ficiaires de l&apos;APA (augmente le plafond).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">
                      <span className="font-mono text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">7DQ</span>
                    </td>
                    <td className="p-4 text-text-light">
                      Cochez si c&apos;est votre <strong>1\u00e8re ann\u00e9e</strong> d&apos;emploi \u00e0 domicile (plafond major\u00e9 \u00e0 15 000 \u20ac).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-lighter mt-2">
              Formulaire : <strong>2042-RICI</strong> (R\u00e9ductions et Cr\u00e9dits d&apos;Imp\u00f4t). \u00c0 cocher dans les annexes de votre d\u00e9claration en ligne.
            </p>
          </section>

          {/* ─── Plafonds d\u00e9taill\u00e9s ─── */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Les plafonds en d\u00e9tail</h2>
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold mb-2">Plafond g\u00e9n\u00e9ral : 12 000 \u20ac/an</h3>
                <ul className="text-sm text-text-light space-y-1">
                  <li>+ 1 500 \u20ac par enfant \u00e0 charge ou membre du foyer &gt; 65 ans</li>
                  <li>+ 1 500 \u20ac par ascendant b\u00e9n\u00e9ficiaire de l&apos;APA</li>
                  <li>Maximum : <strong>15 000 \u20ac</strong> (ou 20 000 \u20ac si carte d&apos;invalidit\u00e9)</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold mb-2">Sous-plafonds sp\u00e9cifiques</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-surface rounded-lg p-3">
                    <p className="font-bold text-primary">5 000 \u20ac</p>
                    <p className="text-xs text-text-lighter">Jardinage</p>
                  </div>
                  <div className="bg-surface rounded-lg p-3">
                    <p className="font-bold text-primary">3 000 \u20ac</p>
                    <p className="text-xs text-text-lighter">Informatique</p>
                  </div>
                  <div className="bg-surface rounded-lg p-3">
                    <p className="font-bold text-primary">500 \u20ac</p>
                    <p className="text-xs text-text-lighter">Bricolage</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Justificatifs ─── */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Quels justificatifs garder ?</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <ul className="space-y-3">
                {[
                  { doc: "Attestation annuelle URSSAF ou CESU", detail: "G\u00e9n\u00e9r\u00e9e automatiquement en f\u00e9vrier" },
                  { doc: "Factures des organismes agr\u00e9\u00e9s", detail: "Si vous passez par une soci\u00e9t\u00e9 de services" },
                  { doc: "Bulletins de salaire", detail: "Si emploi direct (sans CESU)" },
                ].map((j) => (
                  <li key={j.doc} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <div>
                      <p className="text-sm font-medium text-amber-900">{j.doc}</p>
                      <p className="text-xs text-amber-700">{j.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-amber-600 mt-3">
                Conservez tout pendant <strong>3 ans</strong> en cas de contr\u00f4le fiscal.
              </p>
            </div>
          </section>

          {/* ─── CESU / URSSAF ─── */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">CESU+ : le plus simple</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-text-light mb-3">
                Le <strong>CESU+</strong> (Ch\u00e8que Emploi Service Universel) est la solution la plus simple :
              </p>
              <ul className="space-y-2 text-sm text-text-light">
                <li className="flex gap-2">
                  <span className="text-green-500 font-bold">&#10003;</span>
                  L&apos;URSSAF calcule automatiquement les cotisations
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500 font-bold">&#10003;</span>
                  L&apos;attestation fiscale est g\u00e9n\u00e9r\u00e9e en f\u00e9vrier
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500 font-bold">&#10003;</span>
                  <strong>Avance imm\u00e9diate</strong> du cr\u00e9dit d&apos;imp\u00f4t (vous ne payez que la moiti\u00e9 chaque mois)
                </li>
              </ul>
              <a
                href="https://www.cesu.urssaf.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-primary font-medium hover:underline"
              >
                S&apos;inscrire sur cesu.urssaf.fr &#8594;
              </a>
            </div>
          </section>

          {/* ─── Sources ─── */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">Sources officielles</h2>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.impots.gouv.fr/particulier/emploi-domicile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                impots.gouv.fr &#8212; Emploi \u00e0 domicile &#8594;
              </a>
              <a
                href="https://www.service-public.fr/particuliers/vosdroits/F12"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                service-public.fr &#8212; Cr\u00e9dit d&apos;imp\u00f4t services \u00e0 la personne &#8594;
              </a>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Vous avez d&apos;autres avantages fiscaux \u00e0 r\u00e9cup\u00e9rer ?
            </h2>
            <p className="text-blue-100 mb-6">
              Notre questionnaire analyse votre situation compl\u00e8te en 3 minutes.
            </p>
            <Link
              href="/questionnaire"
              className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Analyser ma situation &#8212; Gratuit
            </Link>
          </section>

          <Disclaimer />
        </article>
      </main>
      <Footer />
    </>
  );
}
