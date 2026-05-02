import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Dons aux associations : quelle réduction d’impôt ? | RécupMesEuros",
  description:
    "Réduction d’impôt de 66 % à 75 % pour les dons aux associations : plafonds, cases 7UF/7UD/7UH, report sur 5 ans et dons aux partis politiques.",
};

export default function GuideDons() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Dons aux associations : quelle réduction d&apos;impôt ?
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Vos dons aux associations ouvrent droit à une{" "}
            <strong>réduction d&apos;impôt de 66&nbsp;% à 75&nbsp;%</strong> selon le type
            d&apos;organisme. Ne laissez pas vos reçus fiscaux dormir dans un tiroir !
          </p>

          {/* 66% */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              66&nbsp;% pour les organismes d&apos;intérêt général
            </h2>
            <p className="text-text-light mb-4">
              Les dons aux associations reconnues d&apos;utilité publique, fondations,
              œuvres caritatives, établissements d&apos;enseignement, organismes culturels
              ou scientifiques donnent droit à une réduction de <strong>66&nbsp;%</strong> du
              montant donné.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Plafond</p>
              <p className="text-sm text-text-light">
                Les dons sont retenus dans la limite de <strong>20&nbsp;% du revenu imposable</strong>.
                Au-delà, l&apos;excédent est reportable sur les <strong>5 années suivantes</strong>.
              </p>
            </div>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 mt-4">
              <p className="font-semibold mb-2">Exemple</p>
              <p className="text-sm text-text-light">
                Vous donnez <strong>500&nbsp;€</strong> à une association culturelle.
                Réduction d&apos;impôt : 500 × 66&nbsp;% = <strong>330&nbsp;€</strong>.
              </p>
            </div>
          </section>

          {/* 75% */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              75&nbsp;% pour l&apos;aide aux personnes en difficulté
            </h2>
            <p className="text-text-light mb-4">
              Les dons aux organismes d&apos;aide aux personnes en difficulté (Restos du
              Cœur, Secours Populaire, Croix-Rouge, banques alimentaires...) bénéficient
              d&apos;un taux majoré de <strong>75&nbsp;%</strong>.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Plafond spécifique</p>
              <p className="text-sm text-text-light">
                Le taux de 75&nbsp;% s&apos;applique dans la limite de <strong>1&nbsp;000&nbsp;€</strong> de
                dons par an. Au-delà, la fraction excédentaire est reprise au taux de 66&nbsp;%.
              </p>
            </div>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 mt-4">
              <p className="font-semibold mb-2">Exemple</p>
              <p className="text-sm text-text-light">
                Vous donnez <strong>1&nbsp;200&nbsp;€</strong> aux Restos du Cœur.
                Réduction : (1&nbsp;000 × 75&nbsp;%) + (200 × 66&nbsp;%) = 750 + 132 ={" "}
                <strong>882&nbsp;€</strong>.
              </p>
            </div>
          </section>

          {/* Cases */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases à remplir (2042-RICI)</h2>
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
                    <td className="p-3 font-mono text-primary">7UF</td>
                    <td className="p-3 text-text-light">Dons aux organismes d&apos;intérêt général (66&nbsp;%)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">7UD</td>
                    <td className="p-3 text-text-light">Dons aux organismes d&apos;aide aux personnes en difficulté (75&nbsp;%)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">7UH</td>
                    <td className="p-3 text-text-light">Report des dons excédentaires des années précédentes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Report */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Report sur 5 ans</h2>
            <p className="text-text-light mb-4">
              Si le total de vos dons dépasse 20&nbsp;% de votre revenu imposable, la
              fraction excédentaire n&apos;est pas perdue. Elle est automatiquement
              reportée et utilisée sur les <strong>5 années suivantes</strong>, dans
              l&apos;ordre chronologique (les plus anciens d&apos;abord).
            </p>
            <p className="text-sm text-text-lighter">
              Pensez à vérifier la case 7UH si vous avez fait des dons importants
              les années précédentes.
            </p>
          </section>

          {/* Partis politiques */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Dons aux partis politiques</h2>
            <p className="text-text-light mb-4">
              Les dons et cotisations versés aux partis politiques ouvrent également
              droit à une réduction de <strong>66&nbsp;%</strong>, dans la limite de{" "}
              <strong>15&nbsp;000&nbsp;€ par personne</strong> et par an (soit 7&nbsp;500&nbsp;€ de réduction
              maximum). Ces dons sont à reporter dans la case <strong>7UH</strong> du
              formulaire 2042-RICI.
            </p>
          </section>

          {/* Sources */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.impots.gouv.fr/particulier/dons-aux-associations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  impots.gouv.fr — Dons aux associations →
                </a>
              </li>
              <li>
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr — Réduction d&apos;impôt pour dons →
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Avez-vous pensé à déclarer tous vos dons ?
            </h2>
            <p className="text-blue-100 mb-6">
              Notre questionnaire vous aide à n&apos;oublier aucun reçu fiscal.
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
