import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Impôts frontalier Luxembourg : guide fiscal | RécupMesEuros",
  description:
    "Frontalier au Luxembourg : imposition luxembourgeoise, crédit d’impôt France, 34 jours de télétravail, cases 1AF/8TK/8TI, formulaire 2047 et double déclaration.",
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Où sont imposés les frontaliers du Luxembourg ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les salaires des frontaliers sont imposés au Luxembourg (retenue à la source). La France accorde un crédit d’impôt pour éviter la double imposition, à déclarer en case 8TK du formulaire 2042.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de jours de télétravail sont autorisés pour un frontalier luxembourgeois ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L’accord franco-luxembourgeois prévoit un seuil de 34 jours de télétravail par an. Au-delà, les jours télétravaillés en France sont imposables en France.",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il remplir une déclaration au Luxembourg et en France ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, une double déclaration est nécessaire : la déclaration luxembourgeoise (modèle 100) pour l’impôt à la source, et la déclaration française (2042 + 2047) pour le crédit d’impôt.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles cases remplir sur la déclaration française ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Déclarez vos salaires luxembourgeois en case 1AF (déclarant 1) du formulaire 2047, le crédit d’impôt en case 8TK, et les revenus exonérés pris en compte pour le taux effectif en case 8TI.",
      },
    },
  ],
};

export default function GuideFrontalierLuxembourg() {
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
            Imp&ocirc;ts frontalier Luxembourg : guide fiscal
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Plus de <strong>120&nbsp;000 r&eacute;sidents fran&ccedil;ais</strong>{" "}
            travaillent au Luxembourg. L&apos;imposition a lieu au Luxembourg,
            mais la France exige une d&eacute;claration compl&egrave;te. Voici
            comment &eacute;viter la double imposition et remplir correctement
            vos formulaires.
          </p>

          {/* Imposition au Luxembourg */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Imposition au Luxembourg
            </h2>
            <p className="text-text-light mb-4">
              Conform&eacute;ment &agrave; la convention fiscale
              franco-luxembourgeoise, les salaires sont impos&eacute;s dans le{" "}
              <strong>pays o&ugrave; l&apos;activit&eacute; est exerc&eacute;e</strong>,
              c&apos;est-&agrave;-dire au Luxembourg. L&apos;imp&ocirc;t est
              retenu &agrave; la source par votre employeur luxembourgeois.
            </p>
            <p className="text-text-light">
              Le bar&egrave;me luxembourgeois est progressif, avec des classes
              d&apos;imp&ocirc;t (1, 1a, 2) d&eacute;pendant de votre situation
              familiale. Les frontaliers fran&ccedil;ais sont g&eacute;n&eacute;ralement
              en <strong>classe 1</strong> (c&eacute;libataire) ou{" "}
              <strong>classe 2</strong> (mari&eacute;/pacs&eacute;).
            </p>
          </section>

          {/* Cr&eacute;dit d&apos;imp&ocirc;t France */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Cr&eacute;dit d&apos;imp&ocirc;t en France
            </h2>
            <p className="text-text-light mb-4">
              Pour &eacute;viter la double imposition, la France accorde un{" "}
              <strong>cr&eacute;dit d&apos;imp&ocirc;t</strong> &eacute;gal &agrave;
              l&apos;imp&ocirc;t fran&ccedil;ais correspondant aux revenus
              luxembourgeois. Ce m&eacute;canisme neutralise l&apos;imp&ocirc;t
              fran&ccedil;ais sur ces revenus.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Important</p>
              <p className="text-sm text-text-light">
                Vos revenus luxembourgeois sont pris en compte pour le calcul du{" "}
                <strong>taux effectif d&apos;imposition</strong> de vos autres
                revenus fran&ccedil;ais. M&ecirc;me avec le cr&eacute;dit
                d&apos;imp&ocirc;t, d&eacute;clarer ces revenus peut augmenter
                le taux appliqu&eacute; &agrave; vos revenus fran&ccedil;ais.
              </p>
            </div>
          </section>

          {/* T&eacute;l&eacute;travail */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              T&eacute;l&eacute;travail : seuil de 34 jours
            </h2>
            <p className="text-text-light mb-4">
              L&apos;accord fiscal franco-luxembourgeois pr&eacute;voit un seuil de{" "}
              <strong>34 jours de t&eacute;l&eacute;travail par an</strong>.
              En-dessous de ce seuil, les jours t&eacute;l&eacute;travaill&eacute;s
              en France restent imposables au Luxembourg.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Au-del&agrave; de 34 jours</p>
              <p className="text-sm text-text-light">
                Les jours exc&eacute;dentaires deviennent imposables en France.
                Votre employeur doit &eacute;tablir une attestation pr&eacute;cisant
                le nombre de jours t&eacute;l&eacute;travaill&eacute;s.
                Conservez un d&eacute;compte pr&eacute;cis.
              </p>
            </div>
          </section>

          {/* Cases */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Cases &agrave; remplir</h2>
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
                    <td className="p-3 font-mono text-primary">1AF</td>
                    <td className="p-3 text-text-light">Salaires de source &eacute;trang&egrave;re &mdash; d&eacute;clarant 1</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">8TK</td>
                    <td className="p-3 text-text-light">Cr&eacute;dit d&apos;imp&ocirc;t revenus de source &eacute;trang&egrave;re</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">8TI</td>
                    <td className="p-3 text-text-light">Revenus exon&eacute;r&eacute;s retenus pour le taux effectif</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Formulaire 2047 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Double d&eacute;claration et formulaire 2047
            </h2>
            <p className="text-text-light mb-4">
              En tant que frontalier, vous devez remplir{" "}
              <strong>deux d&eacute;clarations</strong> :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-light mb-4">
              <li>
                <strong>Au Luxembourg</strong> : d&eacute;claration mod&egrave;le 100
                (ou mod&egrave;le 100F pour non-r&eacute;sidents) avant le 31 mars
              </li>
              <li>
                <strong>En France</strong> : formulaires 2042 + 2047 (revenus
                encaiss&eacute;s &agrave; l&apos;&eacute;tranger) dans les
                d&eacute;lais habituels
              </li>
            </ul>
            <p className="text-text-light">
              Le formulaire 2047 d&eacute;taille la nature, l&apos;origine et
              le montant de vos revenus luxembourgeois. Il alimente
              automatiquement les cases correspondantes de la 2042.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Questions fr&eacute;quentes</h2>
            <div className="space-y-4">
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  O&ugrave; sont impos&eacute;s les frontaliers du Luxembourg ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Les salaires sont impos&eacute;s au Luxembourg (retenue &agrave;
                  la source). La France accorde un cr&eacute;dit d&apos;imp&ocirc;t
                  pour &eacute;viter la double imposition, &agrave; d&eacute;clarer
                  en case 8TK du formulaire 2042.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Combien de jours de t&eacute;l&eacute;travail sont autoris&eacute;s ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  L&apos;accord pr&eacute;voit un seuil de 34 jours de
                  t&eacute;l&eacute;travail par an. Au-del&agrave;, les jours
                  t&eacute;l&eacute;travaill&eacute;s en France sont imposables
                  en France.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Faut-il remplir une d&eacute;claration au Luxembourg et en France ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Oui, une double d&eacute;claration est n&eacute;cessaire : la
                  d&eacute;claration luxembourgeoise (mod&egrave;le 100) et la
                  d&eacute;claration fran&ccedil;aise (2042 + 2047).
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Quelles cases remplir sur la d&eacute;claration fran&ccedil;aise ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  D&eacute;clarez vos salaires en case 1AF du formulaire 2047,
                  le cr&eacute;dit d&apos;imp&ocirc;t en case 8TK, et les
                  revenus exon&eacute;r&eacute;s pour le taux effectif en case 8TI.
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
                  href="https://www.impots.gouv.fr/international-particulier/questions/je-suis-frontalier-au-luxembourg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  impots.gouv.fr &mdash; Je suis frontalier au Luxembourg &rarr;
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Frontalier Luxembourg ? V&eacute;rifiez votre d&eacute;claration
            </h2>
            <p className="text-blue-100 mb-6">
              Notre questionnaire identifie les cases et formulaires &agrave; remplir.
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
