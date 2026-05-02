import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Réduction IR-PME : investir au capital de PME | RécupMesEuros",
  description:
    "Guide complet sur la réduction d'impôt Madelin (IR-PME) : 25% de réduction, plafonds, FCPI/FIP, case 7CF, conditions et justificatifs.",
};

export default function GuideInvestissementPME() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Réduction d&apos;impôt IR-PME : investir au capital d&apos;une PME
          </h1>

          <p className="text-text-light mb-8 text-lg">
            La souscription au capital de PME ouvre droit à une <strong>réduction d&apos;impôt de 25%</strong> du montant investi. Un dispositif puissant pour réduire votre impôt tout en soutenant l&apos;économie réelle.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Le principe</h2>
            <p className="text-text-light mb-4">
              Vous souscrivez au capital d&apos;une PME éligible (directement ou via un fonds FCPI/FIP). L&apos;État vous accorde une <strong>réduction d&apos;impôt de 25%</strong> du montant souscrit.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Exemple :</strong> Investissement de 10 000 € → réduction d&apos;impôt de <strong>2 500 €</strong>.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Plafonds</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 space-y-2">
              <p className="text-text-light"><strong>Célibataire :</strong> 50 000 € de versements → 12 500 € de réduction max</p>
              <p className="text-text-light"><strong>Couple :</strong> 100 000 € de versements → 25 000 € de réduction max</p>
              <p className="text-sm text-text-lighter mt-2">L&apos;excédent est reportable sur les 4 années suivantes.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Conditions</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>PME de moins de 250 salariés et moins de 50 M€ de CA</li>
              <li>Souscription en numéraire (pas d&apos;apport en nature)</li>
              <li>Conservation des titres pendant <strong>5 ans minimum</strong></li>
              <li>La PME doit exercer une activité commerciale, industrielle, artisanale ou libérale</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Case à remplir</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-mono text-primary text-lg font-bold mb-1">7CF</p>
              <p className="text-text-light text-sm">Formulaire 2042-RICI — Souscription au capital de PME non cotées</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Justificatifs</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Attestation de souscription au capital de la PME (formulaire spécifique)</li>
              <li>Relevé de souscription du fonds FCPI/FIP si applicable</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.service-public.fr/particuliers/vosdroits/F35549" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">service-public.fr — Réduction IR-PME →</a></li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">Vérifiez toutes vos réductions possibles</h2>
            <p className="text-blue-100 mb-6">Notre analyse détecte automatiquement les avantages fiscaux auxquels vous avez droit.</p>
            <Link href="/questionnaire" className="inline-block bg-accent hover:bg-accent-light text-gray-900 font-bold px-8 py-3 rounded-xl shadow-lg transition-all">
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
