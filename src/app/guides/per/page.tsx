import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "PER : déduction fiscale des versements | RécupMesEuros",
  description:
    "Guide complet sur la déduction fiscale des versements PER : plafonds, TMI, cases 6NS/6NT/6NU, stratégie d'optimisation et justificatifs.",
};

export default function GuidePER() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            PER : déduire ses versements de l&apos;impôt sur le revenu
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Le <strong>Plan Épargne Retraite (PER)</strong> permet de déduire vos versements
            volontaires de votre revenu imposable. Plus votre TMI est élevée, plus l&apos;économie est importante.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Le principe</h2>
            <p className="text-text-light mb-4">
              Les versements volontaires sur un PER individuel sont <strong>déductibles</strong> de votre
              revenu net global. C&apos;est une <em>déduction</em>, pas un crédit d&apos;impôt : l&apos;économie
              réelle dépend de votre tranche marginale d&apos;imposition (TMI).
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Exemple :</strong> Vous versez 5 000 € sur votre PER et votre TMI est à 30%.
                Économie d&apos;impôt = 5 000 × 30% = <strong>1 500 €</strong>.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Plafonds de déduction</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 space-y-3">
              <p className="text-text-light">
                <strong>Salariés :</strong> 10% des revenus professionnels nets de l&apos;année précédente,
                dans la limite de <strong>35 194 €</strong> (10% de 8 × PASS 2025).
              </p>
              <p className="text-text-light">
                <strong>Plancher :</strong> minimum <strong>4 399 €</strong> même sans revenu d&apos;activité.
              </p>
              <p className="text-text-light">
                <strong>Report :</strong> le plafond non utilisé des 3 années précédentes est reportable.
                Votre plafond disponible figure sur votre dernier avis d&apos;imposition (ligne « Plafond épargne retraite »).
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Économie selon votre TMI</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-3 font-semibold">TMI</th>
                    <th className="text-left p-3 font-semibold">Versement 3 000 €</th>
                    <th className="text-left p-3 font-semibold">Versement 10 000 €</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3 font-mono">11%</td><td className="p-3 text-secondary font-bold">330 €</td><td className="p-3 text-secondary font-bold">1 100 €</td></tr>
                  <tr><td className="p-3 font-mono">30%</td><td className="p-3 text-secondary font-bold">900 €</td><td className="p-3 text-secondary font-bold">3 000 €</td></tr>
                  <tr><td className="p-3 font-mono">41%</td><td className="p-3 text-secondary font-bold">1 230 €</td><td className="p-3 text-secondary font-bold">4 100 €</td></tr>
                  <tr><td className="p-3 font-mono">45%</td><td className="p-3 text-secondary font-bold">1 350 €</td><td className="p-3 text-secondary font-bold">4 500 €</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases à remplir</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-3 font-semibold">Case</th>
                    <th className="text-left p-3 font-semibold">Déclarant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-3 font-mono text-primary">6NS</td><td className="p-3 text-text-light">Déclarant 1 — PER individuel</td></tr>
                  <tr><td className="p-3 font-mono text-primary">6NT</td><td className="p-3 text-text-light">Déclarant 2 — PER individuel</td></tr>
                  <tr><td className="p-3 font-mono text-primary">6NU</td><td className="p-3 text-text-light">Personne à charge — PER individuel</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-text-lighter mt-2">Formulaire 2042, rubrique « Charges déductibles — Épargne retraite ».</p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Justificatifs</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Attestation fiscale de l&apos;organisme gestionnaire du PER</li>
              <li>Dernier avis d&apos;imposition (pour vérifier le plafond disponible)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Points d&apos;attention</h2>
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Fiscalité à la sortie :</strong> les sommes seront imposées au moment de la retraite.
                  Le PER est avantageux si votre TMI à la sortie est inférieure à votre TMI actuelle.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Option de non-déduction :</strong> vous pouvez choisir de ne pas déduire les versements
                  à l&apos;entrée. Dans ce cas, la sortie en capital sera exonérée d&apos;IR.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.service-public.fr/particuliers/vosdroits/F34982" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">service-public.fr — PER →</a></li>
              <li><a href="https://www.impots.gouv.fr/particulier/questions/je-souhaite-deduire-les-cotisations-versees-au-titre-de-lepargne-retraite" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">impots.gouv.fr — Épargne retraite →</a></li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">Calculez votre TMI et l&apos;économie PER</h2>
            <p className="text-blue-100 mb-6">Notre simulateur calcule votre tranche marginale en quelques secondes.</p>
            <Link href="/simulateurs/tmi" className="inline-block bg-accent hover:bg-accent-light text-gray-900 font-bold px-8 py-3 rounded-xl shadow-lg transition-all">
              Calculer ma TMI
            </Link>
          </section>

          <Disclaimer />
        </article>
      </main>
      <Footer />
    </>
  );
}
