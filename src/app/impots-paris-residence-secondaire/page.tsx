import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Surtaxe résidence secondaire à Paris et zones tendues | RécupMesEuros",
  description:
    "Majoration taxe d’habitation 60 % à Paris, liste des villes concernées, conditions d’exonération, taxe logement vacant, encadrement des loyers : guide complet.",
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quel est le taux de la surtaxe résidence secondaire à Paris ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La majoration de la taxe d’habitation sur les résidences secondaires à Paris est de 60 %. Elle s’applique automatiquement et s’ajoute au taux normal de la taxe d’habitation.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles villes appliquent la surtaxe résidence secondaire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La surtaxe concerne les communes situées en zone tendue : Paris, Lyon, Marseille, Bordeaux, Lille, Nice, Toulouse, Nantes, Montpellier, Strasbourg, et plus de 1 100 autres communes listées par décret.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on être exonéré de la surtaxe résidence secondaire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, dans certains cas : obligation professionnelle de résider dans un lieu différent, logement rendu inhabitable, logement mis en location ou en vente sans trouver preneur. La demande d’exonération se fait auprès du service des impôts.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle différence entre la surtaxe résidence secondaire et la taxe sur les logements vacants ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La surtaxe concerne les résidences secondaires meublées et occupées occasionnellement. La taxe sur les logements vacants (TLV) concerne les logements vides depuis plus de 1 an en zone tendue. Les deux ne se cumulent pas.",
      },
    },
  ],
};

export default function GuideResidenceSecondaireParis() {
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
            Surtaxe r&eacute;sidence secondaire &agrave; Paris et zones tendues
          </h1>

          <p className="text-text-light mb-8 text-lg">
            Depuis 2017, les communes en{" "}
            <strong>zone tendue</strong> peuvent majorer la taxe
            d&apos;habitation sur les r&eacute;sidences secondaires. &Agrave;
            Paris, cette majoration atteint{" "}
            <strong>60&nbsp;%</strong>. Voici ce que vous devez savoir.
          </p>

          {/* Majoration &agrave; Paris */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Majoration de 60&nbsp;% &agrave; Paris
            </h2>
            <p className="text-text-light mb-4">
              Le Conseil de Paris a vot&eacute; une majoration de{" "}
              <strong>60&nbsp;%</strong> de la taxe d&apos;habitation sur les
              r&eacute;sidences secondaires (taux maximum autoris&eacute; par
              la loi). Cette surtaxe s&apos;applique automatiquement &agrave;
              tout logement meubl&eacute; non occup&eacute; comme
              r&eacute;sidence principale.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Exemple concret</p>
              <p className="text-sm text-text-light">
                Pour un appartement dont la taxe d&apos;habitation de base
                serait de <strong>1&nbsp;500&nbsp;&euro;</strong>, la majoration
                de 60&nbsp;% ajoute <strong>900&nbsp;&euro;</strong>, portant le
                total &agrave; <strong>2&nbsp;400&nbsp;&euro;</strong>.
              </p>
            </div>
          </section>

          {/* Villes concern&eacute;es */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Grandes villes concern&eacute;es
            </h2>
            <p className="text-text-light mb-4">
              Plus de <strong>1&nbsp;100 communes</strong> en zone tendue
              peuvent appliquer cette surtaxe. Parmi les principales :
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {[
                "Paris",
                "Lyon",
                "Marseille",
                "Bordeaux",
                "Lille",
                "Nice",
                "Toulouse",
                "Nantes",
                "Montpellier",
                "Strasbourg",
                "Rennes",
                "Grenoble",
              ].map((ville) => (
                <div
                  key={ville}
                  className="bg-surface rounded-lg p-3 text-sm text-text-light text-center border border-gray-100"
                >
                  {ville}
                </div>
              ))}
            </div>
            <p className="text-sm text-text-lighter">
              Chaque commune fixe librement le taux de majoration entre
              5&nbsp;% et 60&nbsp;%. V&eacute;rifiez aupr&egrave;s de votre
              mairie le taux appliqu&eacute; localement.
            </p>
          </section>

          {/* Conditions et exon&eacute;rations */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Conditions d&apos;exon&eacute;ration
            </h2>
            <p className="text-text-light mb-4">
              Vous pouvez demander une exon&eacute;ration de la surtaxe dans
              les cas suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-light">
              <li>
                <strong>Obligation professionnelle</strong> : vous &ecirc;tes
                contraint de r&eacute;sider dans un lieu diff&eacute;rent de
                votre r&eacute;sidence principale pour des raisons
                professionnelles
              </li>
              <li>
                <strong>Logement inhabitable</strong> : le logement ne peut
                &ecirc;tre occup&eacute; &agrave; titre de r&eacute;sidence
                principale en raison de travaux ou de son &eacute;tat
              </li>
              <li>
                <strong>Logement en vente ou en location</strong> : vous avez
                mis le bien sur le march&eacute; sans trouver preneur depuis
                au moins 1 an
              </li>
              <li>
                <strong>Personnes &acirc;g&eacute;es ou handicap&eacute;es</strong>{" "}
                h&eacute;berg&eacute;es en &eacute;tablissement sp&eacute;cialis&eacute;
              </li>
            </ul>
            <p className="text-sm text-text-lighter mt-3">
              La demande d&apos;exon&eacute;ration doit &ecirc;tre
              adress&eacute;e au service des imp&ocirc;ts avant le 1er janvier
              de l&apos;ann&eacute;e d&apos;imposition, accompagn&eacute;e de
              justificatifs.
            </p>
          </section>

          {/* Comment d&eacute;clarer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Comment d&eacute;clarer
            </h2>
            <p className="text-text-light mb-4">
              La surtaxe est calcul&eacute;e et appliqu&eacute;e{" "}
              <strong>automatiquement</strong> par l&apos;administration
              fiscale. Aucune case sp&eacute;cifique n&apos;est &agrave;
              remplir sur la d&eacute;claration de revenus.
            </p>
            <p className="text-text-light">
              Cependant, vous devez avoir d&eacute;clar&eacute; votre bien via
              le service{" "}
              <strong>&laquo;&nbsp;G&eacute;rer mes biens immobiliers&nbsp;&raquo;</strong>{" "}
              sur impots.gouv.fr, en pr&eacute;cisant s&apos;il s&apos;agit
              d&apos;une r&eacute;sidence principale, secondaire, ou d&apos;un
              logement vacant.
            </p>
          </section>

          {/* Taxe logement vacant */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Taxe sur les logements vacants (TLV)
            </h2>
            <p className="text-text-light mb-4">
              &Agrave; ne pas confondre avec la surtaxe r&eacute;sidence
              secondaire : la <strong>TLV</strong> concerne les logements{" "}
              <strong>vides (non meubl&eacute;s) depuis plus de 1 an</strong>{" "}
              situ&eacute;s en zone tendue.
            </p>
            <div className="bg-surface rounded-xl p-6 border border-gray-100">
              <p className="font-semibold mb-2">Taux de la TLV</p>
              <p className="text-sm text-text-light">
                <strong>17&nbsp;%</strong> la premi&egrave;re ann&eacute;e de
                vacance, puis <strong>34&nbsp;%</strong> &agrave; partir de la
                deuxi&egrave;me ann&eacute;e. La TLV et la surtaxe
                r&eacute;sidence secondaire ne se cumulent pas.
              </p>
            </div>
          </section>

          {/* Encadrement des loyers */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Encadrement des loyers
            </h2>
            <p className="text-text-light mb-4">
              Dans les zones tendues, l&apos;encadrement des loyers limite le
              montant que vous pouvez demander &agrave; vos locataires. &Agrave;
              Paris, des <strong>loyers de r&eacute;f&eacute;rence</strong> sont
              fix&eacute;s par quartier et par type de logement.
            </p>
            <p className="text-text-light">
              Si votre loyer d&eacute;passe le plafond, votre locataire peut
              demander une mise en conformit&eacute;. Cela impacte directement
              vos <strong>revenus fonciers d&eacute;clar&eacute;s</strong> et
              donc votre imp&ocirc;t.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-primary">Questions fr&eacute;quentes</h2>
            <div className="space-y-4">
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Quel est le taux de la surtaxe &agrave; Paris ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  La majoration de la taxe d&apos;habitation sur les
                  r&eacute;sidences secondaires &agrave; Paris est de 60&nbsp;%.
                  Elle s&apos;ajoute au taux normal de la taxe d&apos;habitation.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Quelles villes appliquent la surtaxe ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Plus de 1&nbsp;100 communes en zone tendue : Paris, Lyon,
                  Marseille, Bordeaux, Lille, Nice, Toulouse, Nantes,
                  Montpellier, Strasbourg, etc. Chaque commune fixe son taux
                  entre 5&nbsp;% et 60&nbsp;%.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Peut-on &ecirc;tre exon&eacute;r&eacute; de la surtaxe ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  Oui : obligation professionnelle, logement inhabitable, bien
                  en vente/location sans preneur, ou personne
                  &acirc;g&eacute;e/handicap&eacute;e en &eacute;tablissement.
                  La demande se fait aupr&egrave;s du service des imp&ocirc;ts.
                </p>
              </details>
              <details className="bg-surface rounded-xl p-4 border border-gray-100">
                <summary className="font-semibold cursor-pointer">
                  Quelle diff&eacute;rence entre surtaxe et taxe logement vacant ?
                </summary>
                <p className="text-sm text-text-light mt-2">
                  La surtaxe concerne les r&eacute;sidences secondaires
                  meubl&eacute;es et occup&eacute;es occasionnellement. La TLV
                  concerne les logements vides depuis plus de 1 an. Les deux ne
                  se cumulent pas.
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
                  href="https://www.service-public.fr/particuliers/vosdroits/F949"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  service-public.fr &mdash; Taxe d&apos;habitation sur les r&eacute;sidences secondaires &rarr;
                </a>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-8 text-white text-center mb-10">
            <h2 className="text-xl font-bold mb-2">
              Propri&eacute;taire d&apos;une r&eacute;sidence secondaire ?
            </h2>
            <p className="text-blue-100 mb-6">
              Notre questionnaire identifie les taxes et optimisations possibles.
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
