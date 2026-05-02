import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Pension alimentaire : que peut-on déduire ? | RécupMesEuros",
  description:
    "Déduction des pensions alimentaires versées aux enfants majeurs (6 674 €) et ascendants : cases 6EL/6EM/6GP/6GU, comparaison avec le rattachement fiscal.",
};

export default function GuidePensionAlimentaire() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Pension alimentaire : que peut-on déduire ?
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Si vous versez une pension alimentaire à un enfant majeur ou à un
            ascendant dans le besoin, cette somme est <strong>déductible de votre
            revenu imposable</strong>. Un avantage souvent méconnu ou mal déclaré.
          </p>

          {/* Enfant majeur */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Pension à un enfant majeur</h2>
            <p className="text-text-light mb-4">
              Vous pouvez déduire la pension versée à un enfant majeur qui n&apos;est plus
              rattaché à votre foyer fiscal, à condition qu&apos;il ne puisse pas subvenir
              seul à ses besoins (étudiant, recherche d&apos;emploi, faibles revenus).
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Plafond de déduction</p>
              <p className="text-sm text-text-light">
                <strong>6&nbsp;674&nbsp;€</strong> par enfant et par an (montant pour les revenus 2025).
                Si l&apos;enfant vit chez vous, vous pouvez déduire un forfait hébergement
                + nourriture de <strong>3&nbsp;968&nbsp;€</strong> sans justificatif, plus les dépenses
                réelles justifiées dans la limite du plafond global.
              </p>
            </div>
            <p className="text-sm text-text-lighter mt-3">
              Attention : l&apos;enfant doit déclarer cette pension dans ses propres revenus.
            </p>
          </section>

          {/* Ascendants */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Pension à un ascendant dans le besoin</h2>
            <p className="text-text-light mb-4">
              Si vous aidez financièrement vos parents ou grands-parents qui ne peuvent
              pas subvenir seuls à leurs besoins, vous pouvez déduire :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-light mb-4">
              <li>Les sommes versées directement (virements, chèques...)</li>
              <li>Les dépenses réglées pour leur compte (loyer, EHPAD, soins...)</li>
              <li>Un <strong>forfait hébergement de 3&nbsp;968&nbsp;€</strong> si l&apos;ascendant vit chez vous (sans justificatif)</li>
            </ul>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Pas de plafond fixe</p>
              <p className="text-sm text-text-light">
                Contrairement à la pension pour enfant majeur, il n&apos;y a <strong>pas de
                plafond légal</strong> pour la déduction des pensions versées aux ascendants.
                Le montant doit cependant être <strong>proportionné à vos revenus</strong> et
                aux besoins réels de l&apos;ascendant. L&apos;administration peut contester
                une déduction jugée excessive.
              </p>
            </div>
          </section>

          {/* Cases */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases à remplir (2042)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-3 font-semibold">Case</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 font-mono text-primary">6EL</td>
                    <td className="p-3 text-text-light">Pension versée à un enfant majeur — déclarant 1</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">6EM</td>
                    <td className="p-3 text-text-light">Pension versée à un enfant majeur — déclarant 2</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">6GP</td>
                    <td className="p-3 text-text-light">Pension alimentaire versée à un ascendant</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">6GU</td>
                    <td className="p-3 text-text-light">Autres pensions alimentaires (fixées par décision de justice)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Rattachement vs pension */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Rattachement fiscal ou pension alimentaire ?
            </h2>
            <p className="text-text-light mb-4">
              Pour un enfant majeur, vous avez le choix entre deux options exclusives :
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-xl p-6 border border-gray-100">
                <p className="font-semibold text-primary mb-2">Rattachement</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-text-light">
                  <li>L&apos;enfant reste dans votre foyer fiscal</li>
                  <li>Vous gagnez une <strong>demi-part</strong> supplémentaire</li>
                  <li>Intéressant si vos revenus sont élevés (TMI 30&nbsp;% ou plus)</li>
                  <li>Pas de déduction de pension possible</li>
                </ul>
              </div>
              <div className="bg-surface rounded-xl p-6 border border-gray-100">
                <p className="font-semibold text-secondary mb-2">Déduction de pension</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-text-light">
                  <li>L&apos;enfant fait sa propre déclaration</li>
                  <li>Vous déduisez jusqu&apos;à <strong>6&nbsp;674&nbsp;€</strong></li>
                  <li>Intéressant si vos revenus sont moyens (TMI 11&nbsp;%)</li>
                  <li>L&apos;enfant déclare la pension en revenus</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-text-lighter mt-4">
              Le choix dépend de votre tranche marginale d&apos;imposition et du nombre
              d&apos;enfants. Notre questionnaire peut vous aider à comparer.
            </p>
          </section>

          {/* Sources */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.impots.gouv.fr/particulier/pensions-alimentaires"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  impots.gouv.fr — Pensions alimentaires →
                </a>
              </li>
              <li>
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr — Déduction des pensions alimentaires →
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Rattachement ou pension : quelle est la meilleure option ?
            </h2>
            <p className="text-blue-100 mb-6">
              Répondez au questionnaire pour comparer selon votre situation.
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
