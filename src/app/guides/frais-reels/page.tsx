import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Frais réels ou abattement 10 % : comment choisir ? | RécupMesEuros",
  description:
    "Frais kilométriques, repas, télétravail, double résidence : comparez l’abattement forfaitaire de 10 % et les frais réels pour payer moins d’impôts. Cases 1AK/1BK.",
};

export default function GuideFraisReels() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Frais réels ou abattement 10&nbsp;% : comment choisir ?
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Par défaut, l&apos;administration applique un <strong>abattement de 10&nbsp;%</strong> sur
            vos salaires pour couvrir vos frais professionnels. Mais si vos dépenses
            réelles dépassent ce forfait, vous avez tout intérêt à opter pour
            les <strong>frais réels</strong>.
          </p>

          {/* Le choix */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">L&apos;abattement de 10&nbsp;% : pour qui ?</h2>
            <p className="text-text-light mb-4">
              L&apos;abattement forfaitaire de 10&nbsp;% est appliqué automatiquement sur vos
              traitements et salaires. Il est plafonné à <strong>14&nbsp;171&nbsp;€</strong> (revenus
              2025) et ne peut être inférieur à <strong>504&nbsp;€</strong>.
            </p>
            <p className="text-text-light">
              Si vos frais professionnels réels (trajet, repas, télétravail...) sont
              <strong> inférieurs à 10&nbsp;%</strong> de vos salaires, gardez le forfait. Sinon,
              optez pour les frais réels.
            </p>
          </section>

          {/* Frais kilométriques */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Frais kilométriques</h2>
            <p className="text-text-light mb-4">
              C&apos;est souvent le poste le plus important. Le barème officiel tient compte
              de la puissance du véhicule et de la distance parcourue. Vous pouvez
              déduire les trajets domicile-travail (limités à <strong>40&nbsp;km par trajet</strong>,
              sauf justification) et les déplacements professionnels.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Exemple concret</p>
              <p className="text-sm text-text-light">
                Un salarié parcourant <strong>35&nbsp;km aller</strong> (soit 70&nbsp;km/jour) avec un
                véhicule de 5&nbsp;CV, 220&nbsp;jours/an, peut déduire environ{" "}
                <strong>5&nbsp;500&nbsp;€ de frais kilométriques</strong>. Si son salaire est de
                30&nbsp;000&nbsp;€, le forfait 10&nbsp;% ne représente que 3&nbsp;000&nbsp;€ : les frais réels
                sont bien plus avantageux.
              </p>
            </div>
          </section>

          {/* Repas */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Frais de repas hors domicile</h2>
            <p className="text-text-light mb-4">
              Si vous ne pouvez pas rentrer déjeuner chez vous, vous pouvez déduire la
              différence entre le coût réel du repas et la valeur forfaitaire d&apos;un
              repas pris à domicile fixée à <strong>5,35&nbsp;€</strong> (2025).
            </p>
            <p className="text-text-light">
              Si votre employeur fournit des titres-restaurant, vous devez soustraire
              la part patronale. Maximum déductible par repas :{" "}
              <strong>20,70&nbsp;€ - 5,35&nbsp;€ = 15,35&nbsp;€</strong>.
            </p>
          </section>

          {/* Télétravail */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Télétravail</h2>
            <p className="text-text-light mb-4">
              Si vous optez pour les frais réels, vous pouvez déduire vos frais de
              télétravail à hauteur de <strong>2,70&nbsp;€ par jour</strong> de télétravail,
              dans la limite de <strong>603,20&nbsp;€ par an</strong>.
            </p>
            <p className="text-sm text-text-lighter">
              Cette allocation forfaitaire couvre électricité, chauffage, abonnement
              internet, mobilier... Si votre employeur vous verse une allocation
              télétravail, celle-ci est exonérée dans les mêmes limites et n&apos;est
              pas à déclarer.
            </p>
          </section>

          {/* Double résidence */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Double résidence</h2>
            <p className="text-text-light mb-4">
              Si vous êtes contraint de louer un logement près de votre lieu de travail
              en plus de votre résidence principale (mutation, éloignement...), vous
              pouvez déduire :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Le loyer et les charges du second logement</li>
              <li>Les frais de trajet hebdomadaires entre les deux résidences</li>
              <li>Les frais supplémentaires de repas</li>
            </ul>
            <p className="text-sm text-text-lighter mt-3">
              La double résidence doit être justifiée par des contraintes
              professionnelles et non par un choix de convenance personnelle.
            </p>
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
                    <td className="p-3 font-mono text-primary">1AK</td>
                    <td className="p-3 text-text-light">Frais réels du déclarant 1 (montant total)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">1BK</td>
                    <td className="p-3 text-text-light">Frais réels du déclarant 2 (montant total)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-text-lighter mt-3">
              Joignez un détail de vos frais réels dans la rubrique prévue à cet effet
              lors de votre déclaration en ligne.
            </p>
          </section>

          {/* Quand choisir */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Quand les frais réels valent-ils le coup ?</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-3">Les frais réels sont généralement avantageux si :</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-text-light">
                <li>Vous faites <strong>plus de 30&nbsp;km</strong> de trajet domicile-travail</li>
                <li>Vous avez des frais de <strong>double résidence</strong></li>
                <li>Vous déjeunez à l&apos;extérieur <strong>sans titres-restaurant</strong></li>
                <li>Vous télétravaillez régulièrement et avez d&apos;autres frais cumulables</li>
                <li>Votre salaire est <strong>inférieur à 40&nbsp;000&nbsp;€</strong> (le forfait 10&nbsp;% est plus bas)</li>
              </ul>
            </div>
          </section>

          {/* Sources */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.impots.gouv.fr/particulier/frais-professionnels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  impots.gouv.fr — Frais professionnels →
                </a>
              </li>
              <li>
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F1989"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr — Frais réels : barème kilométrique →
                </a>
              </li>
              <li>
                <a
                  href="https://www.impots.gouv.fr/simulateur-bareme-kilometrique"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  impots.gouv.fr — Simulateur barème kilométrique →
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Frais réels ou forfait 10&nbsp;% ? Vérifiez en 5 minutes
            </h2>
            <p className="text-blue-100 mb-6">
              Notre questionnaire compare les deux options selon votre situation.
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
