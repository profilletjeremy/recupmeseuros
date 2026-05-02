import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "R\u00e9gime local Alsace-Moselle : impacts fiscaux | R\u00e9cupMesEuros",
  description:
    "Cotisation maladie 1,30\u00a0%, remboursement 90\u00a0%, jours f\u00e9ri\u00e9s suppl\u00e9mentaires, dons associations droit local : les sp\u00e9cificit\u00e9s fiscales d\u2019Alsace-Moselle.",
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quel est le taux de la cotisation maladie en Alsace-Moselle ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les salari\u00e9s relevant du r\u00e9gime local d\u2019Alsace-Moselle paient une cotisation suppl\u00e9mentaire de 1,30\u00a0% sur leur salaire brut. Cette cotisation est d\u00e9ductible du revenu imposable.",
      },
    },
    {
      "@type": "Question",
      name: "Le r\u00e9gime local donne-t-il droit \u00e0 un meilleur remboursement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, le r\u00e9gime local offre un taux de remboursement de 90\u00a0% (contre 70\u00a0% dans le r\u00e9gime g\u00e9n\u00e9ral) pour les consultations et soins m\u00e9dicaux, ce qui r\u00e9duit le besoin de mutuelle compl\u00e9mentaire.",
      },
    },
    {
      "@type": "Question",
      name: "Quels sont les jours f\u00e9ri\u00e9s suppl\u00e9mentaires en Alsace-Moselle ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L\u2019Alsace-Moselle b\u00e9n\u00e9ficie de 2 jours f\u00e9ri\u00e9s suppl\u00e9mentaires : le Vendredi Saint et le 26 d\u00e9cembre (Saint-\u00c9tienne). Ces jours r\u00e9duisent le nombre de jours travaill\u00e9s et impactent le calcul des frais r\u00e9els.",
      },
    },
    {
      "@type": "Question",
      name: "Les dons aux associations de droit local ont-ils un traitement fiscal sp\u00e9cifique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les associations de droit local (inscrites au registre des associations du tribunal d\u2019instance) ouvrent droit aux m\u00eames r\u00e9ductions d\u2019imp\u00f4t que les associations loi 1901, \u00e0 condition de remplir les m\u00eames crit\u00e8res d\u2019int\u00e9r\u00eat g\u00e9n\u00e9ral.",
      },
    },
  ],
};

export default function GuideAlsaceMoselle() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            R&eacute;gime local Alsace-Moselle : impacts fiscaux
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Les d&eacute;partements du <strong>Bas-Rhin (67)</strong>,{" "}
            <strong>Haut-Rhin (68)</strong> et de la{" "}
            <strong>Moselle (57)</strong> b&eacute;n&eacute;ficient d&apos;un
            r&eacute;gime local h&eacute;rit&eacute; du droit allemand. Ce
            r&eacute;gime a des cons&eacute;quences directes sur votre
            fiscalit&eacute; et vos cotisations sociales.
          </p>

          {/* Cotisation maladie */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Cotisation maladie suppl&eacute;mentaire : 1,30&nbsp;%
            </h2>
            <p className="text-text-light mb-4">
              Les salari&eacute;s relevant du r&eacute;gime local paient une{" "}
              <strong>cotisation suppl&eacute;mentaire de 1,30&nbsp;%</strong> sur
              leur salaire brut, pr&eacute;lev&eacute;e directement sur la
              fiche de paie.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Impact fiscal</p>
              <p className="text-sm text-text-light">
                Cette cotisation est <strong>d&eacute;ductible du revenu
                imposable</strong>. Elle figure d&eacute;j&agrave; dans le
                montant net imposable pr&eacute;-rempli par votre employeur.
                V&eacute;rifiez que votre bulletin de salaire la mentionne
                bien.
              </p>
            </div>
          </section>

          {/* Remboursement 90% */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Remboursement &agrave; 90&nbsp;%
            </h2>
            <p className="text-text-light mb-4">
              En contrepartie de cette cotisation suppl&eacute;mentaire, le
              r&eacute;gime local rembourse les soins m&eacute;dicaux &agrave;{" "}
              <strong>90&nbsp;%</strong> (contre 70&nbsp;% dans le r&eacute;gime
              g&eacute;n&eacute;ral). Les frais d&apos;hospitalisation sont
              rembours&eacute;s &agrave; <strong>100&nbsp;%</strong>.
            </p>
            <p className="text-text-light">
              Cela r&eacute;duit consid&eacute;rablement le besoin de mutuelle
              compl&eacute;mentaire. Si vous optez pour une mutuelle minimale,
              les cotisations d&eacute;ductibles (Madelin, TNS) seront plus
              faibles.
            </p>
          </section>

          {/* Jours f&eacute;ri&eacute;s */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Jours f&eacute;ri&eacute;s suppl&eacute;mentaires
            </h2>
            <p className="text-text-light mb-4">
              L&apos;Alsace-Moselle b&eacute;n&eacute;ficie de{" "}
              <strong>2 jours f&eacute;ri&eacute;s suppl&eacute;mentaires</strong>{" "}
              par rapport au reste de la France :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-light mb-4">
              <li><strong>Vendredi Saint</strong> (vendredi pr&eacute;c&eacute;dant P&acirc;ques)</li>
              <li><strong>26 d&eacute;cembre</strong> (Saint-&Eacute;tienne)</li>
            </ul>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Impact sur les frais r&eacute;els</p>
              <p className="text-sm text-text-light">
                Si vous optez pour les frais r&eacute;els, le nombre de jours
                travaill&eacute;s est r&eacute;duit de 2 jours par rapport au
                calcul standard (g&eacute;n&eacute;ralement 218 jours au lieu
                de 220). Cela impacte le calcul des frais kilom&eacute;triques
                et des frais de repas.
              </p>
            </div>
          </section>

          {/* Dons associations droit local */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Dons aux associations de droit local
            </h2>
            <p className="text-text-light mb-4">
              En Alsace-Moselle, les associations sont r&eacute;gies par le{" "}
              <strong>droit local</strong> (code civil local) et non par la loi
              1901. Elles sont inscrites au registre des associations du
              tribunal d&apos;instance.
            </p>
            <p className="text-text-light">
              Les dons &agrave; ces associations ouvrent droit aux{" "}
              <strong>m&ecirc;mes r&eacute;ductions d&apos;imp&ocirc;t</strong>{" "}
              (66&nbsp;% ou 75&nbsp;%) que les associations loi 1901, &agrave;
              condition qu&apos;elles remplissent les crit&egrave;res
              d&apos;int&eacute;r&ecirc;t g&eacute;n&eacute;ral et d&eacute;livrent
              des re&ccedil;us fiscaux.
            </p>
          </section>

          {/* D&eacute;partements concern&eacute;s */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              D&eacute;partements concern&eacute;s
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-3 font-semibold">D&eacute;partement</th>
                    <th className="text-left p-3 font-semibold">Num&eacute;ro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 text-text-light">Moselle</td>
                    <td className="p-3 font-mono text-primary">57</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-light">Bas-Rhin</td>
                    <td className="p-3 font-mono text-primary">67</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-text-light">Haut-Rhin</td>
                    <td className="p-3 font-mono text-primary">68</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Questions fr&eacute;quentes</h2>
            <div className="space-y-4">
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Quel est le taux de la cotisation maladie en Alsace-Moselle ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Les salari&eacute;s paient une cotisation suppl&eacute;mentaire
                  de 1,30&nbsp;% sur leur salaire brut. Cette cotisation est
                  d&eacute;ductible du revenu imposable.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Le r&eacute;gime local donne-t-il droit &agrave; un meilleur remboursement ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Oui, le r&eacute;gime local offre un remboursement de 90&nbsp;%
                  pour les consultations et soins (contre 70&nbsp;% en r&eacute;gime
                  g&eacute;n&eacute;ral), et 100&nbsp;% pour l&apos;hospitalisation.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Quels sont les jours f&eacute;ri&eacute;s suppl&eacute;mentaires ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Le Vendredi Saint et le 26 d&eacute;cembre (Saint-&Eacute;tienne).
                  Ces 2 jours r&eacute;duisent le nombre de jours travaill&eacute;s,
                  ce qui impacte le calcul des frais r&eacute;els.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Les dons aux associations de droit local sont-ils d&eacute;ductibles ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Oui, les associations de droit local ouvrent droit aux m&ecirc;mes
                  r&eacute;ductions d&apos;imp&ocirc;t que les associations loi 1901,
                  &agrave; condition de remplir les crit&egrave;res d&apos;int&eacute;r&ecirc;t
                  g&eacute;n&eacute;ral.
                </p>
              </details>
            </div>
          </section>

          {/* Sources */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Sources officielles</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.service-public.fr/particuliers/vosdroits/F34125"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr &mdash; R&eacute;gime local d&apos;Alsace-Moselle &rarr;
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              R&eacute;sident en Alsace-Moselle ? Optimisez votre d&eacute;claration
            </h2>
            <p className="text-blue-100 mb-6">
              Notre questionnaire prend en compte les sp&eacute;cificit&eacute;s du r&eacute;gime local.
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
