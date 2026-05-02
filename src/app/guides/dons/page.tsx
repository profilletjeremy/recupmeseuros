import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Dons aux associations : quelle r\u00e9duction d\u2019imp\u00f4t ? | R\u00e9cupMesEuros",
  description:
    "R\u00e9duction d\u2019imp\u00f4t de 66\u00a0% \u00e0 75\u00a0% pour les dons aux associations : plafonds, cases 7UF/7UD/7UH, report sur 5 ans et dons aux partis politiques.",
};

export default function GuideDons() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Dons aux associations : quelle r\u00e9duction d&apos;imp\u00f4t ?
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Vos dons aux associations ouvrent droit \u00e0 une{" "}
            <strong>r\u00e9duction d&apos;imp\u00f4t de 66&nbsp;% \u00e0 75&nbsp;%</strong> selon le type
            d&apos;organisme. Ne laissez pas vos re\u00e7us fiscaux dormir dans un tiroir !
          </p>

          {/* 66% */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              66&nbsp;% pour les organismes d&apos;int\u00e9r\u00eat g\u00e9n\u00e9ral
            </h2>
            <p className="text-text-light mb-4">
              Les dons aux associations reconnues d&apos;utilit\u00e9 publique, fondations,
              \u0153uvres caritatives, \u00e9tablissements d&apos;enseignement, organismes culturels
              ou scientifiques donnent droit \u00e0 une r\u00e9duction de <strong>66&nbsp;%</strong> du
              montant donn\u00e9.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Plafond</p>
              <p className="text-sm text-text-light">
                Les dons sont retenus dans la limite de <strong>20&nbsp;% du revenu imposable</strong>.
                Au-del\u00e0, l&apos;exc\u00e9dent est reportable sur les <strong>5 ann\u00e9es suivantes</strong>.
              </p>
            </div>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 mt-4">
              <p className="font-semibold mb-2">Exemple</p>
              <p className="text-sm text-text-light">
                Vous donnez <strong>500&nbsp;\u20ac</strong> \u00e0 une association culturelle.
                R\u00e9duction d&apos;imp\u00f4t : 500 \u00d7 66&nbsp;% = <strong>330&nbsp;\u20ac</strong>.
              </p>
            </div>
          </section>

          {/* 75% */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              75&nbsp;% pour l&apos;aide aux personnes en difficult\u00e9
            </h2>
            <p className="text-text-light mb-4">
              Les dons aux organismes d&apos;aide aux personnes en difficult\u00e9 (Restos du
              C\u0153ur, Secours Populaire, Croix-Rouge, banques alimentaires...) b\u00e9n\u00e9ficient
              d&apos;un taux major\u00e9 de <strong>75&nbsp;%</strong>.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Plafond sp\u00e9cifique</p>
              <p className="text-sm text-text-light">
                Le taux de 75&nbsp;% s&apos;applique dans la limite de <strong>1&nbsp;000&nbsp;\u20ac</strong> de
                dons par an. Au-del\u00e0, la fraction exc\u00e9dentaire est reprise au taux de 66&nbsp;%.
              </p>
            </div>
            <div className="bg-surface rounded-xl p-6 border border-gray-100 mt-4">
              <p className="font-semibold mb-2">Exemple</p>
              <p className="text-sm text-text-light">
                Vous donnez <strong>1&nbsp;200&nbsp;\u20ac</strong> aux Restos du C\u0153ur.
                R\u00e9duction : (1&nbsp;000 \u00d7 75&nbsp;%) + (200 \u00d7 66&nbsp;%) = 750 + 132 ={" "}
                <strong>882&nbsp;\u20ac</strong>.
              </p>
            </div>
          </section>

          {/* Cases */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases \u00e0 remplir (2042-RICI)</h2>
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
                    <td className="p-3 text-text-light">Dons aux organismes d&apos;int\u00e9r\u00eat g\u00e9n\u00e9ral (66&nbsp;%)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">7UD</td>
                    <td className="p-3 text-text-light">Dons aux organismes d&apos;aide aux personnes en difficult\u00e9 (75&nbsp;%)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">7UH</td>
                    <td className="p-3 text-text-light">Report des dons exc\u00e9dentaires des ann\u00e9es pr\u00e9c\u00e9dentes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Report */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Report sur 5 ans</h2>
            <p className="text-text-light mb-4">
              Si le total de vos dons d\u00e9passe 20&nbsp;% de votre revenu imposable, la
              fraction exc\u00e9dentaire n&apos;est pas perdue. Elle est automatiquement
              report\u00e9e et utilis\u00e9e sur les <strong>5 ann\u00e9es suivantes</strong>, dans
              l&apos;ordre chronologique (les plus anciens d&apos;abord).
            </p>
            <p className="text-sm text-text-lighter">
              Pensez \u00e0 v\u00e9rifier la case 7UH si vous avez fait des dons importants
              les ann\u00e9es pr\u00e9c\u00e9dentes.
            </p>
          </section>

          {/* Partis politiques */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Dons aux partis politiques</h2>
            <p className="text-text-light mb-4">
              Les dons et cotisations vers\u00e9s aux partis politiques ouvrent \u00e9galement
              droit \u00e0 une r\u00e9duction de <strong>66&nbsp;%</strong>, dans la limite de{" "}
              <strong>15&nbsp;000&nbsp;\u20ac par personne</strong> et par an (soit 7&nbsp;500&nbsp;\u20ac de r\u00e9duction
              maximum). Ces dons sont \u00e0 reporter dans la case <strong>7UH</strong> du
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
                  impots.gouv.fr \u2014 Dons aux associations \u2192
                </a>
              </li>
              <li>
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr \u2014 R\u00e9duction d&apos;imp\u00f4t pour dons \u2192
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Avez-vous pens\u00e9 \u00e0 d\u00e9clarer tous vos dons ?
            </h2>
            <p className="text-blue-100 mb-6">
              Notre questionnaire vous aide \u00e0 n&apos;oublier aucun re\u00e7u fiscal.
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
