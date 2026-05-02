import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Impôts frontalier Suisse : guide fiscal complet | RécupMesEuros",
  description:
    "Canton de Genève, autres cantons, cases 1AF/1BF/8TK, formulaire 2047, règle télétravail 40 % : tout comprendre sur la fiscalité des frontaliers franco-suisses.",
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Où suis-je imposé si je travaille dans le canton de Genève ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "En vertu de l’accord de 1983, les frontaliers travaillant dans le canton de Genève sont imposés en France. Le salaire est déclaré en cases 1AF/1BF du formulaire 2042 et détaillé dans le formulaire 2047.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne le crédit d’impôt pour les autres cantons suisses ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pour les cantons hors Genève, l’impôt est prélevé à la source en Suisse. La France accorde un crédit d’impôt égal à l’impôt français correspondant, à déclarer en case 8TK.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de jours de télétravail sont autorisés pour un frontalier suisse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depuis 2023, un frontalier peut télétravailler jusqu’à 40 % de son temps de travail (soit environ 96 jours par an) sans que cela remette en cause son statut fiscal de frontalier.",
      },
    },
    {
      "@type": "Question",
      name: "Quels justificatifs conserver pour la déclaration frontalier Suisse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Conservez votre attestation de résidence fiscale, le certificat de salaire suisse (Lohnausweis), l’attestation de l’employeur pour le télétravail, et le formulaire 2047 rempli.",
      },
    },
  ],
};

export default function GuideFrontalierSuisse() {
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
            Imp&ocirc;ts frontalier Suisse : guide fiscal complet
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Pr&egrave;s de <strong>200&nbsp;000 frontaliers</strong> traversent
            chaque jour la fronti&egrave;re franco-suisse. Selon votre canton de
            travail, les r&egrave;gles fiscales diff&egrave;rent radicalement.
            Voici tout ce qu&apos;il faut savoir pour d&eacute;clarer
            correctement vos revenus.
          </p>

          {/* Canton de Gen&egrave;ve */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Canton de Gen&egrave;ve : imposition en France
            </h2>
            <p className="text-text-light mb-4">
              En vertu de l&apos;accord fiscal franco-suisse de{" "}
              <strong>1983</strong>, les frontaliers travaillant dans le canton
              de Gen&egrave;ve sont impos&eacute;s <strong>en France</strong>.
              La Suisse reverse &agrave; la France une compensation &eacute;gale
              &agrave; <strong>3,5&nbsp;% de la masse salariale</strong> des
              frontaliers.
            </p>
            <p className="text-text-light">
              Votre salaire brut suisse doit &ecirc;tre converti en euros
              (taux de change annuel publi&eacute; par l&apos;administration)
              et d&eacute;clar&eacute; en{" "}
              <strong>cases 1AF (d&eacute;clarant 1) ou 1BF (d&eacute;clarant 2)</strong>{" "}
              du formulaire 2042.
            </p>
          </section>

          {/* Autres cantons */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Autres cantons : imp&ocirc;t &agrave; la source en Suisse
            </h2>
            <p className="text-text-light mb-4">
              Pour les cantons de Vaud, Berne, B&acirc;le, Zurich, etc.,
              l&apos;imp&ocirc;t est pr&eacute;lev&eacute;{" "}
              <strong>&agrave; la source en Suisse</strong>. Vous devez
              n&eacute;anmoins d&eacute;clarer ces revenus en France via le{" "}
              <strong>formulaire 2047</strong> (revenus encaiss&eacute;s &agrave;
              l&apos;&eacute;tranger).
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Cr&eacute;dit d&apos;imp&ocirc;t</p>
              <p className="text-sm text-text-light">
                La France accorde un <strong>cr&eacute;dit d&apos;imp&ocirc;t</strong>{" "}
                &eacute;gal &agrave; l&apos;imp&ocirc;t fran&ccedil;ais
                correspondant &agrave; ces revenus, d&eacute;clar&eacute; en{" "}
                <strong>case 8TK</strong>. Cela &eacute;vite la double imposition.
              </p>
            </div>
          </section>

          {/* Formulaire 2047 */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Le formulaire 2047
            </h2>
            <p className="text-text-light mb-4">
              Le formulaire 2047 est <strong>obligatoire</strong> pour tout
              frontalier suisse. Il d&eacute;taille les revenus de source
              &eacute;trang&egrave;re et permet de calculer le cr&eacute;dit
              d&apos;imp&ocirc;t applicable.
            </p>
            <p className="text-text-light">
              Renseignez-y la nature des revenus (salaires), le pays d&apos;origine
              (Suisse), le montant en devise &eacute;trang&egrave;re et le
              montant converti en euros.
            </p>
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
                    <td className="p-3 text-text-light">Salaires frontalier suisse &mdash; d&eacute;clarant 1 (canton de Gen&egrave;ve)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">1BF</td>
                    <td className="p-3 text-text-light">Salaires frontalier suisse &mdash; d&eacute;clarant 2 (canton de Gen&egrave;ve)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-primary">8TK</td>
                    <td className="p-3 text-text-light">Cr&eacute;dit d&apos;imp&ocirc;t pour revenus de source &eacute;trang&egrave;re (autres cantons)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* T&eacute;l&eacute;travail */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              R&egrave;gle t&eacute;l&eacute;travail : 40&nbsp;% (96 jours)
            </h2>
            <p className="text-text-light mb-4">
              Depuis l&apos;accord amiable de <strong>2023</strong>, un
              frontalier peut t&eacute;l&eacute;travailler depuis la France
              jusqu&apos;&agrave; <strong>40&nbsp;% de son temps de travail</strong>{" "}
              (soit environ <strong>96 jours par an</strong>) sans perdre son
              statut fiscal de frontalier.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Attention</p>
              <p className="text-sm text-text-light">
                Au-del&agrave; de 40&nbsp;%, les jours t&eacute;l&eacute;travaill&eacute;s
                en France deviennent imposables en France, m&ecirc;me pour les
                cantons hors Gen&egrave;ve. Votre employeur suisse doit fournir
                une attestation de t&eacute;l&eacute;travail.
              </p>
            </div>
          </section>

          {/* Justificatifs */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Justificatifs &agrave; conserver
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>Attestation de r&eacute;sidence fiscale fran&ccedil;aise (formulaire 2041-AS)</li>
              <li>Certificat de salaire suisse (Lohnausweis)</li>
              <li>Attestation de l&apos;employeur pour le t&eacute;l&eacute;travail</li>
              <li>Formulaire 2047 compl&eacute;t&eacute;</li>
              <li>Justificatifs de cotisations sociales (LAMal, CMU)</li>
            </ul>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Questions fr&eacute;quentes</h2>
            <div className="space-y-4">
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  O&ugrave; suis-je impos&eacute; si je travaille dans le canton de Gen&egrave;ve ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  En vertu de l&apos;accord de 1983, les frontaliers travaillant
                  dans le canton de Gen&egrave;ve sont impos&eacute;s en France.
                  Le salaire est d&eacute;clar&eacute; en cases 1AF/1BF du
                  formulaire 2042 et d&eacute;taill&eacute; dans le formulaire 2047.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Comment fonctionne le cr&eacute;dit d&apos;imp&ocirc;t pour les autres cantons suisses ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Pour les cantons hors Gen&egrave;ve, l&apos;imp&ocirc;t est
                  pr&eacute;lev&eacute; &agrave; la source en Suisse. La France
                  accorde un cr&eacute;dit d&apos;imp&ocirc;t &eacute;gal &agrave;
                  l&apos;imp&ocirc;t fran&ccedil;ais correspondant, &agrave;
                  d&eacute;clarer en case 8TK.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Combien de jours de t&eacute;l&eacute;travail sont autoris&eacute;s ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Depuis 2023, un frontalier peut t&eacute;l&eacute;travailler
                  jusqu&apos;&agrave; 40&nbsp;% de son temps de travail (environ
                  96 jours par an) sans que cela remette en cause son statut
                  fiscal de frontalier.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Quels justificatifs conserver pour la d&eacute;claration ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Conservez votre attestation de r&eacute;sidence fiscale, le
                  certificat de salaire suisse (Lohnausweis), l&apos;attestation
                  de l&apos;employeur pour le t&eacute;l&eacute;travail, et le
                  formulaire 2047 rempli.
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
                  href="https://www.impots.gouv.fr/international-particulier/questions/je-suis-frontalier-en-suisse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  impots.gouv.fr &mdash; Je suis frontalier en Suisse &rarr;
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Frontalier suisse ? V&eacute;rifiez votre d&eacute;claration en 5 minutes
            </h2>
            <p className="text-blue-100 mb-6">
              Notre questionnaire identifie les cases &agrave; remplir selon votre canton.
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
