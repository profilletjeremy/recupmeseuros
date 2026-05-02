import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Pension alimentaire : que peut-on d\u00e9duire ? | R\u00e9cupMesEuros",
  description:
    "D\u00e9duction des pensions alimentaires vers\u00e9es aux enfants majeurs (6\u00a0674\u00a0\u20ac) et ascendants : cases 6EL/6EM/6GP/6GU, comparaison avec le rattachement fiscal.",
};

export default function GuidePensionAlimentaire() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Pension alimentaire : que peut-on d\u00e9duire ?
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Si vous versez une pension alimentaire \u00e0 un enfant majeur ou \u00e0 un
            ascendant dans le besoin, cette somme est <strong>d\u00e9ductible de votre
            revenu imposable</strong>. Un avantage souvent m\u00e9connu ou mal d\u00e9clar\u00e9.
          </p>

          {/* Enfant majeur */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Pension \u00e0 un enfant majeur</h2>
            <p className="text-text-light mb-4">
              Vous pouvez d\u00e9duire la pension vers\u00e9e \u00e0 un enfant majeur qui n&apos;est plus
              rattach\u00e9 \u00e0 votre foyer fiscal, \u00e0 condition qu&apos;il ne puisse pas subvenir
              seul \u00e0 ses besoins (\u00e9tudiant, recherche d&apos;emploi, faibles revenus).
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Plafond de d\u00e9duction</p>
              <p className="text-sm text-text-light">
                <strong>6&nbsp;674&nbsp;\u20ac</strong> par enfant et par an (montant pour les revenus 2025).
                Si l&apos;enfant vit chez vous, vous pouvez d\u00e9duire un forfait h\u00e9bergement
                + nourriture de <strong>3&nbsp;968&nbsp;\u20ac</strong> sans justificatif, plus les d\u00e9penses
                r\u00e9elles justifi\u00e9es dans la limite du plafond global.
              </p>
            </div>
            <p className="text-sm text-text-lighter mt-3">
              Attention : l&apos;enfant doit d\u00e9clarer cette pension dans ses propres revenus.
            </p>
          </section>

          {/* Ascendants */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Pension \u00e0 un ascendant dans le besoin</h2>
            <p className="text-text-light mb-4">
              Si vous aidez financi\u00e8rement vos parents ou grands-parents qui ne peuvent
              pas subvenir seuls \u00e0 leurs besoins, vous pouvez d\u00e9duire :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-light mb-4">
              <li>Les sommes vers\u00e9es directement (virements, ch\u00e8ques...)</li>
              <li>Les d\u00e9penses r\u00e9gl\u00e9es pour leur compte (loyer, EHPAD, soins...)</li>
              <li>Un <strong>forfait h\u00e9bergement de 3&nbsp;968&nbsp;\u20ac</strong> si l&apos;ascendant vit chez vous (sans justificatif)</li>
            </ul>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Pas de plafond fixe</p>
              <p className="text-sm text-text-light">
                Contrairement \u00e0 la pension pour enfant majeur, il n&apos;y a <strong>pas de
                plafond l\u00e9gal</strong> pour la d\u00e9duction des pensions vers\u00e9es aux ascendants.
                Le montant doit cependant \u00eatre <strong>proportionn\u00e9 \u00e0 vos revenus</strong> et
                aux besoins r\u00e9els de l&apos;ascendant. L&apos;administration peut contester
                une d\u00e9duction jug\u00e9e excessive.
              </p>
            </div>
          </section>

          {/* Cases */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases \u00e0 remplir (2042)</h2>
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
                    <td className="p-3 text-text-light">Pension vers\u00e9e \u00e0 un enfant majeur \u2014 d\u00e9clarant 1</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">6EM</td>
                    <td className="p-3 text-text-light">Pension vers\u00e9e \u00e0 un enfant majeur \u2014 d\u00e9clarant 2</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">6GP</td>
                    <td className="p-3 text-text-light">Pension alimentaire vers\u00e9e \u00e0 un ascendant</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">6GU</td>
                    <td className="p-3 text-text-light">Autres pensions alimentaires (fix\u00e9es par d\u00e9cision de justice)</td>
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
                  <li>Vous gagnez une <strong>demi-part</strong> suppl\u00e9mentaire</li>
                  <li>Int\u00e9ressant si vos revenus sont \u00e9lev\u00e9s (TMI 30&nbsp;% ou plus)</li>
                  <li>Pas de d\u00e9duction de pension possible</li>
                </ul>
              </div>
              <div className="bg-surface rounded-xl p-6 border border-gray-100">
                <p className="font-semibold text-secondary mb-2">D\u00e9duction de pension</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-text-light">
                  <li>L&apos;enfant fait sa propre d\u00e9claration</li>
                  <li>Vous d\u00e9duisez jusqu&apos;\u00e0 <strong>6&nbsp;674&nbsp;\u20ac</strong></li>
                  <li>Int\u00e9ressant si vos revenus sont moyens (TMI 11&nbsp;%)</li>
                  <li>L&apos;enfant d\u00e9clare la pension en revenus</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-text-lighter mt-4">
              Le choix d\u00e9pend de votre tranche marginale d&apos;imposition et du nombre
              d&apos;enfants. Notre questionnaire peut vous aider \u00e0 comparer.
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
                  impots.gouv.fr \u2014 Pensions alimentaires \u2192
                </a>
              </li>
              <li>
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr \u2014 D\u00e9duction des pensions alimentaires \u2192
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
              R\u00e9pondez au questionnaire pour comparer selon votre situation.
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
