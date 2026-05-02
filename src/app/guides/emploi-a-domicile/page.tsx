import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Cr\u00e9dit d\u2019imp\u00f4t emploi \u00e0 domicile : tout savoir | R\u00e9cupMesEuros",
  description:
    "Guide complet sur le cr\u00e9dit d\u2019imp\u00f4t de 50\u00a0% pour l\u2019emploi \u00e0 domicile : services \u00e9ligibles, plafonds, cases 7DB/7DL/7DQ du formulaire 2042-RICI, CESU et justificatifs.",
};

export default function GuideEmploiADomicile() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Cr\u00e9dit d&apos;imp\u00f4t emploi \u00e0 domicile : tout savoir
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Vous faites appel \u00e0 une aide m\u00e9nag\u00e8re, un jardinier ou du soutien
            scolaire ? Vous avez droit \u00e0 un <strong>cr\u00e9dit d&apos;imp\u00f4t de 50&nbsp;%</strong>{" "}
            des sommes d\u00e9pens\u00e9es, que vous soyez imposable ou non.
          </p>

          {/* Principe */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Le principe : 50&nbsp;% rembours\u00e9s</h2>
            <p className="text-text-light mb-4">
              L&apos;\u00c9tat accorde un <strong>cr\u00e9dit d&apos;imp\u00f4t</strong> \u00e9gal \u00e0 50&nbsp;% des
              d\u00e9penses engag\u00e9es pour des services \u00e0 la personne r\u00e9alis\u00e9s \u00e0 votre domicile.
              Contrairement \u00e0 une r\u00e9duction d&apos;imp\u00f4t, si le cr\u00e9dit d\u00e9passe votre imp\u00f4t,
              le Tr\u00e9sor public vous rembourse la diff\u00e9rence.
            </p>
          </section>

          {/* Services \u00e9ligibles */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Services \u00e9ligibles</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li><strong>M\u00e9nage et repassage</strong> \u2014 entretien courant du domicile</li>
              <li><strong>Jardinage</strong> \u2014 petits travaux, tonte, taille (plafond sp\u00e9cifique de 5&nbsp;000&nbsp;\u20ac)</li>
              <li><strong>Garde d&apos;enfant \u00e0 domicile</strong> \u2014 baby-sitting, sortie d&apos;\u00e9cole</li>
              <li><strong>Soutien scolaire</strong> \u2014 cours particuliers \u00e0 domicile</li>
              <li><strong>Assistance informatique</strong> \u2014 d\u00e9pannage, initiation (plafond de 3&nbsp;000&nbsp;\u20ac)</li>
              <li><strong>Petit bricolage</strong> \u2014 petits travaux ponctuels (plafond de 500&nbsp;\u20ac/an)</li>
              <li><strong>Aide aux personnes \u00e2g\u00e9es ou handicap\u00e9es</strong> \u2014 aide \u00e0 la mobilit\u00e9, aux repas, etc.</li>
            </ul>
          </section>

          {/* Plafonds */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Plafonds de d\u00e9penses</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 mb-4">
              <p className="font-semibold mb-2">Plafond g\u00e9n\u00e9ral : 12&nbsp;000&nbsp;\u20ac/an</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text-light">
                <li>+&nbsp;1&nbsp;500&nbsp;\u20ac par enfant \u00e0 charge (ou membre du foyer de plus de 65 ans)</li>
                <li>Maximum port\u00e9 \u00e0 <strong>15&nbsp;000&nbsp;\u20ac</strong> (20&nbsp;000&nbsp;\u20ac si un membre du foyer est titulaire d&apos;une carte d&apos;invalidit\u00e9)</li>
              </ul>
            </div>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Sous-plafonds sp\u00e9cifiques</p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-text-light">
                <li>Jardinage : 5&nbsp;000&nbsp;\u20ac</li>
                <li>Assistance informatique : 3&nbsp;000&nbsp;\u20ac</li>
                <li>Petit bricolage : 500&nbsp;\u20ac (2h max par intervention)</li>
              </ul>
            </div>
            <p className="text-sm text-text-lighter mt-3">
              Le cr\u00e9dit d&apos;imp\u00f4t maximal est donc de <strong>6&nbsp;000&nbsp;\u20ac</strong> (50&nbsp;% de 12&nbsp;000&nbsp;\u20ac) et peut atteindre 10&nbsp;000&nbsp;\u20ac dans certains cas.
            </p>
          </section>

          {/* Cases */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases \u00e0 remplir (2042-RICI)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-3 font-semibold">Case</th>
                    <th className="text-left p-3 font-semibold">Situation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 font-mono text-primary">7DB</td>
                    <td className="p-3 text-text-light">Sommes vers\u00e9es pour l&apos;emploi d&apos;un salari\u00e9 \u00e0 domicile (actifs)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">7DL</td>
                    <td className="p-3 text-text-light">Nombre d&apos;ascendants b\u00e9n\u00e9ficiaires de l&apos;APA</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">7DQ</td>
                    <td className="p-3 text-text-light">Emploi \u00e0 domicile : 1\u00e8re ann\u00e9e (plafond major\u00e9 \u00e0 15&nbsp;000&nbsp;\u20ac)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Justificatifs */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Justificatifs \u00e0 conserver</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Attestation annuelle de l&apos;<strong>URSSAF</strong> ou du <strong>CESU</strong></li>
              <li>Factures des organismes agr\u00e9\u00e9s de services \u00e0 la personne</li>
              <li>Bulletins de salaire si emploi direct</li>
            </ul>
            <p className="text-sm text-text-lighter mt-3">
              Conservez ces documents pendant <strong>3 ans</strong> en cas de contr\u00f4le fiscal.
            </p>
          </section>

          {/* CESU / URSSAF */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">CESU et URSSAF : simplifier vos d\u00e9marches</h2>
            <p className="text-text-light mb-4">
              Le <strong>CESU (Ch\u00e8que Emploi Service Universel)</strong> simplifie la d\u00e9claration
              de votre employ\u00e9 \u00e0 domicile. L&apos;URSSAF calcule automatiquement les
              cotisations et g\u00e9n\u00e8re l&apos;attestation fiscale en fin d&apos;ann\u00e9e.
              Depuis 2022, le dispositif <strong>CESU+</strong> permet le pr\u00e9l\u00e8vement direct
              et l&apos;avance imm\u00e9diate du cr\u00e9dit d&apos;imp\u00f4t.
            </p>
          </section>

          {/* Sources */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.impots.gouv.fr/particulier/emploi-domicile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  impots.gouv.fr \u2014 Emploi \u00e0 domicile \u2192
                </a>
              </li>
              <li>
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr \u2014 Cr\u00e9dit d&apos;imp\u00f4t services \u00e0 la personne \u2192
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              V\u00e9rifiez si vous passez \u00e0 c\u00f4t\u00e9 de ce cr\u00e9dit d&apos;imp\u00f4t
            </h2>
            <p className="text-blue-100 mb-6">
              R\u00e9pondez \u00e0 quelques questions et d\u00e9couvrez les cases \u00e0 remplir.
            </p>
            <Link
              href="/questionnaire"
              className="inline-block bg-accent hover:bg-accent-light text-gray-900 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Commencer le questionnaire gratuit
            </Link>
          </section>

          <Disclaimer />
        </article>
      </main>
      <Footer />
    </>
  );
}
