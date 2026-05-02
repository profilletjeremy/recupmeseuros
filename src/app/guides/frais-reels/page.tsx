import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Frais r\u00e9els ou abattement 10\u00a0% : comment choisir ? | R\u00e9cupMesEuros",
  description:
    "Frais kilom\u00e9triques, repas, t\u00e9l\u00e9travail, double r\u00e9sidence : comparez l\u2019abattement forfaitaire de 10\u00a0% et les frais r\u00e9els pour payer moins d\u2019imp\u00f4ts. Cases 1AK/1BK.",
};

export default function GuideFraisReels() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Frais r\u00e9els ou abattement 10&nbsp;% : comment choisir ?
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Par d\u00e9faut, l&apos;administration applique un <strong>abattement de 10&nbsp;%</strong> sur
            vos salaires pour couvrir vos frais professionnels. Mais si vos d\u00e9penses
            r\u00e9elles d\u00e9passent ce forfait, vous avez tout int\u00e9r\u00eat \u00e0 opter pour
            les <strong>frais r\u00e9els</strong>.
          </p>

          {/* Le choix */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">L&apos;abattement de 10&nbsp;% : pour qui ?</h2>
            <p className="text-text-light mb-4">
              L&apos;abattement forfaitaire de 10&nbsp;% est appliqu\u00e9 automatiquement sur vos
              traitements et salaires. Il est plafonn\u00e9 \u00e0 <strong>14&nbsp;171&nbsp;\u20ac</strong> (revenus
              2025) et ne peut \u00eatre inf\u00e9rieur \u00e0 <strong>504&nbsp;\u20ac</strong>.
            </p>
            <p className="text-text-light">
              Si vos frais professionnels r\u00e9els (trajet, repas, t\u00e9l\u00e9travail...) sont
              <strong> inf\u00e9rieurs \u00e0 10&nbsp;%</strong> de vos salaires, gardez le forfait. Sinon,
              optez pour les frais r\u00e9els.
            </p>
          </section>

          {/* Frais kilom\u00e9triques */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Frais kilom\u00e9triques</h2>
            <p className="text-text-light mb-4">
              C&apos;est souvent le poste le plus important. Le bar\u00e8me officiel tient compte
              de la puissance du v\u00e9hicule et de la distance parcourue. Vous pouvez
              d\u00e9duire les trajets domicile-travail (limit\u00e9s \u00e0 <strong>40&nbsp;km par trajet</strong>,
              sauf justification) et les d\u00e9placements professionnels.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Exemple concret</p>
              <p className="text-sm text-text-light">
                Un salari\u00e9 parcourant <strong>35&nbsp;km aller</strong> (soit 70&nbsp;km/jour) avec un
                v\u00e9hicule de 5&nbsp;CV, 220&nbsp;jours/an, peut d\u00e9duire environ{" "}
                <strong>5&nbsp;500&nbsp;\u20ac de frais kilom\u00e9triques</strong>. Si son salaire est de
                30&nbsp;000&nbsp;\u20ac, le forfait 10&nbsp;% ne repr\u00e9sente que 3&nbsp;000&nbsp;\u20ac : les frais r\u00e9els
                sont bien plus avantageux.
              </p>
            </div>
          </section>

          {/* Repas */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Frais de repas hors domicile</h2>
            <p className="text-text-light mb-4">
              Si vous ne pouvez pas rentrer d\u00e9jeuner chez vous, vous pouvez d\u00e9duire la
              diff\u00e9rence entre le co\u00fbt r\u00e9el du repas et la valeur forfaitaire d&apos;un
              repas pris \u00e0 domicile fix\u00e9e \u00e0 <strong>5,35&nbsp;\u20ac</strong> (2025).
            </p>
            <p className="text-text-light">
              Si votre employeur fournit des titres-restaurant, vous devez soustraire
              la part patronale. Maximum d\u00e9ductible par repas :{" "}
              <strong>20,70&nbsp;\u20ac - 5,35&nbsp;\u20ac = 15,35&nbsp;\u20ac</strong>.
            </p>
          </section>

          {/* T\u00e9l\u00e9travail */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">T\u00e9l\u00e9travail</h2>
            <p className="text-text-light mb-4">
              Si vous optez pour les frais r\u00e9els, vous pouvez d\u00e9duire vos frais de
              t\u00e9l\u00e9travail \u00e0 hauteur de <strong>2,70&nbsp;\u20ac par jour</strong> de t\u00e9l\u00e9travail,
              dans la limite de <strong>603,20&nbsp;\u20ac par an</strong>.
            </p>
            <p className="text-sm text-text-lighter">
              Cette allocation forfaitaire couvre \u00e9lectricit\u00e9, chauffage, abonnement
              internet, mobilier... Si votre employeur vous verse une allocation
              t\u00e9l\u00e9travail, celle-ci est exon\u00e9r\u00e9e dans les m\u00eames limites et n&apos;est
              pas \u00e0 d\u00e9clarer.
            </p>
          </section>

          {/* Double r\u00e9sidence */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Double r\u00e9sidence</h2>
            <p className="text-text-light mb-4">
              Si vous \u00eates contraint de louer un logement pr\u00e8s de votre lieu de travail
              en plus de votre r\u00e9sidence principale (mutation, \u00e9loignement...), vous
              pouvez d\u00e9duire :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Le loyer et les charges du second logement</li>
              <li>Les frais de trajet hebdomadaires entre les deux r\u00e9sidences</li>
              <li>Les frais suppl\u00e9mentaires de repas</li>
            </ul>
            <p className="text-sm text-text-lighter mt-3">
              La double r\u00e9sidence doit \u00eatre justifi\u00e9e par des contraintes
              professionnelles et non par un choix de convenance personnelle.
            </p>
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
                    <td className="p-3 font-mono text-primary">1AK</td>
                    <td className="p-3 text-text-light">Frais r\u00e9els du d\u00e9clarant 1 (montant total)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">1BK</td>
                    <td className="p-3 text-text-light">Frais r\u00e9els du d\u00e9clarant 2 (montant total)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-text-lighter mt-3">
              Joignez un d\u00e9tail de vos frais r\u00e9els dans la rubrique pr\u00e9vue \u00e0 cet effet
              lors de votre d\u00e9claration en ligne.
            </p>
          </section>

          {/* Quand choisir */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Quand les frais r\u00e9els valent-ils le coup ?</h2>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-3">Les frais r\u00e9els sont g\u00e9n\u00e9ralement avantageux si :</p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-text-light">
                <li>Vous faites <strong>plus de 30&nbsp;km</strong> de trajet domicile-travail</li>
                <li>Vous avez des frais de <strong>double r\u00e9sidence</strong></li>
                <li>Vous d\u00e9jeunez \u00e0 l&apos;ext\u00e9rieur <strong>sans titres-restaurant</strong></li>
                <li>Vous t\u00e9l\u00e9travaillez r\u00e9guli\u00e8rement et avez d&apos;autres frais cumulables</li>
                <li>Votre salaire est <strong>inf\u00e9rieur \u00e0 40&nbsp;000&nbsp;\u20ac</strong> (le forfait 10&nbsp;% est plus bas)</li>
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
                  impots.gouv.fr \u2014 Frais professionnels \u2192
                </a>
              </li>
              <li>
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F1989"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr \u2014 Frais r\u00e9els : bar\u00e8me kilom\u00e9trique \u2192
                </a>
              </li>
              <li>
                <a
                  href="https://www.impots.gouv.fr/simulateur-bareme-kilometrique"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  impots.gouv.fr \u2014 Simulateur bar\u00e8me kilom\u00e9trique \u2192
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Frais r\u00e9els ou forfait 10&nbsp;% ? V\u00e9rifiez en 5 minutes
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
