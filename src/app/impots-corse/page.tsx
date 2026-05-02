import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Fiscalité en Corse : spécificités immobilières et patrimoniales | RécupMesEuros",
  description:
    "Régime successoral corse, indivisions foncières, crédit d’impôt investissement productif (244 quater E), plafonds Pinel adaptés : guide fiscal complet de la Corse.",
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quelles sont les spécificités successorales en Corse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Corse bénéficiait d’une exonération de droits de succession sur les immeubles situés sur l’île. Ce régime dérogatoire a été progressivement supprimé, mais des mesures transitoires s’appliquent encore pour certaines successions.",
      },
    },
    {
      "@type": "Question",
      name: "Qu’est-ce que le crédit d’impôt investissement productif en Corse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L’article 244 quater E du CGI prévoit un crédit d’impôt de 20 % (30 % pour les TPE) pour les investissements productifs neufs réalisés en Corse dans certains secteurs d’activité.",
      },
    },
    {
      "@type": "Question",
      name: "Les plafonds Pinel sont-ils différents en Corse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, la Corse est classée principalement en zone B1, avec des plafonds de loyer et de ressources des locataires spécifiques. Certaines communes bénéficient de dérogations permettant l’éligibilité au dispositif.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionnent les indivisions foncières en Corse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "De nombreux biens corses sont en indivision du fait de l’absence de règlement successoral. La loi du 6 mars 2017 a créé un groupement foncier rural pour faciliter la sortie d’indivision et la mise en valeur de ces terrains.",
      },
    },
  ],
};

export default function GuideCorse() {
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
            Fiscalit&eacute; en Corse : sp&eacute;cificit&eacute;s immobili&egrave;res et patrimoniales
          </h1>

          <p className="text-text-light mb-8 text-lg">
            La Corse b&eacute;n&eacute;ficie de <strong>r&eacute;gimes fiscaux
            d&eacute;rogatoires</strong> li&eacute;s &agrave; son histoire et
            &agrave; son insularit&eacute;. Successions, investissement productif,
            immobilier locatif : voici les r&egrave;gles sp&eacute;cifiques
            &agrave; conna&icirc;tre.
          </p>

          {/* R&eacute;gime successoral */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              R&eacute;gime successoral historique
            </h2>
            <p className="text-text-light mb-4">
              La Corse a longtemps b&eacute;n&eacute;fici&eacute; d&apos;une{" "}
              <strong>exon&eacute;ration de droits de succession</strong> sur les
              biens immobiliers situ&eacute;s sur l&apos;&icirc;le. Ce dispositif,
              en place depuis 1801, a &eacute;t&eacute; progressivement
              supprim&eacute; par la loi de finances pour 2013.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Mesures transitoires</p>
              <p className="text-sm text-text-light">
                Un abattement de <strong>50&nbsp;%</strong> sur la valeur des
                immeubles corses s&apos;appliquait pour les successions ouvertes
                jusqu&apos;au 31 d&eacute;cembre 2017. Depuis 2018, le droit
                commun s&apos;applique int&eacute;gralement, mais les
                successions ant&eacute;rieures b&eacute;n&eacute;ficient encore
                des anciennes r&egrave;gles.
              </p>
            </div>
          </section>

          {/* Indivisions fonci&egrave;res */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Indivisions fonci&egrave;res
            </h2>
            <p className="text-text-light mb-4">
              L&apos;exon&eacute;ration historique a conduit &agrave; de tr&egrave;s
              nombreuses <strong>indivisions non r&eacute;gl&eacute;es</strong>.
              De nombreux biens corses n&apos;ont jamais fait l&apos;objet d&apos;un
              partage successoral, rendant leur gestion et leur vente complexes.
            </p>
            <p className="text-text-light">
              La <strong>loi du 6 mars 2017</strong> a cr&eacute;&eacute; un
              dispositif sp&eacute;cifique de sortie d&apos;indivision et un
              groupement foncier rural adapt&eacute; au contexte corse, facilitant
              la mise en valeur de ces terrains.
            </p>
          </section>

          {/* Cr&eacute;dit d&apos;imp&ocirc;t investissement productif */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Cr&eacute;dit d&apos;imp&ocirc;t investissement productif (244 quater E)
            </h2>
            <p className="text-text-light mb-4">
              L&apos;article <strong>244 quater E du CGI</strong> pr&eacute;voit
              un cr&eacute;dit d&apos;imp&ocirc;t pour les investissements
              productifs neufs r&eacute;alis&eacute;s en Corse :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-light mb-4">
              <li><strong>20&nbsp;%</strong> du montant de l&apos;investissement pour les PME</li>
              <li><strong>30&nbsp;%</strong> pour les tr&egrave;s petites entreprises (TPE)</li>
            </ul>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Secteurs &eacute;ligibles</p>
              <p className="text-sm text-text-light">
                Industrie, artisanat, h&ocirc;tellerie, BTP, agriculture,
                transports... Les investissements doivent &ecirc;tre
                conserv&eacute;s pendant au moins <strong>5 ans</strong> et
                &ecirc;tre affect&eacute;s &agrave; une activit&eacute;
                exerc&eacute;e en Corse.
              </p>
            </div>
          </section>

          {/* Pinel adapt&eacute; */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Plafonds Pinel adapt&eacute;s
            </h2>
            <p className="text-text-light mb-4">
              La Corse est class&eacute;e principalement en{" "}
              <strong>zone B1</strong> pour le dispositif Pinel. Cela signifie
              des plafonds de loyer et de ressources des locataires
              sp&eacute;cifiques.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-surface">
                  <tr>
                    <th className="text-left p-3 font-semibold">Zone</th>
                    <th className="text-left p-3 font-semibold">Plafond de loyer/m&sup2;</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 font-mono text-primary">B1</td>
                    <td className="p-3 text-text-light">10,93&nbsp;&euro;/m&sup2; (r&eacute;f&eacute;rence 2025)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-text-lighter mt-3">
              Certaines communes corses b&eacute;n&eacute;ficient de
              d&eacute;rogations pr&eacute;fectorales permettant
              l&apos;&eacute;ligibilit&eacute; au Pinel m&ecirc;me en zone B2.
              V&eacute;rifiez l&apos;&eacute;ligibilit&eacute; de votre commune
              avant d&apos;investir.
            </p>
          </section>

          {/* Patrimoine immobilier */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Patrimoine immobilier et IFI
            </h2>
            <p className="text-text-light mb-4">
              Les biens immobiliers situ&eacute;s en Corse sont soumis &agrave;
              l&apos;<strong>IFI (Imp&ocirc;t sur la Fortune Immobili&egrave;re)</strong>{" "}
              dans les conditions de droit commun. La valeur des biens en
              indivision est r&eacute;partie entre les indivisaires au prorata
              de leurs droits.
            </p>
            <p className="text-text-light">
              L&apos;absence de titre de propri&eacute;t&eacute; formalis&eacute;
              ne dispense pas de la d&eacute;claration. En cas de doute sur la
              valeur d&apos;un bien en indivision, faites appel &agrave; un
              notaire sp&eacute;cialis&eacute;.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Questions fr&eacute;quentes</h2>
            <div className="space-y-4">
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Quelles sont les sp&eacute;cificit&eacute;s successorales en Corse ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  La Corse b&eacute;n&eacute;ficiait d&apos;une exon&eacute;ration
                  de droits de succession sur les immeubles. Ce r&eacute;gime a
                  &eacute;t&eacute; progressivement supprim&eacute;, mais des
                  mesures transitoires s&apos;appliquent encore pour certaines
                  successions ant&eacute;rieures &agrave; 2018.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Qu&apos;est-ce que le cr&eacute;dit d&apos;imp&ocirc;t investissement productif ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  L&apos;article 244 quater E du CGI pr&eacute;voit un
                  cr&eacute;dit d&apos;imp&ocirc;t de 20&nbsp;% (30&nbsp;% pour
                  les TPE) pour les investissements productifs neufs
                  r&eacute;alis&eacute;s en Corse dans certains secteurs.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Les plafonds Pinel sont-ils diff&eacute;rents en Corse ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Oui, la Corse est class&eacute;e en zone B1 avec des plafonds
                  de loyer sp&eacute;cifiques. Certaines communes b&eacute;n&eacute;ficient
                  de d&eacute;rogations pour l&apos;&eacute;ligibilit&eacute; en zone B2.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Comment fonctionnent les indivisions fonci&egrave;res en Corse ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  De nombreux biens corses sont en indivision non r&eacute;gl&eacute;e.
                  La loi du 6 mars 2017 a cr&eacute;&eacute; un groupement foncier
                  rural pour faciliter la sortie d&apos;indivision et la mise en
                  valeur de ces terrains.
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
                  href="https://www.service-public.fr/particuliers/vosdroits/F31921"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr &mdash; Fiscalit&eacute; en Corse &rarr;
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Propri&eacute;taire ou investisseur en Corse ?
            </h2>
            <p className="text-blue-100 mb-6">
              Notre questionnaire int&egrave;gre les sp&eacute;cificit&eacute;s fiscales corses.
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
